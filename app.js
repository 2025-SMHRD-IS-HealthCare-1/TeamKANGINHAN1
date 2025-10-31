const express = require("express");
const app = express();
const PORT = 3002;
const path = require("path");
const db = require("./config/db");
const db_pr = require("./config/db_pr");
//

const logger = require("./middlewares/logger");

const pageRouter = require("./routes/pageRouter");
const apiRouter = require("./routes/apiRouter");
const rapiRouter = require("./routes/rapiRouter");
const communityRouter = require("./routes/communityRouter");

// 미들웨어 설정
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// app.use(logger);

// 미들웨어 전역 사용 방법
// 내가 생성한 미들웨어를 라우터 위쪽에 app.use를 통해서 적용하면
// 해당 미들웨어 하단의 모든 라우터에 미들웨어가 적용된다

// 라우터 설정
app.use("/", pageRouter);
app.use("/api", apiRouter);
app.use("/api/rapi", rapiRouter);

app.use("/api/community", communityRouter);

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
