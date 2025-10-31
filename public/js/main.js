// ======================
// ✅ JWT 한글 지원 디코딩
// ======================
function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(jsonPayload);
}

// ======================
// ✅ 보안 토글 상태 불러오기 (공용)
// ======================
async function loadSecurityToggle() {
  const secToggle = document.getElementById("secToggle");
  const token = localStorage.getItem("token");

  if (!token) {
    secToggle.classList.remove("on");
    return;
  }

  try {
    const res = await fetch("/api/status", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (Number(data.status) === 1) {
      secToggle.classList.add("on");
    } else {
      secToggle.classList.remove("on");
    }
  } catch (err) {
    console.log("🔻 보안 토글 상태 조회 실패:", err);
    secToggle.classList.remove("on");
  }
}

// ======================
// ✅ 로그인 처리
// ======================
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPw").value.trim();

  if (!email || !password) return alert("이메일과 비밀번호를 입력해주세요.");

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log("✅ 로그인 응답:", data);

    if (!data.success) return alert("로그인 실패 ❌: " + data.message);

    localStorage.setItem("token", data.token);

    const panel = document.getElementById("userPanel");
    panel.innerHTML = `
      <div class="lock">🔓</div>
      <h4>로그인 유지중</h4>
      <p style="color:gray; font-size:14px;">${data.name}님 환영합니다 💗</p>
      <button class="loginbtn" id="logoutBtn">로그아웃</button>
    `;

    await loadSecurityToggle();
    if (document.getElementById("secToggle").classList.contains("on")) {
      startTriggerCheck();
    }

    bindLogoutButton();
  } catch (err) {
    console.log("❌ 로그인 오류:", err);
    alert("서버 오류로 로그인 실패했습니다.");
  }
});

// ======================
// ✅ 로그아웃 처리
// ======================
function bindLogoutButton() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch("/api/logout", { method: "POST" });

    localStorage.removeItem("token");
    stopTriggerCheck();

    console.log("🔻 로그아웃 완료 → 토큰 제거 / 감시 중지");
    window.location.reload();
  });
}

// ======================
// ✅ 페이지 로드 시 로그인 유지 + 토글 / 감시 유지
// ======================
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const panel = document.getElementById("userPanel");

  if (token) {
    try {
      const payload = parseJwt(token);
      const now = Date.now() / 1000;

      if (payload.exp < now) {
        console.log("⏰ 토큰 만료 → 자동 로그아웃");
        localStorage.removeItem("token");
        return window.location.reload();
      }

      console.log("✅ 로그인 유지됨:", payload);

      panel.innerHTML = `
        <div class="lock">🔓</div>
        <h4>로그인 유지중</h4>
        <p style="color:gray; font-size:14px;">${payload.name}님 환영합니다 💗</p>
        <button class="loginbtn" id="logoutBtn">로그아웃</button>
      `;
      bindLogoutButton();
    } catch {
      localStorage.removeItem("token");
      return window.location.reload();
    }
  }

  await loadSecurityToggle();

  if (document.getElementById("secToggle").classList.contains("on")) {
    console.log("🟢 페이지 로드 시 보안 감시 자동 재시작");
    startTriggerCheck();
  }
});

// ======================
// ✅ 보안 토글 클릭 이벤트
// ======================
document.getElementById("secToggle").addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const secToggle = document.getElementById("secToggle");
  const isOn = secToggle.classList.toggle("on");
  const status = isOn ? 1 : 0;

  const res = await fetch("/api/toggle", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  const result = await res.json();
  console.log("🔄 보안 토글 변경:", result);

  if (isOn) startTriggerCheck();
  else stopTriggerCheck();
});

// ======================
// ✅ 로그 페이지 이동
// ======================
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("audioLogOpen").onclick = () =>
    (window.location.href = "/log.html?type=audio");
  document.getElementById("cctvLogOpen").onclick = () =>
    (window.location.href = "/log.html?type=cctv");
  document.getElementById("windowLogOpen").onclick = () =>
    (window.location.href = "/log.html?type=window");
});

// ======================
// ✅ 침입 감지 알람 (2분 유지 + 긴급신고)
// ======================
// ======================
// ✅ 침입 감지 알람 (2분 유지 + 긴급신고 + 취소버튼)
// ======================
let triggerInterval = null;

function startTriggerCheck() {
  if (triggerInterval) return;

  console.log("🟢 감지 감시 시작");

  triggerInterval = setInterval(async () => {
    const res = await fetch("/api/trigger-status");
    const data = await res.json();

    if (data.trigger_flag === 1) {
      console.log("🚨 감지됨! trigger_flag = 1");

      showAlertPopup("🚨 침입 감지! 보안 상태를 확인해주세요.");

      // ✅ 감지 후 상태 초기화 요청
      await fetch("/api/trigger-reset", { method: "POST" });

      console.log("✅ trigger_flag 초기화 요청 전송 완료");
    }
  }, 3000);
}

function stopTriggerCheck() {
  if (!triggerInterval) return;
  console.log("🔴 감지 감시 중지");
  clearInterval(triggerInterval);
  triggerInterval = null;
}

// ✅ 침입 감지 팝업
function showAlertPopup(msg) {
  let popup = document.getElementById("alertPopup");

  if (!popup) {
    popup = document.createElement("div");
    popup.id = "alertPopup";
    popup.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 60, 60, 0.96);
      color: white;
      padding: 40px 60px;
      font-size: 24px;
      font-weight: 700;
      border-radius: 20px;
      text-align: center;
      z-index: 9999;
      box-shadow: 0px 8px 25px rgba(0,0,0,0.35);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease-out;
      width: 520px;
    `;

    // ✅ 긴급신고 버튼
    const reportBtn = document.createElement("button");
    reportBtn.textContent = "🚨 긴급신고";
    reportBtn.style.cssText = `
      margin-top: 30px;
      background: white;
      color: #ff2f2f;
      font-size: 20px;
      font-weight: 700;
      padding: 12px 24px;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      transition: 0.2s;
    `;

    // ✅ 신고 취소 버튼
    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "❌ 취소";
    cancelBtn.style.cssText = `
      margin-top: 30px;
      margin-left: 15px;
      background: #555;
      color: white;
      font-size: 20px;
      font-weight: 700;
      padding: 12px 24px;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      transition: 0.2s;
    `;

    const buttonBox = document.createElement("div");
    buttonBox.style.cssText = `display: flex; justify-content: center;`;

    const timerText = document.createElement("p");
    timerText.id = "autoReportTimer";
    timerText.style.cssText = `
      margin-top: 20px;
      font-size: 18px;
      color: #fff;
    `;

    popup.appendChild(document.createTextNode(msg));
    popup.appendChild(timerText);
    buttonBox.appendChild(reportBtn);
    buttonBox.appendChild(cancelBtn);
    popup.appendChild(buttonBox);
    document.body.appendChild(popup);

    // ✅ 버튼 동작 정의
    let autoReportTimer;
    let countdown = 30;
    timerText.textContent = `⏱ ${countdown}초 뒤 자동신고됩니다.`;

    // 자동신고 카운트다운
    autoReportTimer = setInterval(() => {
      countdown--;
      timerText.textContent = `⏱ ${countdown}초 뒤 자동신고됩니다.`;
      if (countdown <= 0) {
        clearInterval(autoReportTimer);
        popup.innerHTML = `
          <p style="font-size:26px; font-weight:700;">🚨 자동 긴급신고 완료</p>
          <p style="margin-top:15px;">경찰이 즉시 출동합니다.</p>
        `;
        setTimeout(() => (popup.style.display = "none"), 4000);
      }
    }, 1000);

    // 긴급신고 클릭 시 즉시 신고 처리
    reportBtn.addEventListener("click", () => {
      clearInterval(autoReportTimer);
      popup.innerHTML = `
        <p style="font-size:26px; font-weight:700;">🚓 긴급신고 접수 완료</p>
        <p style="margin-top:15px;">경찰이 즉시 출동합니다.</p>
      `;
      setTimeout(() => (popup.style.display = "none"), 4000);
    });

    // 취소 버튼 클릭 시 신고 중단
    cancelBtn.addEventListener("click", () => {
      clearInterval(autoReportTimer);
      popup.innerHTML = `
        <p style="font-size:26px; font-weight:700;">⚠️ 신고가 취소되었습니다.</p>
        <p style="margin-top:15px;">상황이 해제되었거나 오작동으로 판단되었습니다.</p>
      `;
      setTimeout(() => (popup.style.display = "none"), 4000);
    });

    // 팝업 전체는 2분 뒤 자동 닫힘
    setTimeout(() => {
      popup.style.display = "none";
    }, 120000);
  }

  popup.style.display = "flex";
}

// ✅ 최근 로그 자동 새로고침 (3초마다, 최근 1건만)
let lastFileName = { audio: "", cctv: "", window: "" }; // 마지막으로 표시한 파일 이름 저장

async function loadLatestLogs() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const types = [
    { key: "audio", element: "lastAudioLog", label: "🎙 녹음" },
    { key: "cctv", element: "lastCctvLog", label: "📹 CCTV" },
    { key: "window", element: "lastWindowLog", label: "🚪 창문" },
  ];

  for (const t of types) {
    try {
      const res = await fetch(`/api/latest-log/${t.key}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      // 📌 데이터가 없을 때
      if (!data || !data.file_name) {
        document.getElementById(t.element).textContent = "최근 감지: 없음";
        continue;
      }

      // 📌 최근 값이 동일하면 갱신하지 않음 (중복출력 방지)
      if (lastFileName[t.key] === data.file_name) continue;

      // ✅ 최근 로그 1건만 표시
      const element = document.getElementById(t.element);
      element.textContent = `최근 감지: ${data.file_name}`;

      // ✅ 마지막 파일명 저장 (다음 비교용)
      lastFileName[t.key] = data.file_name;

      // ✅ 콘솔로그는 1회만 출력
      console.log(`✅ ${t.label} 최신 로그 업데이트됨:`, data.file_name);
    } catch (err) {
      console.error(`❌ ${t.label} 로그 불러오기 실패:`, err);
    }
  }
}

// ✅ 페이지 로드 시 최초 실행 + 주기적 갱신
document.addEventListener("DOMContentLoaded", () => {
  loadLatestLogs();
  setInterval(loadLatestLogs, 3000);
});
