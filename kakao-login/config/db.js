require("dotenv").config();
const mysql = require("mysql2/promise"); // ✅ Promise 기반으로 변경

// ✅ MySQL 연결 풀 생성
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT, // ✅ 포트 반영
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection((err, connection) => {
    // early return pattern
    // 에러를 만났을 때, 함수를 상단에서 조기 종료시키는 패턴
    // 실제로는 if~els와 같은 효과
    if (err) {
        console.log(`db connection failed : ${err.message}`);
        return;            // error가 발생하면 함수를 조기 종료할 수 있게 return
    }

    console.log("db connection success");
    connection.release();  // release로 함수 종료하면 getConnection반환
});

module.exports = pool;
