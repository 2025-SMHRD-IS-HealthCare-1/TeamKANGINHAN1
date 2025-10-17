const express = require("express");
const qs = require("qs");
const axios = require("axios");
const pool = require("../config/db"); // DB 연결 (config/db.js)
require("dotenv").config();

const router = express.Router();

// 환경 변수 로드
const client_id = process.env.KAKAO_CLIENT_ID;
const client_secret = process.env.KAKAO_CLIENT_SECRET;
const redirect_uri = process.env.KAKAO_REDIRECT_URI;
const token_uri = process.env.KAKAO_TOKEN_URI;
const api_host = process.env.KAKAO_API_HOST;
const domain = process.env.DOMAIN;

// 공통 API 호출 함수
async function call(method, uri, param, header) {
  try {
    const res = await axios({ method, url: uri, data: param, headers: header });
    return res.data;
  } catch (err) {
    console.error("❌ API 요청 오류:", err.response?.data || err.message);
    return null;
  }
}

/* ===========================================
   1️⃣ 인가 코드 요청
=========================================== */
router.get("/authorize", (req, res) => {
  const scope = req.query.scope ? `&scope=${req.query.scope}` : "";
  const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code${scope}`;
  res.redirect(kakaoAuthURL);
});

/* ===========================================
   2️⃣ 인가 코드로 Access Token 발급
=========================================== */
router.get("/redirect", async (req, res) => {
  const code = req.query.code;

  // 토큰 요청 파라미터
  const param = qs.stringify({
    grant_type: "authorization_code",
    client_id: client_id,
    redirect_uri: redirect_uri,
    code: code,
    client_secret: client_secret,
  });

  const header = { "content-type": "application/x-www-form-urlencoded" };
  const tokenData = await call("POST", token_uri, param, header);

  if (!tokenData || !tokenData.access_token) {
    return res.status(400).send("⚠️ 카카오 토큰 발급 실패");
  }

  const accessToken = tokenData.access_token;

  /* ===========================================
     3️⃣ 사용자 정보 조회
  =========================================== */
  const profileUri = api_host + "/v2/user/me";
  const profileHeader = {
    "content-type": "application/x-www-form-urlencoded",
    Authorization: `Bearer ${accessToken}`,
  };

  const userData = await call("POST", profileUri, {}, profileHeader);

  if (!userData || !userData.kakao_account) {
    return res.status(400).send("⚠️ 사용자 정보 조회 실패");
  }

  const email = userData.kakao_account.email;
  const nickname = userData.kakao_account.profile?.nickname || null;
  const profile_img = userData.kakao_account.profile?.profile_image_url || null;
  const kakao_id = userData.id;

  console.log("✅ 카카오 로그인 성공:", email, nickname);

  /* ===========================================
     4️⃣ DB 저장 or 업데이트
  =========================================== */
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
    await pool.query(sql, [email, nickname, nickname, profile_img, kakao_id]);

    console.log("💾 DB 저장/업데이트 완료:", email);
  } catch (err) {
    console.error("❌ DB 처리 중 오류:", err);
    return res.status(500).send("DB 저장 실패");
  }

  // 로그인 완료 후 페이지 이동
  res.redirect(`${domain}/index.html?login=success`);
});

module.exports = router;
