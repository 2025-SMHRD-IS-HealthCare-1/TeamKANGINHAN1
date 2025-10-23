-- SHIELD FOR HER 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS shield_for_her;
USE shield_for_her;

-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  kakao_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 게시글 테이블
CREATE TABLE IF NOT EXISTS posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category VARCHAR(50) NOT NULL,
  category_name VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100) NOT NULL,
  avatar VARCHAR(10) DEFAULT 'U',
  likes INT DEFAULT 0,
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_created_at (created_at)
);

-- 댓글 테이블
CREATE TABLE IF NOT EXISTS comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT NOT NULL,
  author VARCHAR(100) NOT NULL,
  avatar VARCHAR(10) DEFAULT 'U',
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  INDEX idx_post_id (post_id)
);

-- 기기 테이블
CREATE TABLE IF NOT EXISTS devices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  device_id VARCHAR(100) UNIQUE NOT NULL,
  device_type VARCHAR(50) NOT NULL,
  device_name VARCHAR(100),
  location VARCHAR(100) NOT NULL,
  install_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_device_id (device_id)
);

-- 알림 테이블
CREATE TABLE IF NOT EXISTS notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  device_id VARCHAR(100),
  device_name VARCHAR(100),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE SET NULL,
  INDEX idx_created_at (created_at),
  INDEX idx_is_read (is_read)
);

-- 샘플 데이터 삽입
INSERT INTO posts (category, category_name, title, content, author, avatar, likes, views) VALUES
('safety', '안전 정보', '밤늦은 귀가 시 안전 수칙 5가지', '혼자 늦게 귀가할 때 반드시 지켜야 할 안전 수칙들을 정리해봤습니다.\n\n1. 밝고 사람이 많은 길로 다니기\n2. 이어폰 사용 자제하기\n3. 긴급 연락처 단축키 설정해두기\n4. 주변을 자주 확인하며 걷기\n5. 위험을 느끼면 즉시 112 신고', '안전이', 'A', 127, 856),
('tip', '생활 팁', '스마트폰 위급상황 단축키 설정하기', '위험한 상황에서 빠르게 대응할 수 있는 스마트폰 단축키 설정 방법을 공유합니다.\n\n【iPhone 사용자】\n측면 버튼 5번 연속 누르기로 긴급 SOS 활성화\n\n【Android 사용자】\n전원 버튼 3번 누르기로 긴급 연락처 전송', '테크리더', 'B', 94, 542),
('story', '경험 공유', '위급 상황에서 앱이 도움이 되었던 경험', '어제 밤 귀가길에 실제로 위급한 상황이 있었는데, 이 앱 덕분에 큰 도움을 받았습니다.\n\n늦은 밤 지하철역에서 집까지 걸어가는데 누가 계속 따라오는 것 같은 느낌이 들었어요.', '감사해요', 'C', 342, 1243);

INSERT INTO comments (post_id, author, avatar, content) VALUES
(1, '감사', 'G', '유용한 정보 감사합니다!'),
(1, '안심', 'H', '저도 항상 이렇게 하고 있어요.'),
(2, '유용', 'I', '몰랐던 기능이네요!');

INSERT INTO notifications (type, title, content, device_id, device_name) VALUES
('warning', '침입 감지', '거실 창문 센서에서 비정상적인 움직임이 감지되었습니다.', 'WIN-001', '거실 창문 센서'),
('warning', '음성 감지', '현관 음성 녹음 장치에서 의심스러운 소리가 감지되었습니다.', 'VOI-002', '현관 음성 녹음 장치'),
('info', '기기 연결', '작은방 창문 센서가 정상적으로 연결되었습니다.', 'WIN-003', '작은방 창문 센서');
