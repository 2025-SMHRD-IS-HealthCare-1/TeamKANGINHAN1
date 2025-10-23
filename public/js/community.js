document.addEventListener("DOMContentLoaded", () => {
  const writeBtn = document.getElementById("writeBtn");
  const postList = document.getElementById("postList");

  writeBtn.addEventListener("click", () => {
    window.location.href = ""; // 새글 작성 페이지로 이동
  });

  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  postList.innerHTML = posts
    .map(
      (p) => `
        <li>
          <b>[${p.category}]</b> ${p.title}<br>
          <small>${p.content}</small>
        </li>
      `
    )
    .join("");
});
