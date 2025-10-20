require("dotenv").config();
const express = require("express");
const session = require("express-session");
const qs = require("qs");
const axios = require("axios");
const path = require("path");
const { pool } = require("./config/db");

const app = express();
const port = process.env.PORT || 4000;
const domain = process.env.DOMAIN || `http://localhost:${port}`;

// ✅ 정적 파일 (index.html 등)
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// ✅ 세션 설정
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your session secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// ✅ 카카오 환경변수
const client_id = process.env.KAKAO_CLIENT_ID;
const client_secret = process.env.KAKAO_CLIENT_SECRET;
const redirect_uri = process.env.KAKAO_REDIRECT_URI;
const kauth_host = "https://kauth.kakao.com";
const kapi_host = "https://kapi.kakao.com";

// ✅ 공통 axios 함수
async function call(method, uri, param, header) {
  try {
    const res = await axios({ method, url: uri, headers: header, data: param });
    return res.data;
  } catch (err) {
    return err.response?.data || { error: "axios error" };
  }
}

// ✅ [1] 로그인 요청
app.get("/authorize", (req, res) => {
  res.redirect(
    `${kauth_host}/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code`
  );
});

// ✅ [2] 로그인 리다이렉트 처리
app.get("/redirect", async (req, res) => {
  const param = qs.stringify({
    grant_type: "authorization_code",
    client_id,
    redirect_uri,
    client_secret,
    code: req.query.code,
  });

  const header = { "content-type": "application/x-www-form-urlencoded" };
  const token = await call("POST", `${kauth_host}/oauth/token`, param, header);

  if (token.access_token) {
    req.session.kakaoToken = token.access_token;

    // ✅ 사용자 정보 요청
    const profile = await call(
      "GET",
      `${kapi_host}/v2/user/me`,
      {},
      { Authorization: `Bearer ${token.access_token}` }
    );

    if (profile && profile.kakao_account?.email) {
      const email = profile.kakao_account.email;
      const name = profile.properties.nickname;
      const profileImg = profile.properties.profile_image;
      const snsId = profile.id;

      // ✅ DB 저장 or 중복 체크
      const [rows] = await pool.query("SELECT * FROM USER WHERE EMAIL=?", [email]);
      if (rows.length === 0) {
        await pool.query(
          "INSERT INTO USER (EMAIL, NAME, SNS_ID, PROFILE_IMG, PROVIDER) VALUES (?, ?, ?, ?, ?)",
          [email, name, snsId, profileImg, "kakao"]
        );
      }

      // ✅ 세션 저장
      req.session.user = { email, name, profileImg, provider: "kakao" };
      console.log("✅ 로그인 세션 생성:", req.session.user);
    }

    return res.redirect(`${domain}/index.html?login=success`);
  } else {
    return res.redirect(`${domain}/index.html?login=fail`);
  }
});

// ✅ [3] 로그인된 사용자 프로필 세션에서 보기
app.get("/profile", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "로그인 필요" });
  }
  res.json(req.session.user);
});

// ✅ [4] 로그아웃
app.get("/logout", async (req, res) => {
  const uri = `${kapi_host}/v1/user/logout`;
  const header = { Authorization: "Bearer " + req.session.kakaoToken };

  await call("POST", uri, null, header);
  req.session.destroy();
  res.send("✅ 로그아웃 완료");
});

// ✅ [5] 회원탈퇴 (unlink)
app.get("/unlink", async (req, res) => {
  const uri = `${kapi_host}/v1/user/unlink`;
  const header = { Authorization: "Bearer " + req.session.kakaoToken };

  await call("POST", uri, null, header);
  req.session.destroy();
  res.send("✅ 연결 해제 완료");
});

app.listen(port, () => {
  console.log(`🚀 Server is running at ${domain}`);
});
