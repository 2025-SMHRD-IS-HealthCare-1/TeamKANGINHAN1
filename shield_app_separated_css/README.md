# SHIELD FOR HER - CSS 페이지별 분리 버전

각 페이지별로 CSS 파일이 분리된 버전입니다.

## 📁 파일 구조

```
shield_app_separated_css/
├── public/
│   ├── common.css         (4.0KB) - 공통 스타일 ★
│   ├── index.css          (2.4KB) - 메인 페이지 전용
│   ├── community.css      (2.7KB) - 커뮤니티 전용
│   ├── devices.css        (2.5KB) - 기기 등록 전용
│   ├── notifications.css  (2.6KB) - 알림 전용
│   ├── settings.css       (3.2KB) - 설정 전용
│   ├── signup.css         (1.8KB) - 회원가입 전용
│   └── new_post.css       (2.2KB) - 게시글 작성 전용
└── views/
    ├── index.html
    ├── community.html
    ├── devices.html
    ├── notifications.html
    ├── settings.html
    ├── signup.html
    └── new_post.html
```

## 🎨 CSS 파일 설명

### ⭐ common.css (공통 - 필수!)
**모든 페이지에서 사용되는 기본 스타일**
- 색상 변수
- 네비게이션
- 버튼
- 폼 요소
- 기본 리셋

### index.css (메인 페이지)
- 히어로 섹션
- 대시보드 카드
- 로그인 패널
- 카카오 로그인 버튼

### community.css (커뮤니티)
- 카테고리 탭
- 게시글 카드
- 새 게시글 버튼

### devices.css (기기 등록)
- 기기 등록 폼
- 등록된 기기 목록
- 삭제 버튼

### notifications.css (알림)
- 알림 아이템
- 타입 배지 (경고/정보/성공)
- 필터 버튼

### settings.css (설정)
- 키워드 리스트
- 키워드 추가/삭제

### signup.css (회원가입)
- 회원가입 폼
- 약관 동의

### new_post.css (게시글 작성)
- 게시글 작성 폼
- 작성 가이드

## 🔗 사용 방법

각 HTML 파일은 2개의 CSS를 로드합니다:

```html
<!-- 메인 페이지 -->
<link rel="stylesheet" href="/common.css">
<link rel="stylesheet" href="/index.css">

<!-- 커뮤니티 -->
<link rel="stylesheet" href="/common.css">
<link rel="stylesheet" href="/community.css">
```

**common.css는 필수! 모든 페이지에 포함되어야 합니다!** ⚠️

## 📦 전체 다운로드

[shield_app_separated_css.tar.gz 다운로드](computer:///mnt/user-data/outputs/shield_app_separated_css.tar.gz)
