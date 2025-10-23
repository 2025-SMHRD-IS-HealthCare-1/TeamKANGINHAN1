const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const verifyToken = require("../middlewares/jwt");

const FASTAPI_BASE_URL = "http://192.168.219.148:8001"; // FastAPI 서버 주소

// ✅ 보안 토글 ON/OFF 요청
router.post("/", verifyToken, async (req, res) => {
  const { status } = req.body; // 클라이언트에서 { status: "on" } or { status: "off" }

  console.log("🔐 보안 상태 변경 요청:", status);

  try {
    // FastAPI에 보안 토글 상태 전달
    const response = await fetch(`${FASTAPI_BASE_URL}/toggle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) throw new Error("FastAPI 연결 실패");

    const data = await response.json();
    console.log("✅ FastAPI 응답:", data);

    res.json({
      success: true,
      message: data.message,
    });
  } catch (error) {
    console.error("❌ FastAPI 요청 오류:", error.message);
    res.status(500).json({
      success: false,
      message: "FastAPI 요청 실패",
    });
  }
});

module.exports = router;
