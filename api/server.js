// api/server.js
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();
const PORT = process.env.PORT || 3000;

// 允许所有来源（开发/测试用，正式环境可以指定 Netlify 域名）
// app.use(cors());

// 如果你希望更安全，可以只允许你自己的 Netlify 域名：
app.use(cors({ origin: 'https://comfy-valkyrie-40dc4a.netlify.app' }));

// --- 数据库配置 ---
// 从环境变量中读取敏感信息，这是一个好习惯
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'rating-app';
const COLLECTION_NAME = 'scores';

let db; // 用于存储数据库连接

// 连接数据库的函数
async function connectToDatabase() {
    if (db) return db;
    try {
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        console.log('✓ Successfully Connected to MongoDB Atlas');
        db = client.db(DB_NAME);
        return db;
    } catch (error) {
        console.error('✕ Fail to Connect to Database:', error);
        process.exit(1); // 连接失败则退出程序
    }
}

app.use(express.json());

// 接收评分提交
app.post('/submit-score', async (req, res) => {
    const { imageId, score } = req.body;

    // 简单校验
    if (!imageId || score === undefined) {
        return res.status(400).json({ error: 'Missing imageId or score' });
    }

    try {
        const database = await connectToDatabase();
        const collection = database.collection(COLLECTION_NAME);

        // 插入新记录
        const result = await collection.insertOne({
            imageId,
            score,
            timestamp: new Date()
        });

        console.log(`✓ Data are Inserted, ID: ${result.insertedId}`);
        res.json({ success: true });
    } catch (error) {
        console.error('✕ Data Saving Failed:', error);
        res.status(500).json({ error: 'Saving Failed, Try Again Later' });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`✓ Services Running at Port ${PORT}`);
});