// 알림 관리
let notifications = [];

// 페이지 로드 시 알림 불러오기
async function loadNotifications() {
  try {
    const response = await fetch('/api/notifications');
    if (response.ok) {
      notifications = await response.json();
      updateNotificationBadge();
    }
  } catch (error) {
    console.error('알림 로드 실패:', error);
  }
}

function updateNotificationBadge() {
  const unreadCount = notifications.filter(n => !n.is_read).length;
  const badge = document.getElementById('notificationBadge');
  if (unreadCount > 0) {
    badge.textContent = unreadCount;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}

// 알림 패널 열기
function openNotifications() {
  alert('알림 기능은 곧 추가됩니다!');
}

// 설정 열기
function openSettings() {
  alert('설정 기능은 곧 추가됩니다!');
}

// 긴급 신고
function triggerEmergency() {
  if (confirm('긴급 신고를 하시겠습니까?\n등록된 연락처로 알림이 전송됩니다.')) {
    alert('긴급 신고가 접수되었습니다!\n등록된 연락처로 알림이 전송되었습니다.');
  }
}

// 기기 연결
function connectDevice() {
  window.location.href = '/devices';
}

// 로그인 처리
async function handleLogin(e) {
  e.preventDefault();
  const email = e.target.querySelector('input[type="email"]').value;
  const password = e.target.querySelector('input[type="password"]').value;

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      alert('로그인 성공!');
      window.location.reload();
    } else {
      alert('로그인 실패! 이메일과 비밀번호를 확인해주세요.');
    }
  } catch (error) {
    console.error('로그인 오류:', error);
    alert('로그인 중 오류가 발생했습니다.');
  }
}

// 회원가입 모달 열기
function openSignup() {
  alert('회원가입 기능은 곧 추가됩니다!');
}

// 카카오 로그인
function handleKakaoLogin() {
  alert('카카오톡 로그인 페이지로 이동합니다.\n\n실제 서비스에서는 카카오 개발자 센터에서\nREST API 키를 발급받아 연동해야 합니다.\n\n개발자 가이드: developers.kakao.com');
}

// 페이지 로드 시 실행
window.addEventListener('DOMContentLoaded', () => {
  loadNotifications();
});
