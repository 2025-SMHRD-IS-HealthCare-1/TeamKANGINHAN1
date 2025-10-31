/* ==================================================
 🧱 COMMUNITY.JS (최종 통합 버전)
================================================== */

// ✅ 커뮤니티 페이지 열기
function openCommunity() {
  document.getElementById("communityContent").style.display = "block";
  loadCommunityPosts(); // DB에서 게시글 로드
}

// ✅ 메인으로 돌아가기
function closeCommunity() {
  window.location.href = "main.html";
}

/* ==================================================
 📋 게시글 목록 불러오기 (DB)
================================================== */
async function loadCommunityPosts(category = "all") {
  try {
    console.log("📡 게시글 불러오는 중...");
    const res = await fetch("/api/community/posts");
    if (!res.ok) throw new Error("게시글 조회 실패");

    const posts = await res.json();
    const grid = document.getElementById("communityPostGrid");

    // ✅ 카테고리 필터 적용
    const filtered =
      category === "all" ? posts : posts.filter((p) => p.CATEGORY === category);

    if (!filtered.length) {
      grid.innerHTML = `<p style="color:gray;text-align:center;">게시글이 없습니다.</p>`;
      return;
    }

    // ✅ 목록 렌더링
    grid.innerHTML = filtered
      .map(
        (post) => `
      <div class="community-post-card" data-id="${post.POST_ID}">
        <div>
          <span class="community-post-category ${post.CATEGORY}">
            ${convertCategory(post.CATEGORY)}
          </span>
        </div>
        <h3 class="community-post-title">${escapeHtml(post.TITLE)}</h3>
        <p class="community-post-content">${escapeHtml(
          post.CONTENT.substring(0, 100)
        )}...</p>
        <div class="community-post-meta">
          <div class="community-post-author">
            <div class="community-author-avatar">
              ${post.EMAIL ? post.EMAIL.charAt(0).toUpperCase() : "?"}
            </div>
            <div class="community-author-info">
              <span class="community-author-name">${escapeHtml(
                post.EMAIL || "익명"
              )}</span>
              <span class="community-post-time">${new Date(
                post.CREATED_AT
              ).toLocaleString()}</span>
            </div>
          </div>
          <div class="community-post-stats">
            <div class="community-stat-item">❤️ ${post.LIKE_COUNT || 0}</div>
            <div class="community-stat-item">👁 ${post.VIEW_COUNT || 0}</div>
            <div class="community-stat-item">💬 ${post.COMMENT_COUNT || 0}</div>

          </div>
        </div>
      </div>`
      )
      .join("");

    // ✅ 게시글 클릭 시 view.html로 이동
    document.querySelectorAll(".community-post-card").forEach((card) => {
      card.addEventListener("click", () => {
        const postId = card.dataset.id;
        if (postId) window.location.href = `/view.html?id=${postId}`;
      });
    });
  } catch (err) {
    console.error("❌ 게시글 불러오기 오류:", err);
  }
}

/* ==================================================
 🔖 카테고리 필터
================================================== */
function filterCommunityCategory(category) {
  document
    .querySelectorAll(".community-category-tab")
    .forEach((btn) => btn.classList.remove("active"));

  event.target.classList.add("active");
  loadCommunityPosts(category);
}

/* ==================================================
 ➕ 새 게시글 작성 페이지로 이동
================================================== */
function openNewPost() {
  window.location.href = "new_post.html";
}

/* ==================================================
 🏷️ 카테고리 변환
================================================== */
function convertCategory(code) {
  const map = {
    safety: "안전 정보",
    tip: "생활 팁",
    story: "경험 공유",
    qna: "질문과 답변",
  };
  return map[code] || "기타";
}

/* ==================================================
 🧼 XSS 방지용 HTML 이스케이프
================================================== */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
