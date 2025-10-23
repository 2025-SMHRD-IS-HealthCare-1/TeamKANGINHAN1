// 보안 키워드 관리
let keywords = [];

// 페이지 로드 시 키워드 불러오기
function loadKeywords() {
  const savedKeywords = localStorage.getItem('securityKeywords');
  if (savedKeywords) {
    keywords = JSON.parse(savedKeywords);
  } else {
    // 기본 키워드
    keywords = ['검은구름', '노랑사자'];
    saveKeywords();
  }
  renderKeywords();
}

// 키워드 저장
function saveKeywords() {
  localStorage.setItem('securityKeywords', JSON.stringify(keywords));
}

// 키워드 렌더링
function renderKeywords() {
  const list = document.getElementById('keywordList');
  
  if (keywords.length === 0) {
    list.innerHTML = '<p style="text-align: center; color: var(--gray-500); padding: 40px 20px;">등록된 키워드가 없습니다</p>';
    return;
  }

  list.innerHTML = keywords.map((keyword, index) => `
    <div class="keyword-item">
      <span class="keyword-text">${keyword}</span>
      <button class="keyword-delete" onclick="deleteKeyword(${index})">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
      </button>
    </div>
  `).join('');
}

// 키워드 추가
function addKeyword() {
  const input = document.getElementById('keywordInput');
  const keyword = input.value.trim();

  if (!keyword) {
    alert('키워드를 입력해주세요.');
    return;
  }

  if (keywords.includes(keyword)) {
    alert('이미 등록된 키워드입니다.');
    return;
  }

  if (keyword.length < 2) {
    alert('키워드는 2자 이상이어야 합니다.');
    return;
  }

  keywords.push(keyword);
  saveKeywords();
  renderKeywords();
  
  input.value = '';
  input.focus();
}

// 키워드 삭제
function deleteKeyword(index) {
  if (confirm(`"${keywords[index]}" 키워드를 삭제하시겠습니까?`)) {
    keywords.splice(index, 1);
    saveKeywords();
    renderKeywords();
  }
}

// 페이지 로드 시 실행
window.addEventListener('DOMContentLoaded', () => {
  loadKeywords();
});
