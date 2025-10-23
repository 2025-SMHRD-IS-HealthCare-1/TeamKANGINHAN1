const express = require("express");
const router = express.Router();
const path = require("path");
const publicDir = path.join(__dirname, "..", "public");
const logger = require("../middlewares/logger");

// 미들웨어 개별 적용
// router에 경로와 (req, res)콜백함수 가운데에 미들웨어를 추가로 인자값의 형태로 넣어주면
// 해당 라우터에만 적용된다

// 메인 페이지
router.get("/", logger, (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

// 회원가입 페이지
router.get("/register", (req, res) => {
  res.sendFile(path.join(publicDir, "register.html"));
});

// 로그인 페이지
router.get("/login", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

// 커뮤니티 페이지
router.get("/community", (req, res) => {
  res.sendFile(path.join(publicDir, "community.html"));
});

// 새글 작성 페이지
router.get("/community/new", (req, res) => {
  res.sendFile(path.join(publicDir, "new_post.html"));
});

module.exports = router;
