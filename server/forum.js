import express from 'express';
import multer from 'multer';
import path from 'path';

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
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
    forumRouter.get('/posts', async (req, res) => {
        try {
            const [posts] = await db.query(`
                SELECT posts.id, posts.title, posts.content, posts.imageUrl, posts.created_at, posts.updated_at
                FROM posts
            `);
            res.json(posts);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    forumRouter.post('/posts', authenticateJWT, upload.single('image'), async (req, res) => {
        const { title, content } = req.body;
        const imageUrl = req.file ? req.file.path : null;
        try {
            await db.query('INSERT INTO posts (title, content, imageUrl) VALUES (?, ?, ?)', [title, content, imageUrl]);
            res.status(201).send('帖子已成功發布');
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

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
