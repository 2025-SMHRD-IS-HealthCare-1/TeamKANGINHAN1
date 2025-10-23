// 로그인 처리
const loginBtn = document.getElementById("loginBtn");
loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPw").value.trim();

  if (!email || !password) {
    alert("이메일과 비밀번호를 입력해주세요.");
    return;
  }

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    console.log(data);

    if (data.success) {
      // ✅ 로그인 성공
      localStorage.setItem("token", data.token);

      const panel = document.getElementById("userPanel");
      panel.innerHTML = `
              <div class="lock">🔓</div>
              <h4>${data.message}</h4>
              <p style="color:gray; font-size:14px;">${data.name}님 환영합니다 💗</p>
              <button class="loginbtn" id="logoutBtn">로그아웃</button>`;

      document
        .getElementById("logoutBtn")
        .addEventListener("click", async () => {
          const token = localStorage.getItem("token");

          if (!token) {
            alert("이미 로그아웃 상태입니다.");
            return;
          }

          try {
            const res = await fetch("/api/logout", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });

            const data = await res.json();
            console.log("📤 로그아웃 요청 응답:", data);

            if (data.success) {
              // ✅ 토큰 삭제
              localStorage.removeItem("token");

              alert(data.message || "로그아웃 성공!");
              // ✅ 메인 페이지로 이동
              window.location.href = "/main.html";
            } else {
              alert("로그아웃 실패 ❌");
            }
          } catch (err) {
            console.error(err);
            alert("서버 오류로 로그아웃 실패했습니다.");
          }
        });
    } else {
      alert("로그인 실패 ❌: " + data.message);
    }
  } catch (err) {
    console.error(err);
    alert("서버 오류로 로그인 실패했습니다.");
  }
});

// 보안상태 토글 처리
document.getElementById("secToggle").addEventListener("click", async () => {
  const toggle = document.getElementById("secToggle");

  // 1️⃣ ON/OFF 상태 변경
  toggle.classList.toggle("on");
  const isOn = toggle.classList.contains("on");
  const status = isOn ? "on" : "off";
  console.log(`🔄 보안상태: ${status}`);

  // 2️⃣ FastAPI로 상태 전달
  try {
    const res = await fetch("/api/rapi/toggle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();
    console.log("✅ FastAPI 응답:", data.message);

    // 3️⃣ UI 피드백 (ON/OFF 메시지)
    if (isOn) {
      alert("🔒 보안 시스템이 활성화되었습니다.");
    } else {
      alert("🔓 보안 시스템이 비활성화되었습니다.");
    }
  } catch (err) {
    console.error("❌ FastAPI 호출 실패:", err);
    alert("FastAPI 서버에 연결할 수 없습니다.");
  }
});
