import express from 'express';
import multer from 'multer';
import path from 'path';

const forumRouter = express.Router();

// Multer 配置用於圖片上傳
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // 設置文件存儲路徑
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

export function forumRoutes(db, authenticateJWT) {
    // 獲取所有帖子
    forumRouter.get('/posts', async (req, res) => {
        try {
            const [posts] = await db.query('SELECT * FROM posts');
            res.json(posts);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // 發布新帖子，需要身份驗證
    forumRouter.post('/posts', authenticateJWT, upload.single('image'), async (req, res) => {
        const { title, content } = req.body;
        let imageUrl = req.file ? req.file.path : '';

        try {
            await db.query('INSERT INTO posts (title, content, imageUrl) VALUES (?, ?, ?)', [title, content, imageUrl]);
            res.status(201).send('帖子已成功發布');
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // 獲取特定帖子的所有評論
    forumRouter.get('/posts/:postId/comments', async (req, res) => {
        const { postId } = req.params;
        try {
            const [comments] = await db.query('SELECT * FROM comments WHERE post_id = ?', [postId]);
            res.json(comments);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // 為特定帖子添加評論，需要身份驗證
    forumRouter.post('/posts/:postId/comments', authenticateJWT, async (req, res) => {
        const { postId } = req.params;
        const { content } = req.body;
        try {
            await db.query('INSERT INTO comments (post_id, content) VALUES (?, ?)', [postId, content]);
            res.status(201).send('評論已成功發布');
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    return forumRouter;
}
