import express from 'express';
import { createPool } from 'mysql2/promise'; // 修改此處
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

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

// 創建連接池
const db = createPool({
    host: DB_IP,
    user: DB_USER,
    password: dbPassword,
    database: DB_DATABASE
});

// 測試資料庫連接
db.query('SELECT 1 + 1 AS solution')
    .then(([rows, fields]) => {
        console.log('資料庫已連接', rows);
    })
    .catch(err => console.error('資料庫連接失敗:', err));

// JWT 驗證中介層：確保請求帶有有效的 JWT
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


// 受保護的路由：只有帶有有效 JWT 的用戶可以訪問
app.get('/dashboard', authenticateJWT, (req, res) => {
    res.send('Welcome to the dashboard!');
});

function authenticateSpecificUser(req, res, next) {
    const user = req.user;

    // 檢查是否是指定的用戶
    if (user.username !== 'Angelo0218') {
        return res.status(403).send('Access Denied: Not Authorized');
    }
    next();
}
app.post('/addPlant', authenticateJWT, authenticateSpecificUser, async (req, res) => {
    console.log('開始處理 /addPlant 路由');
    const { plantName, plantDescription, image } = req.body;

    const query = 'INSERT INTO plants (plantName, plantDescription, image) VALUES (?, ?, ?)';

    try {
        await db.query(query, [plantName, plantDescription, image]);
        res.status(200).send('資料已成功新增！');
    } catch (err) {
        console.error('資料庫寫入錯誤:', err);
        res.status(500).send('資料庫寫入錯誤: ' + err.message);
    }
    console.log('結束處理 /addPlant 路由');
});

// 註冊新用戶
app.post('/register', async (req, res) => {
    console.log('開始處理 /register 路由');
    const { username, password, email } = req.body;

    // 確保密碼符合規定：至少6個字符
    const passwordRegex = /^(?=.*[a-z]).{6,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).send('密碼不符合規定');
    }

    // 檢查用戶名或電子郵件是否已存在
    const checkQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
    try {
        const [results] = await db.query(checkQuery, [username, email]);
        if (results.length > 0) {
            return res.status(400).send('用戶名或電子郵件已存在');
        }

        // 對密碼進行bcrypt加密
        const hashedPassword = await bcrypt.hash(password, 10);

        // 將新用戶資料儲存到資料庫
        const currentDate = new Date().toISOString().slice(0, 10);  // 取得當前日期並格式化為 YYYY-MM-DD
        const query = 'INSERT INTO users (username, password, email, creationDate) VALUES (?, ?, ?, ?)';
        await db.query(query, [username, hashedPassword, email, currentDate]);
        res.status(200).send('註冊成功！');
    } catch (err) {
        console.error('資料庫查詢錯誤:', err);
        res.status(500).send('資料庫查詢錯誤');
    }
    console.log('結束處理 /register 路由');
});


// 用戶登入路由
app.post('/login', async (req, res) => {
    console.log("開始處理 /login 路由");
    const { identifier, password } = req.body;
    
    // 從資料庫中查找用戶
    const query = 'SELECT username, password, email, userLevel, creationDate FROM users WHERE username = ? OR email = ?';
    
    try {
        const [results] = await db.query(query, [identifier, identifier]);
        console.log("資料庫查詢結果:", results);
        
        if (results.length === 0) {
            return res.status(401).send('用戶名不存在');
        }
        
        const user = results[0];
        const passwordIsValid = await bcrypt.compare(password, user.password);
        console.log("密碼驗證結果:", passwordIsValid);
        
        if (!passwordIsValid) {
            return res.status(401).send('密碼錯誤');
        }
        
        // 生成 JWT
        const token = jwt.sign({ username: user.username }, secret, { expiresIn: '1h' });
        console.log("生成的token:", token);
        
        // 返回令牌和用戶資訊
        res.status(200).json({
            message: '登入成功！',
            token: token,
            user: {
                username: user.username,
                email: user.email,
                userLevel: user.userLevel,
                creationDate: user.creationDate,
            }
        });
    } catch (err) {
        console.error("資料庫查詢錯誤:", err);
        return res.status(500).send('資料庫查詢錯誤');
    }
    
    console.log("結束處理 /login 路由");
});


app.get('/api/plants', authenticateJWT, (_, res) => {
    const query = 'SELECT * FROM plants';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send('資料庫查詢錯誤');
        }
        res.status(200).json(results);
    });
});

// 獲取當前認證用戶的信息
app.get('/api/currentUser', authenticateJWT, (req, res) => {
    const username = req.user.username;  // 從 JWT 中獲取用戶名

    // 從資料庫中查找用戶信息
    const query = 'SELECT username, email, userLevel, creationDate FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            return res.status(500).send('資料庫查詢錯誤');
        }
        if (results.length === 0) {
            return res.status(404).send('用戶未找到');
        }
        const user = results[0];
        res.status(200).json({
            username: user.username,
            email: user.email,
            userLevel: user.userLevel,
            creationDate: user.creationDate
        });
    });
});

// 啟動伺服器
app.listen(port, () => {
    console.log(`伺服器正在運行，地址：http://localhost:${port}`);
});
