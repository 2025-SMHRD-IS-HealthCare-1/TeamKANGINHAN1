#!/usr/bin/env python3
# ======================================================
# ✅ 1️⃣ Mock GPIO 먼저 정의 (Windows에서 에러 방지)
# ======================================================
try:
    import RPi.GPIO as GPIO
except ModuleNotFoundError:
    class MockGPIO:
        BOARD = "BOARD"
        BCM = "BCM"
        OUT = "OUT"
        IN = "IN"
        PUD_DOWN = "PUD_DOWN"
        def setmode(self, mode): print(f"[MockGPIO] setmode({mode})")
        def setwarnings(self, flag): print(f"[MockGPIO] setwarnings({flag})")
        def setup(self, pin, mode, pull_up_down=None): print(f"[MockGPIO] setup(pin={pin}, mode={mode})")
        def output(self, pin, value): print(f"[MockGPIO] output(pin={pin}, value={value})")
        def input(self, pin): return 0
        def PWM(self, pin, freq):
            print(f"[MockGPIO] PWM(pin={pin}, freq={freq})")
            return self.MockPWM()
        def cleanup(self): print("[MockGPIO] cleanup()")

        class MockPWM:
            def start(self, duty): print(f"[MockPWM] start(duty={duty})")
            def stop(self): print("[MockPWM] stop()")

    GPIO = MockGPIO()

# ======================================================
# ✅ 2️⃣ 이제 나머지 모듈 import
# ======================================================
import time, datetime, subprocess
from pathlib import Path

import random
import mysql.connector
import time
from datetime import datetime

def main():
    print("✅ 가상 센서 시뮬레이션 시작 (MockGPIO 모드)")
    try:
        # ✅ MySQL 연결
        db = mysql.connector.connect(
            host="localhost",      # 👉 실제 DB 주소로 교체
            user="root",           # 👉 사용자명
            password="비밀번호",   # 👉 비밀번호
            database="forher"      # 👉 데이터베이스명
        )
        cursor = db.cursor()

        # ✅ SENSOR_LOGS 테이블 생성 (없으면 자동 생성)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS SENSOR_LOGS (
            id INT AUTO_INCREMENT PRIMARY KEY,
            sensor_type VARCHAR(20),
            value FLOAT,
            created_at DATETIME
        )
        """)
        db.commit()

        while True:
            # 🔹 랜덤 센서값 생성
            distance = round(random.uniform(5.0, 20.0), 2)
            vibration = round(random.uniform(0.0, 1.0), 3)
            temperature = round(random.uniform(20.0, 35.0), 1)

            # 🔹 DB 저장
            now = datetime.now()
            cursor.execute(
                "INSERT INTO SENSOR_LOGS (sensor_type, value, created_at) VALUES (%s, %s, %s)",
                ("distance", distance, now)
            )
            cursor.execute(
                "INSERT INTO SENSOR_LOGS (sensor_type, value, created_at) VALUES (%s, %s, %s)",
                ("vibration", vibration, now)
            )
            cursor.execute(
                "INSERT INTO SENSOR_LOGS (sensor_type, value, created_at) VALUES (%s, %s, %s)",
                ("temperature", temperature, now)
            )
            db.commit()

            print(f"📡 거리={distance}cm, 진동={vibration}, 온도={temperature}°C  → DB 저장 완료")
            time.sleep(2)

    except Exception as e:
        print("❌ DB 연결 오류:", e)

    finally:
        cursor.close()
        db.close()
        print("🔌 DB 연결 종료")
