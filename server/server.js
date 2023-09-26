import express from 'express';
import { createPool } from 'mysql2/promise';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const port = 3000;
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

const db = createPool({
    host: DB_IP,
    user: DB_USER,
    password: dbPassword,
    database: DB_DATABASE
});

function authenticateJWT(req, res, next) {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send('Access Denied');
    }

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            return res.status(403).send('Invalid token');
        }
        req.user = user;
        next();
    });
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

app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    const passwordRegex = /^(?=.*[a-z]).{6,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).send('密碼不符合規定');
    }

    const checkQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
    try {
        const [results] = await db.query(checkQuery, [username, email]);
        if (results.length > 0) {
            return res.status(400).send('用戶名或電子郵件已存在');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const currentDate = new Date().toISOString().slice(0, 10);
        const query = 'INSERT INTO users (username, password, email, creationDate, role) VALUES (?, ?, ?, ?, ?)';
        await db.query(query, [username, hashedPassword, email, currentDate, 'regular_user']); // 設定默認角色為 'regular_user'
        res.status(200).send('註冊成功！');
    } catch (err) {
        res.status(500).send('資料庫查詢錯誤');
    }
});

app.post('/login', async (req, res) => {
    const { identifier, password } = req.body;
    const query = 'SELECT username, password, email, role, creationDate FROM users WHERE username = ? OR email = ?';
    try {
        const [results] = await db.query(query, [identifier, identifier]);
        if (results.length === 0) {
            return res.status(401).send('用戶名不存在');
        }

        const user = results[0];
        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send('密碼錯誤');
        }

        const token = jwt.sign({ username: user.username }, secret, { expiresIn: '1h' });
        res.status(200).json({
            message: '登入成功！',
            token: token,
            user: {
                username: user.username,
                email: user.email,
                role: user.role,
                creationDate: user.creationDate,
            }
        });
    } catch (err) {
        res.status(500).send('資料庫查詢錯誤');
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
    const query = 'SELECT username, email, role, creationDate FROM users WHERE username = ?'; // 修改了這裡
    try {
        const [results] = await db.query(query, [username]);
        if (results.length === 0) {
            return res.status(404).send('用戶未找到');
        }
        const user = results[0];
        res.status(200).json({
            username: user.username,
            email: user.email,
            role: user.role, // 修改了這裡
            creationDate: user.creationDate
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
    console.log(userId, plantId);
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

    // 逆操作以恢復原始的 userPlantId
    userPlantId = userPlantId.substring(23) + "-" + userPlantId.substring(18, 23) + "-" + userPlantId.substring(13, 18) + "-" + userPlantId.substring(8, 13) + "-" + userPlantId.substring(0, 8);

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
        console.log(`UserId: ${userId}`);
        console.log('Plant Results:', plantResults);

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




app.listen(port, () => {
    console.log(`伺服器正在運行，地址：http://localhost:${port}`);
});
