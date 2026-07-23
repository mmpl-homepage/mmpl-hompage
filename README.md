# 연구실 홈페이지

정적 웹사이트(HTML/CSS/JS)로 만든 연구실 홈페이지입니다. 구성원, 논문/실적, 공지사항은 코드가 아니라 `data/` 폴더의 JSON 파일로 관리되며, 파일만 수정하면 화면에 자동 반영됩니다.

기획 배경과 단계별 구현 계획은 [PRD.md](../PRD.md)를 참고하세요.

## 폴더 구조

```
연구실홈페이지/
├── index.html          # 소개
├── research.html       # 연구 분야
├── members.html        # 구성원
├── publications.html   # 논문/실적
├── news.html           # 공지사항
├── contact.html        # 연락처
├── css/style.css
├── js/
│   ├── common.js       # 공통 유틸(데이터 로드, 유효성 검사 등)
│   ├── members.js
│   ├── publications.js
│   └── news.js
├── data/
│   ├── members.json
│   ├── publications.json
│   ├── news.json
│   └── README.md      # 데이터 작성 가이드 (비개발자용)
└── .nojekyll
```

## 로컬에서 확인하기

브라우저가 `fetch`로 JSON 파일을 읽어오므로, `index.html`을 파일로 직접 열면 브라우저 보안 정책 때문에 데이터가 로드되지 않습니다. 반드시 로컬 웹 서버로 열어야 합니다. 예:

```bash
npx serve .
```

또는 Python이 설치되어 있다면:

```bash
python -m http.server 5173
```

이후 `http://localhost:5173`으로 접속합니다.

## GitHub Pages로 배포하기

1. 이 폴더(`연구실홈페이지/`)를 저장소 루트로 하여 GitHub 저장소를 새로 만듭니다.
2. 로컬에서 이 폴더로 이동해 git 저장소를 초기화하고 커밋합니다.
   ```bash
   git init
   git add .
   git commit -m "연구실 홈페이지 초기 버전"
   git branch -M main
   git remote add origin <저장소 URL>
   git push -u origin main
   ```
3. GitHub 저장소 페이지에서 **Settings → Pages**로 이동합니다.
4. **Source**를 "Deploy from a branch"로 설정하고, 브랜치는 `main`, 폴더는 `/(root)`를 선택한 뒤 저장합니다.
5. 잠시 후 `https://<사용자명>.github.io/<저장소명>/` 주소로 홈페이지가 공개됩니다.
   저장소 이름이 `<사용자명>.github.io` 형식이 아닌 이상 반드시 뒤에 `/<저장소명>/` 경로가 붙습니다. 이 경로를 빼고 접속하면 "Site not found" 404가 뜨니 주의하세요.

빌드 도구나 별도 배포 워크플로 없이도 정적 파일이 그대로 서비스되므로 위 과정만으로 충분합니다.

### 현재 배포 주소

- 저장소: https://github.com/mmpl-homepage/mmpl-hompage
- 라이브 사이트: **https://mmpl-homepage.github.io/mmpl-hompage/**
