// Toggle Security
function toggleSecurity() {
  const toggle = document.getElementById("secToggle");
  const label = document.getElementById("toggleLabel");

  toggle.classList.toggle("on");
  const isOn = toggle.classList.contains("on");

  label.textContent = isOn ? "활성" : "비활성";
}

// Emergency Alert
function triggerEmergency() {
  const modal = document.getElementById("alertModal");
  const backdrop = document.getElementById("modalBackdrop");

  backdrop.classList.add("show");
  modal.classList.add("show");

  setTimeout(() => {
    closeAlert();
  }, 5000);
}

function closeAlert() {
  const modal = document.getElementById("alertModal");
  const backdrop = document.getElementById("modalBackdrop");
  modal.classList.remove("show");
  backdrop.classList.remove("show");
}

// Signup Modal
function openSignup() {
  const modal = document.getElementById("signupModal");
  const backdrop = document.getElementById("modalBackdrop");

  backdrop.classList.add("show");
  modal.classList.add("show");
}

function closeSignup() {
  const modal = document.getElementById("signupModal");
  const backdrop = document.getElementById("modalBackdrop");
  modal.classList.remove("show");
  backdrop.classList.remove("show");
}

// Device Connection (moved to device management section)

function closeDevice() {
  const modal = document.getElementById("deviceModal");
  const backdrop = document.getElementById("modalBackdrop");
  modal.classList.remove("show");
  backdrop.classList.remove("show");
  document.getElementById("deviceForm").reset();
}

// Settings Modal
function openSettings() {
  const modal = document.getElementById("settingsModal");
  const backdrop = document.getElementById("modalBackdrop");

  backdrop.classList.add("show");
  modal.classList.add("show");
}

function closeSettings() {
  const modal = document.getElementById("settingsModal");
  const backdrop = document.getElementById("modalBackdrop");
  modal.classList.remove("show");
  backdrop.classList.remove("show");
}

function closeAllModals() {
  closeAlert();
  closeSignup();
  closeDevice();
  closeSettings();
}
function addKeyword() {
  const input = document.getElementById("keywordInput");
  const keyword = input.value.trim();

  if (keyword === "") {
    alert("키워드를 입력해주세요.");
    return;
  }

  const keywordList = document.getElementById("keywordList");

  // 빈 메시지 제거
  const emptyMsg = keywordList.querySelector(".empty-keyword");
  if (emptyMsg) {
    emptyMsg.remove();
  }

  // 새 키워드 아이템 생성
  const keywordItem = document.createElement("div");
  keywordItem.className = "keyword-item";
  keywordItem.innerHTML = `
          <span class="keyword-text">${keyword}</span>
          <button class="keyword-delete" onclick="deleteKeyword(this)">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        `;

  keywordList.appendChild(keywordItem);
  input.value = "";
}

function deleteKeyword(button) {
  const keywordItem = button.closest(".keyword-item");
  const keywordList = document.getElementById("keywordList");

  keywordItem.remove();

  // 모든 키워드가 삭제되면 빈 메시지 표시
  if (keywordList.children.length === 0) {
    keywordList.innerHTML =
      '<div class="empty-keyword">등록된 키워드가 없습니다</div>';
  }
}

// Form Handlers
function handleLogin(e) {
  e.preventDefault();
  alert("로그인 기능은 서버 연동 후 활성화됩니다.");
}

function handleSignup(e) {
  e.preventDefault();
  alert("회원가입이 완료되었습니다!");
  closeSignup();
}

// Kakao Login/Signup
function handleKakaoLogin() {
  // 실제 카카오 로그인 연동 시 사용할 코드
  // Kakao.Auth.login() 등의 카카오 SDK 함수를 호출

  alert(
    "카카오톡 로그인 페이지로 이동합니다.\n\n실제 서비스에서는 카카오 개발자 센터에서\nREST API 키를 발급받아 연동해야 합니다.\n\n개발자 가이드: developers.kakao.com"
  );

  // 실제 구현 예시 (주석):
  // window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=YOUR_REST_API_KEY&redirect_uri=YOUR_REDIRECT_URI&response_type=code`;
}

function handleKakaoSignup() {
  // 카카오톡 회원가입도 동일한 프로세스
  alert(
    "카카오톡으로 간편 회원가입!\n\n실제 서비스에서는 카카오 로그인 후\n추가 정보를 입력받아 회원가입을 완료합니다.\n\n개발자 가이드: developers.kakao.com"
  );

  // 실제 구현 예시 (주석):
  // window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=YOUR_REST_API_KEY&redirect_uri=YOUR_REDIRECT_URI&response_type=code`;
}

// Device Connection
function connectDevice() {
  const modal = document.getElementById("deviceModal");
  const backdrop = document.getElementById("modalBackdrop");

  backdrop.classList.add("show");
  modal.classList.add("show");
}

function closeDevice() {
  const modal = document.getElementById("deviceModal");
  const backdrop = document.getElementById("modalBackdrop");
  modal.classList.remove("show");
  backdrop.classList.remove("show");
}

// Notification Management
let notifications = [];

// Sample notifications data
const sampleNotifications = [
  {
    id: 1,
    type: "warning",
    title: "침입 감지",
    content: "거실 창문 센서에서 비정상적인 움직임이 감지되었습니다.",
    device: "거실 창문 센서",
    deviceId: "WIN-001",
    time: "5분 전",
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    unread: true,
  },
  {
    id: 2,
    type: "warning",
    title: "음성 감지",
    content: "현관 음성 녹음 장치에서 의심스러운 소리가 감지되었습니다.",
    device: "현관 음성 녹음 장치",
    deviceId: "VOI-002",
    time: "15분 전",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    unread: true,
  },
  {
    id: 3,
    type: "info",
    title: "기기 연결",
    content: "작은방 창문 센서가 정상적으로 연결되었습니다.",
    device: "작은방 창문 센서",
    deviceId: "WIN-003",
    time: "1시간 전",
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    unread: false,
  },
];

// Load notifications from localStorage
function loadNotifications() {
  const savedNotifications = localStorage.getItem("notifications");
  if (savedNotifications) {
    notifications = JSON.parse(savedNotifications);
  } else {
    notifications = [...sampleNotifications];
    saveNotifications();
  }
  updateNotificationBadge();
}

function saveNotifications() {
  localStorage.setItem("notifications", JSON.stringify(notifications));
  updateNotificationBadge();
}

function updateNotificationBadge() {
  const unreadCount = notifications.filter((n) => n.unread).length;
  const badge = document.getElementById("notificationBadge");
  if (unreadCount > 0) {
    badge.textContent = unreadCount;
    badge.style.display = "flex";
  } else {
    badge.style.display = "none";
  }
}

// Initialize notifications
loadNotifications();

function openNotifications() {
  const panel = document.getElementById("notificationPanel");
  panel.classList.toggle("show");
  renderNotifications();

  // Mark all as read after opening
  setTimeout(() => {
    notifications.forEach((n) => (n.unread = false));
    saveNotifications();
    renderNotifications();
  }, 1000);
}

function renderNotifications() {
  const list = document.getElementById("notificationList");

  if (notifications.length === 0) {
    list.innerHTML = `
            <div class="empty-notifications">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
              </svg>
              <h4>알림이 없습니다</h4>
              <p>새로운 알림이 오면 여기에 표시됩니다</p>
            </div>
          `;
    return;
  }

  list.innerHTML = notifications
    .map(
      (notif) => `
          <div class="notification-item ${
            notif.unread ? "unread" : ""
          }" onclick="viewNotificationDetail(${notif.id})">
            <div class="notification-item-header">
              <div class="notification-type ${notif.type}">
                ${getNotificationIcon(notif.type)}
                <span>${notif.title}</span>
              </div>
              <span class="notification-time">${notif.time}</span>
            </div>
            <div class="notification-content">${notif.content}</div>
            <div class="notification-device">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px;">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                <line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>
              ${notif.device}
            </div>
          </div>
        `
    )
    .join("");
}

function getNotificationIcon(type) {
  const icons = {
    warning:
      '<svg class="notification-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    info: '<svg class="notification-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    success:
      '<svg class="notification-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  };
  return icons[type] || icons.info;
}

function viewNotificationDetail(id) {
  const notif = notifications.find((n) => n.id === id);
  if (notif) {
    alert(
      `[${notif.title}]\n\n${notif.content}\n\n기기: ${notif.device}\nID: ${notif.deviceId}\n시간: ${notif.time}`
    );
  }
}

function clearAllNotifications() {
  if (confirm("모든 알림을 삭제하시겠습니까?")) {
    notifications = [];
    saveNotifications();
    renderNotifications();
  }
}

// Close notification panel when clicking outside
document.addEventListener("click", function (e) {
  const panel = document.getElementById("notificationPanel");
  const button = e.target.closest('.icon-btn[title="알림"]');

  if (!panel.contains(e.target) && !button) {
    panel.classList.remove("show");
  }
});

// Device Management
let registeredDevices = [];

// Load devices from localStorage
function loadDevices() {
  const savedDevices = localStorage.getItem("registeredDevices");
  if (savedDevices) {
    registeredDevices = JSON.parse(savedDevices);
  }
}

function saveDevices() {
  localStorage.setItem("registeredDevices", JSON.stringify(registeredDevices));
}

// Initialize devices on page load
loadDevices();

function connectDevice() {
  const modal = document.getElementById("deviceModal");
  const backdrop = document.getElementById("modalBackdrop");

  backdrop.classList.add("show");
  modal.classList.add("show");

  // Set today's date as default
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("deviceDate").value = today;

  renderRegisteredDevices();
}

function handleDeviceSubmit(e) {
  e.preventDefault();

  const deviceId = document.getElementById("deviceId").value;
  const deviceType = document.getElementById("deviceType").value;
  const deviceName = document.getElementById("deviceName").value;
  const deviceLocation = document.getElementById("deviceLocation").value;
  const deviceDate = document.getElementById("deviceDate").value;

  const typeNames = {
    window: "창문 센서",
    voice: "음성 녹음 장치",
    camera: "CCTV 카메라",
    door: "출입문 센서",
  };

  const newDevice = {
    id: deviceId,
    type: deviceType,
    typeName: typeNames[deviceType],
    name: deviceName || typeNames[deviceType],
    location: deviceLocation,
    date: deviceDate,
    registeredAt: new Date().toISOString(),
  };

  registeredDevices.push(newDevice);
  saveDevices();
  renderRegisteredDevices();

  document.getElementById("deviceForm").reset();
  alert("기기가 성공적으로 등록되었습니다!");
}

function renderRegisteredDevices() {
  const list = document.getElementById("registeredDevicesList");

  if (registeredDevices.length === 0) {
    list.innerHTML = '<div class="empty-devices">등록된 기기가 없습니다</div>';
    return;
  }

  list.innerHTML = registeredDevices
    .map(
      (device, index) => `
          <div class="registered-device-card">
            <div class="registered-device-info">
              <h4>${device.name}</h4>
              <p><strong>ID:</strong> ${device.id}</p>
              <p><strong>타입:</strong> ${device.typeName}</p>
              <p><strong>위치:</strong> ${device.location}</p>
              <p><strong>설치일:</strong> ${device.date}</p>
            </div>
            <button class="device-delete-btn" onclick="deleteDevice(${index})">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        `
    )
    .join("");
}

function deleteDevice(index) {
  if (confirm("이 기기를 삭제하시겠습니까?")) {
    registeredDevices.splice(index, 1);
    saveDevices();
    renderRegisteredDevices();
  }
}

function selectDevice(deviceType) {
  const deviceNames = {
    smartphone: "iPhone 15 Pro",
    camera: "현관 카메라 #1",
    sensor: "거실 창문 센서",
    mic: "음성 녹음 장치",
  };
  alert(`${deviceNames[deviceType]}를 선택했습니다.`);
}

function addNewDevice() {
  alert("새 기기 추가 기능은 개발 중입니다.");
}

// Open Community Board
function openCommunity() {
  document.getElementById("mainContent").style.display = "none";
  document.getElementById("communityContent").style.display = "block";
  renderCommunityPosts();
}

// Close Community and return to main
function closeCommunity() {
  document.getElementById("communityContent").style.display = "none";
  document.getElementById("mainContent").style.display = "block";
}

// Community posts data - Default posts
const defaultPosts = [
  {
    id: 0,
    category: "safety",
    categoryName: "안전 정보",
    title: "밤늦은 귀가 시 안전 수칙 5가지",
    content:
      "혼자 늦게 귀가할 때 반드시 지켜야 할 안전 수칙들을 정리해봤습니다.\n\n1. 밝고 사람이 많은 길로 다니기\n2. 이어폰 사용 자제하기\n3. 긴급 연락처 단축키 설정해두기\n4. 주변을 자주 확인하며 걷기\n5. 위험을 느끼면 즉시 112 신고\n\n특히 어두운 골목길을 지나가야 할 때는 더욱 주의가 필요합니다.",
    author: "안전이",
    avatar: "A",
    time: "2시간 전",
    likes: 127,
    views: 856,
    commentsList: [
      {
        author: "감사",
        avatar: "G",
        content: "유용한 정보 감사합니다!",
        time: "1시간 전",
      },
      {
        author: "안심",
        avatar: "H",
        content: "저도 항상 이렇게 하고 있어요.",
        time: "30분 전",
      },
    ],
  },
  {
    id: 1,
    category: "tip",
    categoryName: "생활 팁",
    title: "스마트폰 위급상황 단축키 설정하기",
    content:
      "위험한 상황에서 빠르게 대응할 수 있는 스마트폰 단축키 설정 방법을 공유합니다.\n\n【iPhone 사용자】\n측면 버튼 5번 연속 누르기로 긴급 SOS 활성화\n\n【Android 사용자】\n전원 버튼 3번 누르기로 긴급 연락처 전송",
    author: "테크리더",
    avatar: "B",
    time: "5시간 전",
    likes: 94,
    views: 542,
    commentsList: [
      {
        author: "유용",
        avatar: "I",
        content: "몰랐던 기능이네요!",
        time: "4시간 전",
      },
    ],
  },
  {
    id: 2,
    category: "story",
    categoryName: "경험 공유",
    title: "위급 상황에서 앱이 도움이 되었던 경험",
    content:
      "어제 밤 귀가길에 실제로 위급한 상황이 있었는데, 이 앱 덕분에 큰 도움을 받았습니다.\n\n늦은 밤 지하철역에서 집까지 걸어가는데 누가 계속 따라오는 것 같은 느낌이 들었어요. 앱의 긴급 버튼을 눌렀더니 바로 등록된 연락처로 위치와 함께 알림이 갔고, 5분 안에 친구가 근처로 와줬습니다.\n\n정말 든든했고, 이런 기능이 있어서 안심이 됐습니다.",
    author: "감사해요",
    avatar: "C",
    time: "1일 전",
    likes: 342,
    views: 1243,
    commentsList: [
      {
        author: "안전",
        avatar: "J",
        content: "무사하셔서 다행입니다!",
        time: "20시간 전",
      },
      {
        author: "추천",
        avatar: "K",
        content: "저도 바로 설정했어요.",
        time: "18시간 전",
      },
    ],
  },
  {
    id: 3,
    category: "qna",
    categoryName: "질문과 답변",
    title: "긴급 연락망 설정은 어떻게 하나요?",
    content:
      "앱을 처음 사용하는데, 긴급 연락망을 어떻게 설정하는지 잘 모르겠어요.\n\n환경설정에 들어가봤는데 메뉴가 너무 많아서 헷갈리네요. 자세한 방법 알려주실 수 있나요?",
    author: "궁금이",
    avatar: "D",
    time: "2일 전",
    likes: 45,
    views: 321,
    commentsList: [
      {
        author: "도움",
        avatar: "M",
        content: "설정 > 긴급 연락처 > 추가하기 순서로 하시면 됩니다!",
        time: "1일 전",
      },
    ],
  },
  {
    id: 4,
    category: "safety",
    categoryName: "안전 정보",
    title: "CCTV가 있는 안전한 길 찾기 앱",
    content:
      "밤길이 무서운 분들을 위해 CCTV가 많이 설치된 안전한 경로를 찾아주는 유용한 앱들을 소개합니다.\n\n1. 안심귀가 앱\n2. 여성안심귀가 서비스\n3. 서울시 안심이 앱",
    author: "안심길잡이",
    avatar: "E",
    time: "3일 전",
    likes: 289,
    views: 1567,
    commentsList: [
      {
        author: "정보",
        avatar: "N",
        content: "좋은 정보 감사합니다!",
        time: "2일 전",
      },
    ],
  },
  {
    id: 5,
    category: "tip",
    categoryName: "생활 팁",
    title: "호신용품 추천 및 사용법",
    content:
      "실제로 사용해본 호신용품들 중에서 가장 효과적이고 휴대하기 편한 제품들을 추천드립니다.\n\n1. 휴대용 경보기\n2. 호신용 스프레이\n3. 손전등",
    author: "안전지킴이",
    avatar: "F",
    time: "4일 전",
    likes: 156,
    views: 923,
    commentsList: [
      {
        author: "구매",
        avatar: "P",
        content: "경보기 구매했어요!",
        time: "3일 전",
      },
    ],
  },
];

// ✅ 서버에서 커뮤니티 게시글 불러오기
let communityPostsData = [];

async function loadPosts() {
  try {
    const response = await fetch("/api/posts");
    if (!response.ok) throw new Error("게시글 불러오기 실패");
    communityPostsData = await response.json();
    renderCommunityPosts(); // 렌더링 실행
  } catch (err) {
    console.error("❌ 게시글 불러오기 오류:", err);
    const grid = document.getElementById("communityPostGrid");
    grid.innerHTML = `<p style="color:gray;text-align:center;padding:40px;">게시글을 불러오지 못했습니다.</p>`;
  }
}

function savePosts() {
  localStorage.setItem("communityPosts", JSON.stringify(communityPostsData));
}

// Initialize posts on page load
loadPosts();

let currentCommunityCategory = "all";
let currentPostIndex = 0;
let isPostLiked = false;

// Render community posts
function renderCommunityPosts() {
  const grid = document.getElementById("communityPostGrid");

  const filteredPosts =
    currentCommunityCategory === "all"
      ? communityPostsData
      : communityPostsData.filter(
          (post) => post.CATEGORY === currentCommunityCategory
        );

  grid.innerHTML = filteredPosts
    .map(
      (post) => `
    <div class="community-post-card" data-category="${post.CATEGORY}">
      <div>
        <span class="community-post-category ${post.CATEGORY}">
          ${convertCategory(post.CATEGORY)}
        </span>
      </div>
      <h3 class="community-post-title">${post.TITLE}</h3>
      <p class="community-post-content">${post.CONTENT.substring(0, 80)}...</p>
      <div class="community-post-meta">
        <div class="community-post-author">
          <div class="community-author-avatar">${post.EMAIL.charAt(
            0
          ).toUpperCase()}</div>
          <div class="community-author-info">
            <span class="community-author-name">${post.EMAIL}</span>
          </div>
        </div>
        <div class="community-post-stats">
          <div class="community-stat-item">❤️ ${post.LIKE_COUNT}</div>
          <div class="community-stat-item">👁 ${post.VIEW_COUNT}</div>
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

// Filter community posts by category
function filterCommunityCategory(category) {
  currentCommunityCategory = category;

  // Update active tab
  const tabs = document.querySelectorAll(".community-category-tab");
  tabs.forEach((tab, index) => {
    tab.classList.remove("active");
    const categories = ["all", "safety", "tip", "story", "qna"];
    if (categories[index] === category) {
      tab.classList.add("active");
    }
  });

  renderCommunityPosts();
}

// Open new post modal
function openNewPost() {
  const modal = document.getElementById("newPostModal");
  const backdrop = document.getElementById("modalBackdrop");
  backdrop.classList.add("show");
  modal.classList.add("show");
}

// Close new post modal
function closeNewPostModal() {
  const modal = document.getElementById("newPostModal");
  const backdrop = document.getElementById("modalBackdrop");
  modal.classList.remove("show");
  backdrop.classList.remove("show");
  document.getElementById("newPostForm").reset();
}

// Handle new post submission
function handleNewPostSubmit(e) {
  e.preventDefault();

  const category = document.getElementById("newPostCategory").value;
  const title = document.getElementById("newPostTitle").value;
  const content = document.getElementById("newPostContent").value;

  // ✅ 카테고리명 변환 함수
  function convertCategory(code) {
    const map = {
      safety: "안전 정보",
      tip: "생활 팁",
      story: "경험 공유",
      qna: "질문과 답변",
    };
    return map[code] || "기타";
  }

  // Generate unique ID based on timestamp
  const newId = Date.now();

  const newPost = {
    id: newId,
    category: category,
    categoryName: categoryNames[category],
    title: title,
    content: content,
    author: "나",
    avatar: "U",
    time: "방금 전",
    likes: 0,
    views: 1,
    commentsList: [],
  };

  communityPostsData.unshift(newPost);
  savePosts(); // Save to localStorage
  renderCommunityPosts();
  closeNewPostModal();
  alert("게시글이 등록되었습니다!");
}

// Open post detail
function openPostDetail(postId) {
  currentPostIndex = postId;
  const post = communityPostsData.find((p) => p.id === postId);
  const modal = document.getElementById("postDetailModal");
  const backdrop = document.getElementById("modalBackdrop");

  document.getElementById("postDetailTitle").textContent = post.title;
  document.getElementById("postDetailAuthor").textContent = post.author;
  document.getElementById("postDetailAvatar").textContent = post.avatar;
  document.getElementById("postDetailTime").textContent = post.time;
  document.getElementById("postDetailViews").textContent = post.views;
  document.getElementById("postDetailContent").textContent = post.content;
  document.getElementById("likeCount").textContent = post.likes;
  document.getElementById("commentCount").textContent =
    post.commentsList.length;
  document.getElementById("commentCountText").textContent =
    post.commentsList.length;

  // Render comments
  const commentsList = document.getElementById("commentsList");
  commentsList.innerHTML = post.commentsList
    .map(
      (comment) => `
          <div class="comment-item">
            <div class="comment-header">
              <div class="community-post-author">
                <div class="community-author-avatar">${comment.avatar}</div>
                <div class="community-author-info">
                  <span class="community-author-name">${comment.author}</span>
                  <span class="community-post-time">${comment.time}</span>
                </div>
              </div>
            </div>
            <div class="comment-content">${comment.content}</div>
          </div>
        `
    )
    .join("");

  backdrop.classList.add("show");
  modal.classList.add("show");
  isPostLiked = false;
  document.getElementById("likeBtn").classList.remove("liked");

  // Increase view count
  post.views++;
  savePosts(); // Save to localStorage
}

// Close post detail modal
function closePostDetailModal() {
  const modal = document.getElementById("postDetailModal");
  const backdrop = document.getElementById("modalBackdrop");
  modal.classList.remove("show");
  backdrop.classList.remove("show");
  document.getElementById("commentInput").value = "";
  renderCommunityPosts();
}

// Toggle post like
function togglePostLike() {
  const likeBtn = document.getElementById("likeBtn");
  const likeCount = document.getElementById("likeCount");
  const post = communityPostsData.find((p) => p.id === currentPostIndex);

  isPostLiked = !isPostLiked;

  if (isPostLiked) {
    likeBtn.classList.add("liked");
    post.likes++;
  } else {
    likeBtn.classList.remove("liked");
    post.likes--;
  }

  likeCount.textContent = post.likes;
  savePosts(); // Save to localStorage
}

// Focus comment input
function focusCommentInput() {
  document.getElementById("commentInput").focus();
}

// Submit comment
function submitComment() {
  const input = document.getElementById("commentInput");
  const comment = input.value.trim();

  if (comment === "") {
    alert("댓글을 입력해주세요.");
    return;
  }

  const post = communityPostsData.find((p) => p.id === currentPostIndex);
  post.commentsList.push({
    author: "나",
    avatar: "U",
    content: comment,
    time: "방금 전",
  });

  savePosts(); // Save to localStorage

  // Update comment count
  document.getElementById("commentCount").textContent =
    post.commentsList.length;
  document.getElementById("commentCountText").textContent =
    post.commentsList.length;

  // Re-render comments
  const commentsList = document.getElementById("commentsList");
  commentsList.innerHTML = post.commentsList
    .map(
      (c) => `
          <div class="comment-item">
            <div class="comment-header">
              <div class="community-post-author">
                <div class="community-author-avatar">${c.avatar}</div>
                <div class="community-author-info">
                  <span class="community-author-name">${c.author}</span>
                  <span class="community-post-time">${c.time}</span>
                </div>
              </div>
            </div>
            <div class="comment-content">${c.content}</div>
          </div>
        `
    )
    .join("");

  input.value = "";
}
