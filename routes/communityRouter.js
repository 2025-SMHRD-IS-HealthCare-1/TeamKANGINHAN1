const express = require("express");
const router = express.Router();
// const db = require("../config/db");
const db = require("../config/db_pr");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/jwt");

// ✅ JWT 시크릿 키 통일
const JWT_SECRET = process.env.JWT_SECRET || "my-secret-key";

/* ==================================================
 🧱 커뮤니티 라우터 (게시글 / 댓글 / 좋아요)
================================================== */

/* ✅ 게시글 목록 조회 */
router.get("/posts", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        C.POST_ID,
        C.EMAIL,
        C.CATEGORY,
        C.TITLE,
        C.CONTENT,
        C.LIKE_COUNT,
        C.VIEW_COUNT,
        C.CREATED_AT,
        COALESCE(COUNT(T.CMT_ID), 0) AS COMMENT_COUNT
      FROM T_COMUNITY C
      LEFT JOIN T_COMMENT T
        ON C.POST_ID = T.POST_ID
      WHERE C.IS_DELETED = 0
      GROUP BY C.POST_ID
      ORDER BY C.CREATED_AT DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("게시글 목록 조회 오류:", err);
    res.status(500).json({ message: "DB 조회 실패" });
  }
});

/* ✅ 게시글 등록 */
router.post("/posts", verifyToken, async (req, res) => {
  const { category, title, content } = req.body;
  const email = req.user.email; // ✅ 토큰에서 추출된 이메일

  try {
    await db.query(
      `INSERT INTO T_COMUNITY 
        (EMAIL, CATEGORY, TITLE, CONTENT, LIKE_COUNT, VIEW_COUNT, CREATED_AT, UPDATED_AT, IS_DELETED, IS_VERIFIED)
        VALUES (?, ?, ?, ?, 0, 0, NOW(), NOW(), 0, 1)`,
      [email, category, title, content]
    );

    res.json({ success: true, message: "게시글 등록 완료" });
  } catch (err) {
    console.error("게시글 등록 오류:", err.sqlMessage || err.message);
    res.status(500).json({ message: "게시글 등록 실패" });
  }
});

/* ✅ 게시글 상세 조회 (조회수 증가 포함) */
router.get("/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(
      "UPDATE T_COMUNITY SET VIEW_COUNT = VIEW_COUNT + 1 WHERE POST_ID = ?",
      [id]
    );
    const [rows] = await db.query(
      "SELECT * FROM T_COMUNITY WHERE POST_ID = ?",
      [id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "게시글 없음" });
    res.json(rows[0]);
  } catch (err) {
    console.error("게시글 상세 조회 오류:", err);
    res.status(500).json({ message: "DB 조회 실패" });
  }
});

// ✅ 좋아요 상태 확인
router.get("/posts/:id/like-status", verifyToken, async (req, res) => {
  const { id } = req.params;
  const userEmail = req.user.email;

  try {
    const [rows] = await db.query(
      "SELECT * FROM T_LIKE WHERE POST_ID = ? AND EMAIL = ?",
      [id, userEmail]
    );
    const liked = rows.length > 0;
    res.json({ liked });
  } catch (err) {
    console.error("좋아요 상태 조회 오류:", err);
    res.status(500).json({ message: "좋아요 상태 조회 실패" });
  }
});

// ✅ 좋아요 토글
router.post("/posts/:id/like", verifyToken, async (req, res) => {
  const { id } = req.params;
  const userEmail = req.user.email;

  try {
    // 이미 좋아요 되어있는지 확인
    const [exists] = await db.query(
      "SELECT * FROM T_LIKE WHERE POST_ID = ? AND EMAIL = ?",
      [id, userEmail]
    );

    if (exists.length > 0) {
      // ✅ 좋아요 취소
      await db.query("DELETE FROM T_LIKE WHERE POST_ID = ? AND EMAIL = ?", [
        id,
        userEmail,
      ]);
      await db.query(
        "UPDATE T_COMUNITY SET LIKE_COUNT = LIKE_COUNT - 1 WHERE POST_ID = ?",
        [id]
      );
      const [[{ LIKE_COUNT }]] = await db.query(
        "SELECT LIKE_COUNT FROM T_COMUNITY WHERE POST_ID = ?",
        [id]
      );
      return res.json({ liked: false, likeCount: LIKE_COUNT });
    } else {
      // ✅ 좋아요 추가
      await db.query(
        "INSERT INTO T_LIKE (POST_ID, EMAIL, CREATED_AT) VALUES (?, ?, NOW())",
        [id, userEmail]
      );
      await db.query(
        "UPDATE T_COMUNITY SET LIKE_COUNT = LIKE_COUNT + 1 WHERE POST_ID = ?",
        [id]
      );
      const [[{ LIKE_COUNT }]] = await db.query(
        "SELECT LIKE_COUNT FROM T_COMUNITY WHERE POST_ID = ?",
        [id]
      );
      return res.json({ liked: true, likeCount: LIKE_COUNT });
    }
  } catch (err) {
    console.error("좋아요 처리 오류:", err);
    res.status(500).json({ message: "좋아요 실패" });
  }
});

/* ✅ 댓글 목록 조회 */
router.get("/posts/:id/comments", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT * FROM T_COMMENT WHERE POST_ID = ? ORDER BY CREATED_AT ASC",
      [id]
    );
    res.json({
      count: rows.length, // ✅ 댓글 개수 추가
      comments: rows,
    });
  } catch (err) {
    console.error("댓글 조회 오류:", err);
    res.status(500).json({ message: "댓글 조회 실패" });
  }
});

/* ✅ 댓글 등록 (JWT로 이메일 추출) */
router.post("/posts/:id/comments", async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  try {
    if (!token) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const email = decoded.email; // ✅ 토큰에서 이메일 추출

    if (!content) {
      return res.status(400).json({ message: "댓글 내용이 없습니다." });
    }

    await db.query(
      `INSERT INTO T_COMMENT (POST_ID, EMAIL, CMT_CONTENT, CREATED_AT, UPDATED_AT)
       VALUES (?, ?, ?, NOW(), NOW())`,
      [id, email, content]
    );

    res.json({ success: true, message: "댓글 등록 완료" });
  } catch (err) {
    console.error("댓글 등록 오류:", err);
    res.status(500).json({ message: "댓글 등록 실패" });
  }
});

module.exports = router;
