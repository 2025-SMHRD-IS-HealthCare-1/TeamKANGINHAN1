document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const type = params.get("type") || "audio"; // 기본값 audio
  const token = localStorage.getItem("token");

  const logTitle = document.getElementById("logTitle");
  const logBody = document.getElementById("logBody");

  // ✅ 제목 표시
  const titles = {
    audio: "🎙 녹음 로그 기록",
    cctv: "📹 CCTV 영상 로그 기록",
    window: "🚪 창문 로그 기록",
  };
  logTitle.textContent = titles[type] || "로그 기록";

  try {
    console.log("📡 로그 데이터 요청:", `/api/logs/${type}`);

    const res = await fetch(`/api/logs/${type}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    console.log("✅ 서버 응답:", data);

    if (!data || data.length === 0) {
      logBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">데이터가 없습니다.</td></tr>`;
      return;
    }

    logBody.innerHTML = data
      .map(
        (row) => `
        <tr>
          <td>${row.file_name}</td>
          <td>${row.file_path}</td>
          <td>${row.file_size_mb}</td>
          <td>${row.duration_sec}</td>
          <td>${row.reg_date || row.created_at}</td>
        </tr>
      `
      )
      .join("");
  } catch (err) {
    console.error("❌ 로그 로드 실패:", err);
    logBody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:red;">데이터를 불러오지 못했습니다.</td></tr>`;
  }
});
