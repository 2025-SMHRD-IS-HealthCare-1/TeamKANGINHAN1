// new_post.js
// 게시글 등록 요청 스크립트

async function handlePostSubmit(e) {
  e.preventDefault(); // 기본 폼 제출 막기

  // 입력값 가져오기
  const category = document.getElementById("postCategory").value.trim();
  const title = document.getElementById("postTitle").value.trim();
  const content = document.getElementById("postContent").value.trim();
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("userEmail") || "guest@shieldforher.com"; // ✅ 추가됨

  // ✅ 입력값 검증
  if (!category || !title || !content) {
    alert("모든 필수 항목을 입력해주세요.");
    return;
  }

  // 로그인 확인
  if (!token) {
    alert("로그인 후 게시글을 작성할 수 있습니다.");
    window.location.href = "/main.html";
    return;
  }

  // 버튼 비활성화 (중복 방지)
  const submitBtn =
    e.submitter || document.querySelector('button[type="submit"]');
  const originalText = submitBtn ? submitBtn.textContent : "";

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "등록 중...";
  }

  try {
    console.log("📤 게시글 등록 요청:", { email, category, title, content });

    // 서버 요청
    const response = await fetch("/api/community/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ category, title, content }), // ✅ email 추가
    });

    console.log("📥 응답 상태:", response.status);

    // ✅ 응답 본문 파싱
    let result = null;
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      try {
        result = await response.json();
        console.log("📥 응답 데이터:", result);
      } catch (parseError) {
        console.error("❌ JSON 파싱 실패:", parseError);
        const rawText = await response.text();
        console.log("📄 원본 응답:", rawText);
      }
    } else {
      const rawText = await response.text();
      console.log("📄 원본 응답 (non-JSON):", rawText);
    }

    // ✅ 성공 여부 판단
    const isSuccess =
      response.status >= 200 &&
      response.status < 300 &&
      (!result || result.success !== false);

    if (isSuccess) {
      console.log("✅ 게시글 등록 성공!");
      alert("✅ 게시글이 성공적으로 등록되었습니다!");
      setTimeout(() => {
        window.location.href = "./community.html";
      }, 100);
      return;
    }

    // ❌ 실패 처리
    const errorMessage =
      (result && (result.message || result.error)) ||
      `서버 오류 (HTTP ${response.status})`;

    console.error("❌ 게시글 등록 실패:", errorMessage);
    alert("❌ 게시글 등록 실패: " + errorMessage);
  } catch (err) {
    console.error("❌ 게시글 등록 중 오류:", err);
    alert("❌ 서버와 통신 중 오류가 발생했습니다.\n" + err.message);
  } finally {
    // 버튼 다시 활성화
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }
}

// ✅ 폼이 있다면 자동으로 이벤트 리스너 연결
document.addEventListener("DOMContentLoaded", () => {
  const postForm = document.getElementById("postForm");
  if (postForm) {
    postForm.addEventListener("submit", handlePostSubmit);
    console.log("✅ 게시글 작성 폼 이벤트 연결 완료");
  }
});
