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

// 로그인 라우터 => JWT
// router.post("/login", (req, res) => {
//   const { id, pw } = req.body;

//   const sql = "select * from TB_MEMBER where id = ? pw = ?";
//   const params = [id, pw];

//   db.execute(sql, params, (err, rows) => {
//     console.log(rows);
//     if (rows.length > 0) {
//       // 로그인 성공
//       // JWT 발급
//       const token = jwt.sign(
//         {
//           id: rows[0].id,
//           nick: rows[0].nick,
//         },
//         "my-secret-key",
//         {
//           expiresIn: "1h",
//         }
//       );

//       res.json({
//         success: true,
//         message: "로그인 성공",
//         token,
//       });
//     } else {
//       res.json({
//         success: false,
//         message: "로그인 실패",
//       });
//     }
//   });
// });
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

// Flask 연동용
const axios = require("axios");

// ✅ Flask 서버 주소 (라즈베리파이의 실제 IP 주소로 변경)
const FLASK_URL = "http://192.168.219.148:5000/toggle";

// Flask 토글 호출 (프론트에서 /api/flask/toggle 로 요청)
router.post("/toggle", async (req, res) => {
  try {
    // ✅ Flask 서버로 요청 전송
    const response = await axios.post(FLASK_URL);

    console.log("✅ Flask 응답:", response.data);
    res.json({
      success: true,
      message: "Flask 연결 성공",
      data: response.data,
    });
  } catch (error) {
    console.error("❌ Flask 통신 오류:", error.message);
    res.status(500).json({
      success: false,
      message: "Flask 서버와의 통신 오류",
      error: error.message,
    });
  }
});

module.exports = router;

/*
    웹 인증 방식 비교 : 세션 vs 쿠키 vs JWT

    1. 쿠키(Cookie)
    - 클라이언트(브라우저)에 저장되는 작은 데이터
    - 주로 세션ID나 인증 정보를 저장하여 요청마다 자동 전송
    - 단독으로 인증 수단으로 사용되는 경우는 드물다.
    - 보안적인 부분에서 매우 취약하다.

    2. 세션(Session)
    - 로그인 시, 서버가 사용자의 정보를 저장
    - 클라이언트는 세션ID를 서버로 전송 -> 서버는 세션 저장소의 정보를 확인해서 인증 상태 유지
    - 장점 : 서버가 상태(state)를 관리하므로 안전
    - 단점 : 서버가 상태를 관리하므로 확작성에 불리, 자원소모가 큼

    3. JWT(JSON Wep Token)
    - 로그인 시, 서버가 사용자의 정보를 암호화된 토큰으로 발급 후, 사용자에게 전송
    - 클라이언트(브라우저)는 토큰을 쿠키 혹은 localStorage에 저장 후, 요청 시 토큰을 함께 전송
    - 서버는 토큰 검증만 해주므로, 사용자의 상태를 저장하지 않는다! 무상태성(stateless)
    - 장정 : 서버 확장/분산 환경에 유리, 다양한 클라이언트(모바일, 웹 등)에서 쉽게 활용 가능
    - 단점 : 토큰이 탈취된 경우, 악용 가능
*/

/* 
    JWT 사용 순서(Access Token만 발급한 경운)
    
    1). 사용자가 서버로 로그인할 경우, 서버는 JWT를 발급
    2). 사용자는 서버로부터 발급받은 JWT를 쿠키나 localStorage에 저장
    3). 사용자가 서버에 요청할 때, JWT를 headers의 Authorization에 담아서 전송
    4). 서버는 사용자가 보낸 JWT를 검증

    5-1). 정상적인 JWT라면 응답을 보내줌
    5-2). 정상적이지 않은 JWT라면 새롭게 로그인 할 것을 명령
*/

/*
  JWT 사용 순서(Access Token, Refresh Token 2개 사용)

  1). 사용자가 서버로 로그인할 경우, 서버는 AccessToken과 RefreshToken을 발급해서 사용자에게 전송
  2). 사용자는 서버로부터 발급받은 2개의 토큰을 쿠키나 localStorage에 저장
  3). 사용자가 서버로 요청을 할 때, AccessToken만 headers의 Authorization에 담아서 전송
  4). 서버는 사용자가 보낸 AccessToken 검증

  5-1). 정상적인 AccessToken이라면 응답을 보내줌(종료)
  5-2 는 계속 이어져서 정상적이지않은(만료된) ACCESSTOKEN이라면 만료되었다는 내용을 응답으로 보내줌
  6) 사용자는 서버에게 REFRESHTOKEN을 보내서 새로운 ACCESSTOKEN을 요청
  7-1 정상적인 REFRESHTOKEN이라면 ACCESSTOKEN을 새롭게 발급해서 전송
  7-2 정상적이지않은 REFRESHTOKEN이라면 새롭게 로그인할것을 명령.    
  */
