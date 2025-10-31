document.addEventListener("DOMContentLoaded", async () => {
  const postId = new URLSearchParams(window.location.search).get("id");

  // ✅ 게시글 로드
  await loadPost(postId);

  // ✅ 댓글 로드
  await loadComments(postId);

  // ✅ 댓글 등록
  const submitBtn = document.getElementById("commentSubmit");
  submitBtn.addEventListener("click", async () => {
    const input = document.getElementById("commentInput");
    const content = input.value.trim();
    if (!content) return alert("댓글을 입력하세요.");

    const token = localStorage.getItem("token");
    if (!token) return alert("로그인이 필요합니다.");

    try {
      const res = await fetch(`/api/community/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("댓글 등록 성공:", data);
        input.value = "";
        await loadComments(postId);
      } else {
        alert(data.message || "댓글 등록 실패");
      }
    } catch (err) {
      console.error("댓글 등록 오류:", err);
    }
  });
});

/* =============================
   ✅ 게시글 불러오기
============================= */
async function loadPost(postId) {
  try {
    const res = await fetch(`/api/community/posts/${postId}`);
    if (!res.ok) throw new Error("게시글 불러오기 실패");
    const data = await res.json();

    document.getElementById("postTitle").textContent = data.TITLE;
    document.getElementById("postContent").textContent = data.CONTENT;
    document.getElementById("postAuthor").textContent = data.EMAIL;
    document.getElementById("postDate").textContent = new Date(
      data.CREATED_AT
    ).toLocaleString();
    document.getElementById("likeCount").textContent = data.LIKE_COUNT || 0;
    document.getElementById("viewCount").textContent = data.VIEW_COUNT || 0;

    // ✅ 좋아요 상태 확인
    const token = localStorage.getItem("token");
    if (token) {
      const res2 = await fetch(`/api/community/posts/${postId}/like-status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res2.ok) {
        const { liked } = await res2.json();
        updateHeartIcon(liked);
      }
    }

    // ✅ 좋아요 클릭 이벤트
    const heart = document.querySelector(".heart-icon");
    heart.addEventListener("click", async () => {
      const token = localStorage.getItem("token");
      if (!token) return alert("로그인이 필요합니다.");

      const res3 = await fetch(`/api/community/posts/${postId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res3.json();
      if (res3.ok) {
        updateHeartIcon(result.liked);
        document.getElementById("likeCount").textContent = result.likeCount;
      } else {
        alert(result.message || "좋아요 처리 실패");
      }
    });
  } catch (err) {
    console.error("게시글 불러오기 오류:", err);
  }
}

/* =============================
   ✅ 댓글 불러오기
============================= */
async function loadComments(postId) {
  try {
    const res = await fetch(`/api/community/posts/${postId}/comments`);
    if (!res.ok) throw new Error("댓글 조회 실패");

    const data = await res.json();
    console.log("댓글 데이터:", data);

    const comments = Array.isArray(data.comments) ? data.comments : [];
    const commentsList = document.getElementById("commentsList");
    const commentCount = document.getElementById("commentCount");
    const commentCountText = document.getElementById("commentCountText");

    commentsList.innerHTML = "";
    commentCount.textContent = data.count || 0;
    commentCountText.textContent = `(${data.count || 0})`;

    if (comments.length === 0) {
      commentsList.innerHTML =
        '<p style="color:#777; text-align:center;">등록된 댓글이 없습니다.</p>';
      return;
    }

    comments.forEach((c) => {
      const div = document.createElement("div");
      div.classList.add("comment-item");
      div.innerHTML = `
        <div class="comment-item-header">
          <span>${c.EMAIL}</span>
          <span>${new Date(c.CREATED_AT).toLocaleString()}</span>
        </div>
        <div class="comment-item-content">${c.CMT_CONTENT}</div>
      `;
      commentsList.appendChild(div);
    });
  } catch (err) {
    console.error("댓글 불러오기 오류:", err);
  }
}

/* =============================
   ✅ 하트 아이콘 업데이트
============================= */
function updateHeartIcon(liked) {
  const heart = document.querySelector(".heart-icon");
  heart.textContent = liked ? "❤️" : "🤍";
}
