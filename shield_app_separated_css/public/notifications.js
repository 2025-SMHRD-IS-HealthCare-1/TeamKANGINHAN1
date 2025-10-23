let notifications = [];
let currentFilter = 'all';

// 페이지 로드 시 알림 불러오기
async function loadNotifications() {
  try {
    const response = await fetch('/api/notifications');
    if (response.ok) {
      notifications = await response.json();
      renderNotifications();
      updateNotificationBadge();
    }
  } catch (error) {
    console.error('알림 로드 실패:', error);
    // 샘플 데이터 사용
    loadSampleNotifications();
  }
}

// 샘플 알림 데이터
function loadSampleNotifications() {
  notifications = [
    {
      id: 1,
      type: 'warning',
      title: '침입 감지',
      content: '거실 창문 센서에서 비정상적인 움직임이 감지되었습니다.',
      device_id: 'WIN-001',
      device_name: '거실 창문 센서',
      is_read: false,
      created_at: new Date(Date.now() - 5 * 60000).toISOString()
    },
    {
      id: 2,
      type: 'warning',
      title: '음성 감지',
      content: '현관 음성 녹음 장치에서 의심스러운 소리가 감지되었습니다.',
      device_id: 'VOI-002',
      device_name: '현관 음성 녹음 장치',
      is_read: false,
      created_at: new Date(Date.now() - 15 * 60000).toISOString()
    },
    {
      id: 3,
      type: 'info',
      title: '기기 연결',
      content: '작은방 창문 센서가 정상적으로 연결되었습니다.',
      device_id: 'WIN-003',
      device_name: '작은방 창문 센서',
      is_read: true,
      created_at: new Date(Date.now() - 60 * 60000).toISOString()
    },
    {
      id: 4,
      type: 'success',
      title: '시스템 업데이트',
      content: '보안 시스템이 최신 버전으로 업데이트되었습니다.',
      device_id: null,
      device_name: '시스템',
      is_read: true,
      created_at: new Date(Date.now() - 120 * 60000).toISOString()
    }
  ];
  renderNotifications();
  updateNotificationBadge();
}

// 알림 렌더링
function renderNotifications() {
  const list = document.getElementById('notificationList');
  
  let filteredNotifications = notifications;
  
  if (currentFilter === 'unread') {
    filteredNotifications = notifications.filter(n => !n.is_read);
  } else if (currentFilter !== 'all') {
    filteredNotifications = notifications.filter(n => n.type === currentFilter);
  }

  if (filteredNotifications.length === 0) {
    list.innerHTML = `
      <div style="text-align: center; padding: 80px 20px;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="width: 64px; height: 64px; margin: 0 auto 16px; opacity: 0.3;">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
        </svg>
        <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px; color: var(--gray-700);">알림이 없습니다</h3>
        <p style="font-size: 14px; color: var(--gray-500);">새로운 알림이 오면 여기에 표시됩니다</p>
      </div>
    `;
    return;
  }

  list.innerHTML = filteredNotifications.map(notif => `
    <div class="notification-page-item ${notif.is_read ? '' : 'unread'}" onclick="viewNotification(${notif.id})">
      <div>
        <span class="notification-type-badge ${notif.type}">
          ${getNotificationIcon(notif.type)}
          ${notif.title}
        </span>
      </div>
      <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 8px; color: var(--gray-900);">
        ${notif.content}
      </h3>
      ${notif.device_name ? `
        <div style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background: var(--gray-100); border-radius: 6px; font-size: 12px; font-weight: 600; color: var(--gray-700); margin-bottom: 12px;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px;">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
            <line x1="12" y1="18" x2="12.01" y2="18"/>
          </svg>
          ${notif.device_name}
        </div>
      ` : ''}
      <div style="display: flex; justify-content: space-between; align-items: center; color: var(--gray-500); font-size: 13px;">
        <span>${formatTime(notif.created_at)}</span>
        ${!notif.is_read ? '<span style="color: var(--blue); font-weight: 600;">● 새 알림</span>' : ''}
      </div>
    </div>
  `).join('');
}

// 알림 필터링
function filterNotifications(filter) {
  currentFilter = filter;
  
  document.querySelectorAll('.community-category-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  event.target.classList.add('active');
  
  renderNotifications();
}

// 알림 상세보기
function viewNotification(notifId) {
  const notif = notifications.find(n => n.id === notifId);
  if (notif) {
    notif.is_read = true;
    renderNotifications();
    updateNotificationBadge();
    
    alert(`[${notif.title}]\n\n${notif.content}\n\n${notif.device_name ? '기기: ' + notif.device_name + '\n' : ''}시간: ${formatFullTime(notif.created_at)}`);
  }
}

// 모두 읽음 처리
function markAllAsRead() {
  notifications.forEach(n => n.is_read = true);
  renderNotifications();
  updateNotificationBadge();
  alert('모든 알림을 읽음 처리했습니다.');
}

// 모두 삭제
function clearAllNotifications() {
  if (confirm('모든 알림을 삭제하시겠습니까?')) {
    notifications = [];
    renderNotifications();
    updateNotificationBadge();
  }
}

// 배지 업데이트
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

// 알림 아이콘 가져오기
function getNotificationIcon(type) {
  const icons = {
    warning: '⚠️',
    info: 'ℹ️',
    success: '✅'
  };
  return icons[type] || 'ℹ️';
}

// 시간 포맷팅
function formatTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  
  return date.toLocaleDateString('ko-KR');
}

// 전체 시간 포맷팅
function formatFullTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// 페이지 로드 시 실행
window.addEventListener('DOMContentLoaded', () => {
  loadNotifications();
});
