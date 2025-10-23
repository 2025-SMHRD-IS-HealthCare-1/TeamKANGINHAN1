// new_post.js

async function handlePostSubmit(e) {
  e.preventDefault();

  const category = document.getElementById("postCategory").value;
  const title = document.getElementById("postTitle").value;
  const content = document.getElementById("postContent").value;
  const token = localStorage.getItem("token");

  if (!token) {
    alert("로그인 후 게시글을 작성할 수 있습니다.");
    window.location.href = "/login";
    return;
  }

  try {
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ 로그인 토큰 포함
      },
      body: JSON.stringify({
        category,
        title,
        content,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("게시글이 성공적으로 등록되었습니다!");
      window.location.href = "/community"; // ✅ 커뮤니티 페이지로 이동
    } else {
      alert("게시글 등록 실패: " + (result.error || "서버 오류"));
    }
  } catch (err) {
    console.error("게시글 등록 중 오류:", err);
    alert("서버와 통신 중 오류가 발생했습니다.");
  }
}
