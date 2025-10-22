const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// 연결확인
db.getConnection((err, connection) => {
  // early return pattern
  // 에러를 만났을 때, 함수를 상단에서 조기 종료 시키는 패턴
  // 실제로는 if ~ else와 같은 효과
  if (err) {
    console.log(`db connection failed : ${err.message}`);
    return;
  }

  console.log("db connection success");
  connection.release();
});
module.exports = db;

// npm i express mysql2 jsonwebtoken
