const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

// 创建 Multer 实例
const upload = multer({ storage: storage });

app.use(cors());

app.use(express.static(path.join(__dirname)));

// 设置路由和中间件
app.post('/upload', upload.single('file'), (req, res) => {
  console.log('----文件上传', req.file);
  res.json({
    success: true,
    data: `${req.file.path}`,
    message: '文件上传成功',
  });
});

// 请求文章markdown文件
app.get('/article', (req, res) => {
  const filePath = path.join(__dirname) + '/README.md';
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      // 处理读取文件时出现的错误
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    // 在这里处理读取到的Markdown内容
    res.send(data);
  });
});

// 启动服务
app.listen(4000, () => {
  console.log('文件上传服务已启动，监听端口4000...');
});
