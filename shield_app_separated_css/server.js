const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// MySQL 데이터베이스 연결 설정
const dbConfig = {
  host: 'localhost',
  user: 'your_mysql_username',      // MySQL 사용자명으로 변경
  password: 'your_mysql_password',  // MySQL 비밀번호로 변경
  database: 'shield_for_her',       // 데이터베이스명
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Connection pool 생성
const pool = mysql.createPool(dbConfig);

// 데이터베이스 연결 테스트
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL 데이터베이스 연결 성공!');
    connection.release();
  } catch (error) {
    console.error('❌ MySQL 연결 실패:', error);
  }
}

testConnection();

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/community', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'community.html'));
});

app.get('/community/new', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'new_post.html'));
});

app.get('/devices', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'devices.html'));
});

app.get('/notifications', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'notifications.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

app.get('/settings', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'settings.html'));
});

// API Routes

// 커뮤니티 게시글 목록 조회
app.get('/api/posts', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM posts ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '게시글을 불러올 수 없습니다.' });
  }
});

// 게시글 작성
app.post('/api/posts', async (req, res) => {
  const { category, title, content, author } = req.body;
  
  try {
    const [result] = await pool.query(
      'INSERT INTO posts (category, title, content, author) VALUES (?, ?, ?, ?)',
      [category, title, content, author]
    );
    
    res.json({ 
      success: true, 
      postId: result.insertId,
      message: '게시글이 작성되었습니다.' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '게시글 작성에 실패했습니다.' });
  }
});

// 댓글 작성
app.post('/api/comments', async (req, res) => {
  const { post_id, author, content } = req.body;
  
  try {
    const [result] = await pool.query(
      'INSERT INTO comments (post_id, author, content) VALUES (?, ?, ?)',
      [post_id, author, content]
    );
    
    res.json({ 
      success: true, 
      commentId: result.insertId,
      message: '댓글이 작성되었습니다.' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '댓글 작성에 실패했습니다.' });
  }
});

// 기기 등록
app.post('/api/devices', async (req, res) => {
  const { device_id, device_type, device_name, location, install_date } = req.body;
  
  try {
    const [result] = await pool.query(
      'INSERT INTO devices (device_id, device_type, device_name, location, install_date) VALUES (?, ?, ?, ?, ?)',
      [device_id, device_type, device_name, location, install_date]
    );
    
    res.json({ 
      success: true, 
      deviceId: result.insertId,
      message: '기기가 등록되었습니다.' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '기기 등록에 실패했습니다.' });
  }
});

// 등록된 기기 목록 조회
app.get('/api/devices', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM devices ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '기기 목록을 불러올 수 없습니다.' });
  }
});

// 알림 조회
app.get('/api/notifications', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50'
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '알림을 불러올 수 없습니다.' });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
