document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("secToggle");
  toggle.addEventListener("click", async () => {
    toggle.classList.toggle("on");
    const isOn = toggle.classList.contains("on");

    if (isOn) {
      console.log("보안 토글 ON → Python 코드 실행 요청 중...");
      try {
        const res = await fetch("/toggle", { method: "POST" });
        const data = await res.json();
        console.log("서버 응답:", data);
        alert("파이썬 코드 실행 시작!");
      } catch (err) {
        console.error("서버 요청 실패", err);
        alert("서버에 연결할 수 없습니다.");
      }
    }
  });
});
