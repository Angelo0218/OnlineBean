import express from 'express';
import mysql from 'mysql';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';


// 讀取 .env 配置文件中的環境變量
dotenv.config();

const app = express();
const port = 3000;
const secret = process.env.JWT_SECRET;  // JWT 密鑰
const dbPassword = process.env.DB_PASSWORD;  // 資料庫密碼
const DB_USER = process.env.DB_USER;
const DB_IP = process.env.DB_IP;
const DB_DATABASE = process.env.DB_DATABASE;

// 中介軟體，用於解析 JSON 請求
app.use(express.json());

// 允許跨域請求
app.use(cors());

// 資料庫配置和連接
const db = mysql.createConnection({
    host: DB_IP,
    user: DB_USER,
    password: dbPassword,
    database: DB_DATABASE
});

// 初始化資料庫連接
db.connect(err => {
    if (err) {
        console.error('資料庫連接失敗:', err.stack);
        return;
    }
    console.log('資料庫已連接');
});

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

// 註冊新用戶
app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    // 確保密碼符合規定：至少8個字符，包含大小寫字母
    const passwordRegex = /^(?=.*[a-z]).{6,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).send('密碼不符合規定');
    }


    // 對密碼進行bcrypt加密
    const hashedPassword = await bcrypt.hash(password, 10);

    // 將新用戶資料儲存到資料庫
    const currentDate = new Date().toISOString().slice(0, 10);  // 取得當前日期並格式化為 YYYY-MM-DD
    const query = 'INSERT INTO users (username, password, email, creationDate) VALUES (?, ?, ?, ?)';
    db.query(query, [username, hashedPassword, email, currentDate], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send('Registered successfully!');
    });
});


// 用戶登入路由
app.post('/login', (req, res) => {
    const { identifier, password } = req.body;

    // 從資料庫中查找用戶
    const query = 'SELECT username, password, email FROM users WHERE username = ? OR email = ?';
    db.query(query, [identifier, identifier], async (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (results.length === 0) {
            return res.status(401).send('無效的用戶名或密碼');
        }

        const user = results[0];

        const passwordIsValid = await bcrypt.compare(password, user.password);

        if (!passwordIsValid) {
            return res.status(401).send('無效的用戶名或密碼');
        }

        // 生成 JWT
        const token = jwt.sign({ username: user.username }, secret, { expiresIn: '1h' });

        // 返回令牌和用戶資訊
        res.status(200).json({
            message: '登入成功!',
            token: token,
            user: {
                username: user.username,
                email: user.email
            }
        });
    });
});




// 啟動伺服器
app.listen(port, () => {
    console.log(`伺服器正在運行，地址：http://localhost:${port}`);
});
