const express = require("express");
const kakaoRouter = require("./routes/kakaoRouter");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());
app.use("/", kakaoRouter);

try {
  const sql = `
    INSERT INTO T_USER (EMAIL, NAME, NICKNAME, PROFILE_IMG, KAKAO_ID, CREATED_AT)
    VALUES (?, ?, ?, ?, ?, NOW())
    ON DUPLICATE KEY UPDATE
      NAME = VALUES(NAME),
      NICKNAME = VALUES(NICKNAME),
      PROFILE_IMG = VALUES(PROFILE_IMG),
      KAKAO_ID = VALUES(KAKAO_ID)
  `;
  console.log("🔍 SQL 실행:", sql, [email, nickname, nickname, profile_img, kakao_id]);
  await pool.query(sql, [email, nickname, nickname, profile_img, kakao_id]);
  console.log("💾 DB 저장/업데이트 완료");
} catch (err) {
  console.error("❌ DB 오류:", err);
}

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
