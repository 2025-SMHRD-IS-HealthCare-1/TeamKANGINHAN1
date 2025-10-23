// 게시글 작성 처리
async function handlePostSubmit(e) {
  e.preventDefault();

  const category = document.getElementById('postCategory').value;
  const title = document.getElementById('postTitle').value;
  const content = document.getElementById('postContent').value;
  const author = document.getElementById('postAuthor').value;

  const categoryNames = {
    'safety': '안전 정보',
    'tip': '생활 팁',
    'story': '경험 공유',
    'qna': '질문과 답변'
  };

  const newPost = {
    category: category,
    category_name: categoryNames[category],
    title: title,
    content: content,
    author: author,
    avatar: author.charAt(0).toUpperCase()
  };

  try {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    });

    if (response.ok) {
      const result = await response.json();
      alert('게시글이 성공적으로 작성되었습니다!');
      window.location.href = '/community';
    } else {
      const error = await response.json();
      alert('게시글 작성 실패: ' + (error.error || '알 수 없는 오류'));
    }
  } catch (error) {
    console.error('게시글 작성 오류:', error);
    alert('게시글 작성 중 오류가 발생했습니다.');
  }
}

// 페이지를 떠나기 전 확인
let isFormDirty = false;

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('postForm');
  const inputs = form.querySelectorAll('input, textarea, select');
  
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      isFormDirty = true;
    });
  });

  // 폼 제출 시에는 경고 안 함
  form.addEventListener('submit', () => {
    isFormDirty = false;
  });
});

window.addEventListener('beforeunload', (e) => {
  if (isFormDirty) {
    e.preventDefault();
    e.returnValue = '';
  }
});
