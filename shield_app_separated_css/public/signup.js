// 회원가입 처리
async function handleSignup(e) {
  e.preventDefault();

  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const passwordConfirm = document.getElementById('signupPasswordConfirm').value;
  const agreeTerms = document.getElementById('agreeTerms').checked;

  // 비밀번호 확인
  if (password !== passwordConfirm) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  // 이용약관 동의 확인
  if (!agreeTerms) {
    alert('이용약관에 동의해주세요.');
    return;
  }

  const userData = {
    name: name,
    email: email,
    password: password
  };

  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (response.ok) {
      alert('회원가입이 완료되었습니다!\n로그인 페이지로 이동합니다.');
      window.location.href = '/';
    } else {
      const error = await response.json();
      alert('회원가입 실패: ' + (error.error || '알 수 없는 오류'));
    }
  } catch (error) {
    console.error('회원가입 오류:', error);
    alert('회원가입 중 오류가 발생했습니다.');
  }
}

// 카카오 회원가입
function handleKakaoSignup() {
  alert('카카오톡으로 간편 회원가입!\n\n실제 서비스에서는 카카오 로그인 후\n추가 정보를 입력받아 회원가입을 완료합니다.\n\n개발자 가이드: developers.kakao.com');
  
  // 실제 구현 예시 (주석):
  // window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=YOUR_REST_API_KEY&redirect_uri=YOUR_REDIRECT_URI&response_type=code`;
}

// 비밀번호 강도 체크 (선택적)
document.addEventListener('DOMContentLoaded', () => {
  const passwordInput = document.getElementById('signupPassword');
  
  passwordInput.addEventListener('input', (e) => {
    const password = e.target.value;
    
    // 비밀번호 강도 표시 (선택적 기능)
    if (password.length >= 8) {
      let strength = 0;
      if (password.match(/[a-z]/)) strength++;
      if (password.match(/[A-Z]/)) strength++;
      if (password.match(/[0-9]/)) strength++;
      if (password.match(/[^a-zA-Z0-9]/)) strength++;
      
      // 강도에 따른 UI 업데이트 가능
    }
  });
});
