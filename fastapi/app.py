from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import threading, sensor_main  

app = FastAPI()

# CORS 설정 (모든 도메인 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 헬스체크
@app.get("/health")
def health():
    return {"ok": True}

# 보안 토글
@app.api_route("/toggle", methods=["GET", "POST"])
def toggle():
    # 백그라운드 스레드에서 sensor_main 실행
    threading.Thread(target=sensor_main.main, daemon=True).start()
    return {"status": "started"}
