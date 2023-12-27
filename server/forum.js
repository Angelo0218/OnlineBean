import express from 'express';
import multer from 'multer';
import path from 'path';

// 配置 Multer 以處理圖片上傳
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname)); // 以當前時間戳命名檔案
        }
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('只允許上傳圖片類型的檔案！'));
        }
    }
});

const forumRouter = express.Router();

export function forumRoutes(db, authenticateJWT) {
    // 獲取所有帖子
    forumRouter.get('/posts', async (req, res) => {
        try {
            const [posts] = await db.query(`
                SELECT posts.id, posts.title, posts.content, posts.imageUrl, posts.created_at, posts.updated_at, 
                    users.username, users.avatar 
                FROM posts 
                JOIN users ON posts.userID = users.userID
            `);
            res.json(posts);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // 發布新帖子
    forumRouter.post('/posts', authenticateJWT, upload.single('image'), async (req, res) => {
        const { title, content } = req.body;
        const imageUrl = req.file ? req.file.path : null;
        const userId = req.user.id; // 從 JWT 中獲取用戶 ID
        try {
            await db.query('INSERT INTO posts (userID, title, content, imageUrl) VALUES (?, ?, ?, ?)', [userId, title, content, imageUrl]);
            res.status(201).send('帖子已成功發布');
        } catch (err) {
            res.status(500).send(err.message);
        }
    });


    // 為特定帖子添加評論
    forumRouter.post('/posts/:postId/comments', authenticateJWT, async (req, res) => {
        const { postId } = req.params;
        const { content } = req.body;
        const userId = req.user.id; // 從 JWT 中獲取用戶 ID
        try {
            await db.query('INSERT INTO comments (post_id, userID, content) VALUES (?, ?, ?)', [postId, userId, content]);
            res.status(201).send('評論已成功發布');
        } catch (err) {
            res.status(500).send(err.message);
        }
    });


    // 為特定帖子添加評論
    forumRouter.post('/posts/:postId/comments', authenticateJWT, async (req, res) => {
        const { postId } = req.params;
        const { content } = req.body;
        const userId = req.user.id; // 從 JWT 中獲取用戶 ID
        try {
            await db.query('INSERT INTO comments (post_id, userID, content) VALUES (?, ?, ?)', [postId, userId, content]);
            res.status(201).send('評論已成功發布');
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    return forumRouter;
}
