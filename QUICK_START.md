# TravelBuddy - 빠른 시작 가이드

## 🚀 5분 안에 시작하기

### 1단계: 환경 설정 (1분)

```bash
cd /Users/user/Documents/GitHub/travelBuddy
cp .env.example .env
```

`.env` 파일 열고 Firebase 설정 붙여넣기:
```
VITE_FIREBASE_API_KEY=YOUR_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
...
```

### 2단계: 의존성 설치 (2분)

```bash
npm install
```

### 3단계: 개발 서버 실행 (1분)

```bash
npm run dev
```

브라우저: http://localhost:5173

---

## 🧪 로컬 테스트 (10분)

### 테스트 A: 위치 권한 허용

1. 시크릿 모드로 http://localhost:5173 열기
2. Google 로그인
3. 위치 권한 **"허용"** 클릭
4. Map 페이지 → 내 위치 확인 (빨간 마커)

### 테스트 B: 위치 권한 거부 + 도시 검색

1. 새 시크릿 창으로 http://localhost:5173 열기
2. 다른 계정으로 로그인
3. 위치 권한 **"차단"** 클릭
4. 검색창에 "Seoul" 입력 → 결과 클릭 → "이 위치로 설정"

### 테스트 C: 친구/FOF 마커

**Firestore Console에서:**

User A:
```json
{
  "friends": ["USER_B_ID"],
  "geo": { "lat": 37.5665, "lng": 126.978 }
}
```

User B:
```json
{
  "friends": ["USER_A_ID", "USER_C_ID"],
  "geo": { "lat": 37.5700, "lng": 126.980 }
}
```

User C (2촌):
```json
{
  "friends": ["USER_B_ID"],
  "geo": { "lat": 37.5650, "lng": 126.985 }
}
```

User A로 로그인 → Map:
- User B: 파란 마커 (1촌)
- User C: 녹/회/빨 마커 (2촌, trust score 따라)

---

## 🚀 Firebase 배포 (5분)

### 1. Firebase 로그인
```bash
firebase login
```

### 2. 프로덕션 환경변수
```bash
cp .env.production .env.production.local
```

`.env.production.local` 수정:
```
VITE_FIREBASE_API_KEY=YOUR_PROD_KEY
VITE_APP_URL=https://YOUR_PROJECT.web.app
```

### 3. 빌드 & 배포
```bash
npm run build
firebase deploy --only hosting
```

**배포 완료!**
URL: https://YOUR_PROJECT.web.app

---

## ✅ 배포 후 테스트 (5분)

https://YOUR_PROJECT.web.app 접속:

1. [ ] Google 로그인 작동
2. [ ] 위치 권한 허용 → GPS 마커 표시
3. [ ] 위치 권한 거부 → 도시 검색 작동
4. [ ] 1촌 마커 (파란색) 표시
5. [ ] 2촌 마커 (trust score 색상) 표시
6. [ ] Popup 클릭 → 정보 확인

---

## 🔧 문제 해결

### 지도 안 보임?
```bash
# index.html에 Leaflet CSS 확인
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
```

### Firestore 데이터 안 불러와짐?
Firebase Console > Firestore > Rules:
```javascript
match /User/{userId} {
  allow read: if request.auth != null;
}
```

### 빌드 에러?
```bash
rm -rf node_modules dist
npm install
npm run build
```

---

## 📚 상세 가이드

전체 문서: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

**준비 완료!** 🎉
