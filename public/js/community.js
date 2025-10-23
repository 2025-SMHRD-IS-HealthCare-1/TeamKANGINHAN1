let posts = [];
let currentCategory = 'all';

// 페이지 로드 시 게시글 불러오기
async function loadPosts() {
  try {
    const response = await fetch('/api/posts');
    if (response.ok) {
      posts = await response.json();
      renderPosts();
    }
  } catch (error) {
    console.error('게시글 로드 실패:', error);
  }
}

// 게시글 렌더링
function renderPosts() {
  const grid = document.getElementById('postGrid');
  const filteredPosts = currentCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === currentCategory);

  if (filteredPosts.length === 0) {
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px; color: var(--gray-500);">게시글이 없습니다.</div>';
    return;
  }

  grid.innerHTML = filteredPosts.map(post => `
    <div class="community-post-card" onclick="viewPost(${post.id})">
      <div>
        <span class="community-post-category ${post.category}">${post.category_name || getCategoryName(post.category)}</span>
      </div>
      <h3 style="font-size: 18px; font-weight: 700; margin: 16px 0 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
        ${post.title}
      </h3>
      <p style="font-size: 14px; color: var(--gray-600); line-height: 1.6; margin-bottom: 16px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
        ${post.content.substring(0, 100)}...
      </p>
      <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid var(--gray-100);">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--blue), var(--purple)); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 14px;">
            ${post.avatar}
          </div>
          <div>
            <div style="font-size: 13px; font-weight: 600;">${post.author}</div>
            <div style="font-size: 12px; color: var(--gray-500);">${formatDate(post.created_at)}</div>
          </div>
        </div>
        <div style="display: flex; gap: 16px; font-size: 13px; color: var(--gray-600);">
          <span>❤️ ${post.likes}</span>
          <span>👁️ ${post.views}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// 카테고리 필터링
function filterCategory(category) {
  currentCategory = category;
  
  // 탭 활성화 상태 변경
  document.querySelectorAll('.community-category-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  event.target.classList.add('active');
  
  renderPosts();
}

// 게시글 상세보기
function viewPost(postId) {
  window.location.href = `/community/post/${postId}`;
}

// 카테고리 이름 가져오기
function getCategoryName(category) {
  const names = {
    'safety': '안전 정보',
    'tip': '생활 팁',
    'story': '경험 공유',
    'qna': '질문과 답변'
  };
  return names[category] || category;
}

// 날짜 포맷팅
function formatDate(dateString) {
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

// 페이지 로드 시 실행
window.addEventListener('DOMContentLoaded', () => {
  loadPosts();
});
