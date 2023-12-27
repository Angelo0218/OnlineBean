import express from 'express';
import { createPool } from 'mysql2/promise';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import { createCanvas } from 'canvas';
import { forumRoutes } from './forum.js';
dotenv.config();

const app = express();
const secret = process.env.JWT_SECRET;
const dbPassword = process.env.DB_PASSWORD;
const DB_USER = process.env.DB_USER;
const DB_IP = process.env.DB_IP;
const DB_DATABASE = process.env.DB_DATABASE;

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "太多請求了，請稍後再試。"
});

app.use('/login', limiter);
app.use('/register', limiter);
app.use('/uploads', express.static('uploads'));


const db = createPool({
    host: DB_IP,
    port: 3306,
    user: DB_USER,
    password: dbPassword,
    database: DB_DATABASE
});

app.use('/forum', forumRoutes(db, authenticateJWT));
app.set('trust proxy', 1);

// JWT 加密
function encryptJWT(payload) {
    return jwt.sign(payload, secret, { expiresIn: '1h' });
}

// JWT 解密
function decryptJWT(token) {
    try {
        return jwt.verify(token, secret);
    } catch (err) {
        return null;
    }
}

async function authenticateJWT(req, res, next) {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send('Access Denied');
    }

    try {
        const user = decryptJWT(token);
        if (!user) {
            return res.status(403).send('Invalid token');
        }
        req.user = user;
        next();
    } catch (err) {
        return res.status(403).send('Invalid token');
    }
}

function authenticateSpecificUser(req, res, next) {
    const user = req.user;
    const username = user.username;
    const query = 'SELECT role FROM users WHERE username = ?';
    db.query(query, [username])
        .then(([results]) => {
            if (results.length === 0) {
                return res.status(404).send('用戶未找到');
            }
            const { role } = results[0];
            if (role !== 'admin') { // 修改為檢查 admin 角色
                return res.status(403).send('Access Denied: Not Authorized');
            }
            next();
        })
        .catch(err => {
            res.status(500).send('資料庫查詢錯誤: ' + err.message);
        });
}
app.post('/choosePlant', authenticateJWT, async (req, res) => {
    const username = req.user.username;
    const { plantId } = req.body;

    const checkRoleQuery = 'SELECT userID, role FROM users WHERE username = ?';
    try {
        const [results] = await db.query(checkRoleQuery, [username]);
        if (results.length === 0) {
            return res.status(404).send('用戶未找到');
        }
        const { userID: userId, role } = results[0];
        if (role !== 'authorized_user') {
            return res.status(403).send('您沒有選擇植物的權限');
        }

        const insertQuery = 'INSERT INTO user_plants (user_plant_id, user_id, plant_id, planting_date) VALUES (UUID(), ?, ?, ?)';
        const currentDate = new Date().toISOString().slice(0, 10);
        await db.query(insertQuery, [userId, plantId, currentDate]);

        res.status(200).send('植物選擇成功！');
    } catch (err) {
        res.status(500).send('資料庫操作錯誤: ' + err.message);
    }
});




app.post('/addPlant', authenticateJWT, authenticateSpecificUser, async (req, res) => {
    const { plantName, plantDescription, image } = req.body;
    const query = 'INSERT INTO plants (plantName, plantDescription, image) VALUES (?, ?, ?)';
    try {
        await db.query(query, [plantName, plantDescription, image]);
        res.status(200).send('資料已成功新增！');
    } catch (err) {
        res.status(500).send('資料庫寫入錯誤: ' + err.message);
    }
});

// Multer 設置
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// 檔案過濾器，只允許特定類型的圖片
const fileFilter = (req, file, cb) => {
    // 允許的擴展名
    const filetypes = /jpeg|jpg|png/;
    // 檢查擴展名
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // 檢查 MIME 類型
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('錯誤: 只支持圖片(jpeg|jpg|png)');
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });


app.post('/register', upload.single('avatar'), async (req, res) => {
    const { username, password, email } = req.body;

    // 先檢查數據庫中是否已經存在相同的用戶名或電子郵件
    try {
        const existingUserQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
        const [existingUsers] = await db.query(existingUserQuery, [username, email]);
        if (existingUsers.length > 0) {
            return res.status(400).send('用戶名或電子郵件已被使用');
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('數據庫查詢錯誤');
    }

    // 處理大頭貼
    let avatarPath;
    if (!req.file) {
        // 沒有上傳大頭貼，則生成預設圖片
        avatarPath = `uploads/${username[0].toUpperCase()}-default.jpg`;
        createDefaultAvatar(avatarPath, username[0]);
    } else {
        // 壓縮上傳的大頭貼
        const compressedImagePath = 'uploads/compressed-' + req.file.filename;
        await sharp(req.file.path)
            .resize(256, 256)
            .jpeg({ quality: 80 })
            .toFile(compressedImagePath);
        avatarPath = compressedImagePath;
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const currentDate = new Date();  // 當前時間
        const query = 'INSERT INTO users (username, password, email, avatar, creationDate, lastUpdateDate) VALUES (?, ?, ?, ?, ?, NULL)';  // 將 lastUpdateDate 明確設置為 NULL
        await db.query(query, [username, hashedPassword, email, avatarPath, currentDate]);
        res.status(200).send('註冊成功！');
    } catch (err) {
        console.error(err);
        res.status(500).send('服務器錯誤');
    }
});



function createDefaultAvatar(filePath, text) {
    const canvas = createCanvas(256, 256);
    const context = canvas.getContext('2d');
    context.fillStyle = '#ddd'; // 背景色
    context.fillRect(0, 0, 256, 256);
    context.font = 'bold 120px sans-serif';
    context.fillStyle = '#555'; // 文字顏色
    context.textAlign = 'center';
    context.fillText(text.toUpperCase(), 128, 175);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filePath, buffer);
}

app.post('/login', async (req, res) => {
    const { identifier, password } = req.body;

    // 檢查請求體中是否有必要的字段
    if (!identifier || !password) {
        return res.status(400).send('需要用戶名和密碼');
    }

    // 更新 SQL 查詢以包括用戶的大頭貼路徑
    const query = 'SELECT username, password, email, role, creationDate, avatar FROM users WHERE username = ? OR email = ?';

    try {
        // 從資料庫獲取用戶資料
        const [rows] = await db.query(query, [identifier, identifier]);
        if (rows.length === 0) {
            return res.status(401).send('用戶名或密碼錯誤');
        }

        // 取出查詢結果中的用戶資料
        const user = rows[0];

        // 比較密碼
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).send('用戶名或密碼錯誤');
        }

        // 生成 JWT
        const token = encryptJWT({ username: user.username, role: user.role });

        // 返回成功響應、JWT和用戶信息，包括大頭貼路徑
        res.status(200).json({
            message: '登入成功！',
            token: token,
            user: {
                username: user.username,
                email: user.email,
                role: user.role,
                creationDate: user.creationDate,
                avatar: user.avatar // 大頭貼路徑
            }
        });
    } catch (err) {
        // 處理可能的錯誤
        console.error(err);
        res.status(500).send('伺服器錯誤');
    }
});



app.get('/api/plants', authenticateJWT, async (_, res) => {
    const query = 'SELECT * FROM plants';
    try {
        const [results] = await db.query(query);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).send('資料庫查詢錯誤');
    }
});

app.get('/api/currentUser', authenticateJWT, async (req, res) => {
    const username = req.user.username;
    // 更新 SQL 查詢以包括用戶的大頭貼路徑
    const query = 'SELECT username, email, role, creationDate, avatar FROM users WHERE username = ?';

    try {
        const [results] = await db.query(query, [username]);
        if (results.length === 0) {
            return res.status(404).send('用戶未找到');
        }
        const user = results[0];

        // 返回用戶信息和大頭貼路徑
        res.status(200).json({
            username: user.username,
            email: user.email,
            role: user.role,
            creationDate: user.creationDate,
            avatar: user.avatar // 大頭貼路徑
        });
    } catch (err) {
        res.status(500).send('資料庫查詢錯誤');
    }
});


app.get('/api/userPlants', authenticateJWT, async (req, res) => {
    const username = req.user.username;

    // 獲取用戶ID
    const userIdQuery = 'SELECT userID FROM users WHERE username = ?';
    try {
        const [userResults] = await db.query(userIdQuery, [username]);
        if (userResults.length === 0) {
            return res.status(404).send('用戶未找到');
        }
        const userId = userResults[0].userID;

        // 根據用戶ID查詢其植物背包中的植物
        const userPlantsQuery = `
            SELECT user_plants.user_plant_id, plants.plantID, plants.plantName, plants.plantDescription, plants.image
            FROM user_plants
            JOIN plants ON user_plants.plant_id = plants.plantID
            WHERE user_plants.user_id = ?`;

        const [plantsResults] = await db.query(userPlantsQuery, [userId]);
        res.status(200).json(plantsResults);
    } catch (err) {
        res.status(500).send('資料庫查詢錯誤: ' + err.message);
    }
});

app.get('/api/plantDetails', authenticateJWT, async (req, res) => {
    const userId = req.user.userId; // 從JWT獲取用戶ID
    const plantId = req.query.plantId; // 從查詢參數獲取plantId
    // console.log(userId, plantId);
    // 檢查該用戶是否有權訪問該植物
    const checkAuthorizationQuery = 'SELECT * FROM user_plants WHERE user_id = ? AND plant_id = ?';
    try {
        const [authorizationResults] = await db.query(checkAuthorizationQuery, [userId, plantId]);
        if (authorizationResults.length === 0) {
            return res.status(403).send('您沒有訪問該植物的權限');
        }

        // 如果用戶有權訪問，則繼續處理請求，獲取植物詳細信息並返回給用戶
        const getPlantDetailsQuery = 'SELECT * FROM plants WHERE plantID = ?';
        const [plantDetailsResults] = await db.query(getPlantDetailsQuery, [plantId]);

        if (plantDetailsResults.length === 0) {
            return res.status(404).send('植物未找到');
        }

        // 返回植物詳細信息
        res.status(200).json(plantDetailsResults[0]);

    } catch (err) {
        res.status(500).send('資料庫操作錯誤: ' + err.message);
    }
});
app.get('/api/checkUserPlant/:userPlantId', authenticateJWT, async (req, res) => {
    const username = req.user.username;
    let userPlantId = req.params.userPlantId;
    // console.log("Received ID:", userPlantId);

    // 逆操作以恢復原始的 userPlantId
    userPlantId = userPlantId.substring(24, 36) + "-" + userPlantId.substring(20, 24) + "-" + userPlantId.substring(16, 20) + "-" + userPlantId.substring(12, 16) + "-" + userPlantId.substring(0, 12);
    // console.log("Reversed ID:", userPlantId);


    // 查詢用戶ID
    const userIdQuery = 'SELECT userID FROM users WHERE username = ?';
    try {
        const [userResults] = await db.query(userIdQuery, [username]);
        if (userResults.length === 0) {
            return res.status(404).send('用戶未找到');
        }
        const userId = userResults[0].userID;

        // 檢查 userPlantId 是否屬於該用戶
        const checkUserPlantQuery = 'SELECT * FROM user_plants WHERE user_plant_id = ? AND user_id = ?';
        const [plantResults] = await db.query(checkUserPlantQuery, [userPlantId, userId]);

        // 在此處打印 userId 和 plantResults
        // console.log(`UserId: ${userId}`);
        // console.log('Plant Results:', plantResults);

        if (plantResults.length === 0) {
            // userPlantId 不屬於該用戶
            return res.status(403).send('無權訪問此植物');
        }

        // userPlantId 屬於該用戶
        res.status(200).send('訪問許可');
    } catch (err) {
        res.status(500).send('資料庫查詢錯誤: ' + err.message);
    }
});

app.get('/api/checkTokenValidity', authenticateJWT, (req, res) => {
    // token驗證
    res.status(200).send('Token is valid');
});

app.post('/updateUserInfo', authenticateJWT, upload.single('avatar'), async (req, res) => {
    const username = req.user.username;
    const { newPassword, newUsername, email, currentPassword } = req.body;
    let newAvatarPath = req.file ? 'uploads/compressed-' + req.file.filename : null;

    try {
        // 從數據庫中獲取當前用戶信息
        const [currentUser] = await db.query('SELECT password, email, avatar FROM users WHERE username = ?', [username]);
        if (currentUser.length === 0) {
            return res.status(404).send('用戶未找到');
        }
        const user = currentUser[0];

        // 驗證當前密碼
        if (!currentPassword || !await bcrypt.compare(currentPassword, user.password)) {
            return res.status(401).send('當前密碼錯誤');
        }

        // 處理大頭貼更新
        if (newAvatarPath) {
            await sharp(req.file.path)
                .resize(256, 256)
                .jpeg({ quality: 80 })
                .toFile(newAvatarPath);

            // 刪除舊的大頭貼文件
            if (user.avatar && fs.existsSync(user.avatar)) {
                fs.unlinkSync(user.avatar);
            }
        } else {
            newAvatarPath = user.avatar; // 如果沒有新上傳的圖片，使用舊的圖片路徑
        }

        // 準備更新用戶信息
        const hashedPassword = newPassword ? await bcrypt.hash(newPassword, 10) : user.password;
        const updatedUsername = newUsername || username;
        const updatedEmail = email || user.email;

        // 更新數據庫
        await db.query('UPDATE users SET username = ?, password = ?, email = ?, avatar = ? WHERE username = ?', [updatedUsername, hashedPassword, updatedEmail, newAvatarPath, username]);

        res.status(200).send('用戶信息更新成功！');
    } catch (err) {
        console.error(err);
        res.status(500).send('伺服器錯誤');
    }
});



const port = process.env.PORT || 3011;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});