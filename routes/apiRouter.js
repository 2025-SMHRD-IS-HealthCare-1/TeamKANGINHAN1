const express = require("express");
const router = express.Router();
const db = require("../config/db");
const db_pr = require("../config/db_pr");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/jwt");

// ✅ JWT 시크릿 키 통일
const JWT_SECRET = process.env.JWT_SECRET || "my-secret-key";

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
      // ✅ JWT 발급 - 통일된 키 사용
      const token = jwt.sign(
        {
          email: rows[0].EMAIL,
          name: rows[0].NAME,
        },
        JWT_SECRET, // ⭐ 수정: 통일된 키 사용
        {
          expiresIn: "1h",
        }
      );

      res.json({
        success: true,
        message: "로그인 성공!",
        token,
        email: user.EMAIL,
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
router.post("/logout", verifyToken, async (req, res) => {
  const email = req.user.email;

  try {
    // ✅ 로그아웃 시 토글 강제 OFF
    await db_pr.execute(
      `UPDATE T_SECURITY_TOGGLE SET TOGGLE_STATUS = 0, UPDATED_AT = NOW() WHERE EMAIL = ?`,
      [email]
    );

    res.json({
      success: true,
      message: "로그아웃 성공! 보안 상태 OFF 처리 완료.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "로그아웃 처리 중 오류 발생",
    });
  }
});

// 보안 토글 상태 조회
router.get("/status", verifyToken, async (req, res) => {
  const email = req.user.email;

  try {
    const [rows] = await db_pr.execute(
      `SELECT TOGGLE_STATUS FROM T_SECURITY_TOGGLE WHERE EMAIL = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.json({ status: 0 });
    }

    return res.json({ status: rows[0].TOGGLE_STATUS });
  } catch (err) {
    return res.status(500).json({ status: 0 });
  }
});

// 보안 토글 변경 API
router.post("/toggle", verifyToken, async (req, res) => {
  const { status } = req.body; // 0 or 1
  const email = req.user.email; // JWT에서 이메일 가져오기

  if (status !== 0 && status !== 1) {
    return res
      .status(400)
      .json({ success: false, message: "잘못된 상태 값입니다." });
  }

  try {
    const [result] = await db_pr.execute(
      `UPDATE T_SECURITY_TOGGLE SET TOGGLE_STATUS = ?, UPDATED_AT = NOW() WHERE EMAIL = ?`,
      [status, email]
    );

    if (result.affectedRows === 0) {
      // (선택) 초기 데이터 없을 경우 자동 INSERT
      await db_pr.execute(
        `INSERT INTO T_SECURITY_TOGGLE (TOGGLE_ID, EMAIL, TOGGLE_STATUS) VALUES (UUID(), ?, ?)`,
        [email, status]
      );
    }

    return res.json({ success: true, message: "보안 상태 변경 완료", status });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "서버 오류" });
  }
});

// 트리거 발생 조회
router.get("/trigger-status", async (req, res) => {
  try {
    const [rows] = await db_pr.execute(
      `SELECT trigger_flag FROM T_TRIGGER ORDER BY updated_at DESC LIMIT 1`
    );
    res.json(rows.length ? rows[0] : { trigger_flag: 0 });
  } catch (err) {
    console.error("⚠️ trigger-status 오류:", err);
    res.json({ trigger_flag: 0 });
  }
});

// 트리거 리셋
router.post("/trigger-reset", async (req, res) => {
  try {
    const [result] = await db_pr.execute(
      `UPDATE T_TRIGGER SET trigger_flag = 0 ORDER BY updated_at DESC LIMIT 1`
    );

    console.log(
      `✅ trigger_flag reset 완료 (변경된 row: ${result.affectedRows})`
    );
    res.json({ success: true, reset: result.affectedRows });
  } catch (err) {
    console.error("❌ trigger-reset 오류:", err);
    res.status(500).json({ success: false });
  }
});

// 로그 조회 라우터
// 라우터: /api/logs/:type
router.get("/logs/:type", verifyToken, async (req, res) => {
  const logType = req.params.type;
  let tableName = "t_rec"; // 현재 통합 테이블 사용

  try {
    const [rows] = await db_pr.execute(
      `SELECT file_name, file_path, file_size_mb, duration_sec, created_at, reg_date
       FROM ${tableName}
       ORDER BY created_at DESC
       LIMIT 50`
    );
    res.json(rows);
  } catch (err) {
    console.error("로그 조회 오류:", err);
    res.status(500).json({ success: false, message: "로그 조회 실패" });
  }
});

// main 로그 조회 라우터
// ✅ 최근 로그 1건 조회 (모든 타입 공용)
router.get("/latest-log/:type", verifyToken, async (req, res) => {
  try {
    const [rows] = await db_pr.execute(`
      SELECT file_name, file_path, file_size_mb, duration_sec, reg_date
      FROM t_rec
      ORDER BY created_at DESC
      LIMIT 1
    `);

    if (rows.length === 0) {
      return res.json({ success: false, message: "최근 로그 없음" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("❌ 최근 로그 조회 오류:", err);
    res.status(500).json({ success: false, message: "최근 로그 조회 실패" });
  }
});

module.exports = router;
