const express = require("express");
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/jwt");

// 회원가입 라우터
router.post("/members", (req, res) => {
  console.log(req.body);
  // 클라이언트에서 받은 데이터 구조 해체
  const {
    EMAIL,
    PASSWORD,
    NAME,
    PHONE_NUMBER,
    ADDRESS,
    EM_PHONE_NUMBER,
    DEVICE_NO,
    HARASSMENT_EXP,
  } = req.body;

  const sql =
    "INSERT INTO T_USER (EMAIL, PASSWORD, NAME, PHONE_NUMBER, ADDRESS, EM_PHONE_NUMBER, DEVICE_NO, HARASSMENT_EXP, CREATED_AT) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())";

  const params = [
    EMAIL,
    PASSWORD,
    NAME,
    PHONE_NUMBER,
    ADDRESS,
    EM_PHONE_NUMBER,
    DEVICE_NO,
    HARASSMENT_EXP,
  ];

  db.execute(sql, params, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    if (result.affectedRows > 0) {
      // 회원가입 성공
      res.json({
        success: true,
        message: "회원가입 성공!",
      });
    } else {
      // 회원가입 실패
      res.json({
        success: false,
        message: "회원가입 실패..",
      });
    }
  });
});

// 로그인 라우터
router.post("/login", (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  const sql = "SELECT * FROM T_USER WHERE EMAIL = ? AND PASSWORD = ?";
  const params = [email, password];

  db.execute(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    if (rows.length > 0) {
      // 로그인 성공
      const user = rows[0];
      // JWT 발급
      const token = jwt.sign(
        {
          email: rows[0].EMAIL,
          name: rows[0].NAME,
        },
        "my-secret-key",
        {
          expiresIn: "1h",
        }
      );

      res.json({
        success: true,
        message: "로그인 성공!",
        token,
        name: user.NAME,
      });
    } else {
      // 로그인 실패
      res.json({
        success: false,
        message: "로그인 실패..",
      });
    }
    console.log("req.body =>", req.body);
  });
});

// 로그아웃
router.post("/logout", verifyToken, (req, res) => {
  // 클라이언트 측에서 토큰을 삭제하도록 안내
  res.json({
    success: true,
    message: "로그아웃 성공! 클라이언트에서 토큰을 삭제하세요.",
  });
});

// 회원정보 수정 라우터(JWT 포함)
router.patch("/members", verifyToken, (req, res) => {
  console.log(req.body);
  const { nick, id, pw } = req.body;
  // console.log(req.headers);

  const sql = "update TB_MEMBER SET nick = ? where id= ? and pw = ?";
  const params = [nick, id, pw];

  db.execute(sql, params, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    if (result.affectedRows > 0) {
      // 회원정보 수정 성공
      res.json({
        success: true,
        message: "회원 정보 수정 성공!",
      });
    } else {
      // 회원정보 수정 실패
      res.json({
        success: false,
        message: "회원 정보 수정 실패..",
      });
    }
  });
});

// ✅ 로그인한 사용자가 글 작성
router.post("/posts", verifyToken, async (req, res) => {
  try {
    const { category, title, content } = req.body;
    const { email, name } = req.user; // ✅ JWT 토큰에서 사용자 정보 추출

    const sql = `
      INSERT INTO T_COMUNITY
      (EMAIL, CATEGORY, TITLE, CONTENT, FILE, VIEW_COUNT, LIKE_COUNT, IS_DELETED, IS_VERIFIED) VALUES (?, ?, ?, ?, NULL, 0, 0, 0, 0)`;
    await db.query(sql, [email, category, title, content]);

    res.json({ success: true, message: "게시글 등록 완료" });
  } catch (err) {
    console.error("게시글 저장 오류:", err);
    res.status(500).json({ success: false, error: "DB 저장 실패" });
  }
});

module.exports = router;
