# TravelBuddy - 배포 및 테스트 가이드

## 📋 목차
1. [로컬 환경 설정](#로컬-환경-설정)
2. [로컬 테스트 방법](#로컬-테스트-방법)
3. [Firebase Hosting 배포](#firebase-hosting-배포)
4. [배포 후 기능 테스트](#배포-후-기능-테스트)

---

## 🔧 로컬 환경 설정

### 1. 환경 변수 설정

`.env.example`을 복사하여 `.env` 파일 생성:

```bash
cp .env.example .env
```

`.env` 파일을 열고 Firebase 설정 값 입력:

```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
VITE_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
```

**Firebase 설정 값 찾는 방법:**
1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 프로젝트 선택
3. 프로젝트 설정 > 일반 > 내 앱 > 웹 앱 설정 확인

### 2. 의존성 설치

```bash
cd /Users/user/Documents/GitHub/travelBuddy
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:5173 접속

---

## 🧪 로컬 테스트 방법

### 테스트 1: 기본 로그인 및 위치 설정

#### A. 위치 권한 허용 테스트

1. **브라우저 시크릿 모드** 열기 (Chrome: Cmd+Shift+N)
2. http://localhost:5173 접속
3. Google 계정으로 로그인
4. 위치 권한 요청 시 **"허용"** 클릭
5. **확인 사항:**
   - Map 페이지로 이동
   - 내 위치(빨간 테두리 프로필 마커)가 실제 GPS 좌표에 표시되는지 확인
   - 브라우저 콘솔에서 "Location updated successfully" 로그 확인

#### B. 위치 권한 거부 테스트

1. **새 시크릿 창** 열기
2. http://localhost:5173 접속
3. 다른 Google 계정으로 로그인
4. 위치 권한 요청 시 **"차단"** 클릭
5. **확인 사항:**
   - 노란색 경고창: "위치를 직접 선택하거나 도시를 검색해주세요" 표시
   - 검색창에 도시 입력 (예: "Seoul, South Korea")
   - 검색 결과 클릭 → "이 위치로 설정" 버튼 클릭
   - 지도가 해당 위치로 이동하는지 확인
   - Firestore에서 해당 user 문서의 `geo.cityName` 필드 확인

### 테스트 2: 친구 관계 및 FOF 계산

#### Firestore에서 친구 관계 설정

Firebase Console > Firestore Database에서:

**User A (계정1):**
```json
{
  "friends": ["USER_B_ID", "USER_C_ID"],
  "geo": { "lat": 37.5665, "lng": 126.978, "cityName": "Seoul" }
}
```

**User B (계정2):**
```json
{
  "friends": ["USER_A_ID", "USER_D_ID"],
  "geo": { "lat": 37.5700, "lng": 126.980 }
}
```

**User C:**
```json
{
  "friends": ["USER_A_ID"],
  "geo": { "lat": 37.5600, "lng": 126.975 }
}
```

**User D (2촌):**
```json
{
  "friends": ["USER_B_ID"],
  "geo": { "lat": 37.5650, "lng": 126.985 }
}
```

#### 확인 사항

1. **User A로 로그인 후 Map 페이지:**
   - User B, C: 파란색 테두리 (1촌)
   - User D: 녹색/회색/빨강 테두리 (2촌, trust score에 따라)
   - 각 마커의 3km 반경 원이 표시되는지 확인

2. **Popup 클릭:**
   - 1촌: "1촌 친구" 표시
   - 2촌: "2촌 친구", "공통 친구 1명", trust label 표시
   - cityName이 있으면 도시 이름 표시

### 테스트 3: Trust Score 시스템

#### Firestore에 Trust Reaction 추가

`trust_reactions` 컬렉션에 문서 추가:

**문서 ID:** `USER_A_ID_USER_D_ID`
```json
{
  "from": "USER_A_ID",
  "to": "USER_D_ID",
  "reaction": "thumbs_up",
  "updatedAt": "현재시간"
}
```

**문서 ID:** `USER_B_ID_USER_D_ID`
```json
{
  "from": "USER_B_ID",
  "to": "USER_D_ID",
  "reaction": "thumbs_down",
  "updatedAt": "현재시간"
}
```

#### 확인 사항

1. User A로 로그인
2. Map 페이지에서 User D 마커 색상 확인
3. Popup 클릭 → trust label 확인:
   - thumbs_up > thumbs_down → 녹색
   - thumbs_down > thumbs_up → 빨강
   - 평가 없음 → 회색

---

## 🚀 Firebase Hosting 배포

### 1. Firebase CLI 설치 (처음 한 번만)

```bash
npm install -g firebase-tools
```

### 2. Firebase 로그인

```bash
firebase login
```

### 3. 프로덕션 환경변수 설정

`.env.production` 파일 수정:

```env
VITE_FIREBASE_API_KEY=YOUR_PRODUCTION_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
VITE_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
VITE_APP_URL=https://YOUR_PROJECT.web.app
```

### 4. 빌드

```bash
npm run build
```

**빌드 성공 확인:**
- `dist` 폴더 생성됨
- `dist/index.html` 파일 존재
- `dist/assets/*.js`, `*.css` 파일들 존재

### 5. 배포

```bash
firebase deploy --only hosting
```

**배포 성공 메시지:**
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/YOUR_PROJECT/overview
Hosting URL: https://YOUR_PROJECT.web.app
```

---

## ✅ 배포 후 기능 테스트 체크리스트

### 1. HTTPS 환경에서 Geolocation 테스트

배포된 URL (https://YOUR_PROJECT.web.app) 접속:

- [ ] Google 로그인 정상 작동
- [ ] 위치 권한 요청 팝업 표시
- [ ] 위치 허용 시 GPS 좌표로 지도 표시
- [ ] 위치 거부 시 도시 검색 기능 작동

**중요:** HTTP(localhost)와 달리 HTTPS에서만 Geolocation API가 정상 작동합니다.

### 2. 지도 기능 테스트

- [ ] Leaflet 지도 정상 렌더링
- [ ] 프로필 이미지 마커 표시
- [ ] 1촌/2촌 마커 색상 구분
- [ ] 3km 반경 원 표시
- [ ] 마커 클릭 시 Popup 표시
- [ ] Popup에 올바른 정보 표시 (이름, 관계, trust label, 도시명)

### 3. 도시 검색 기능 테스트

- [ ] 검색창에 "Tokyo, Japan" 입력
- [ ] Nominatim API 검색 결과 표시
- [ ] 결과 클릭 시 지도 이동
- [ ] "이 위치로 설정" 버튼 클릭 시 Firestore 업데이트
- [ ] 페이지 새로고침 후 저장된 위치로 지도 표시

### 4. 다중 계정 테스트

**두 개의 브라우저 사용 (Chrome + Safari):**

**Browser 1 (User A):**
1. 로그인
2. 위치 설정 (Seoul)
3. Firestore에서 User B를 friends에 추가
4. Map 페이지 새로고침

**Browser 2 (User B):**
1. 로그인
2. 위치 설정 (Tokyo)
3. Firestore에서 User A를 friends에 추가

**Browser 1에서 확인:**
- [ ] User B의 마커가 Tokyo 위치에 표시
- [ ] 파란색 테두리 (1촌)
- [ ] Popup에 "1촌 친구" 표시

### 5. Trust Score 업데이트 테스트

Firestore Console에서:

1. `trust_reactions` 컬렉션에 문서 추가
2. 문서 ID: `USER_A_ID_USER_D_ID`
3. Data:
   ```json
   {
     "from": "USER_A_ID",
     "to": "USER_D_ID",
     "reaction": "thumbs_up",
     "updatedAt": "2025-01-15T00:00:00Z"
   }
   ```

**Browser에서 확인:**
- [ ] Map 페이지 새로고침
- [ ] User D 마커 색상 변경 확인
- [ ] Popup에 trust label 변경 확인

---

## 🔧 문제 해결 (Troubleshooting)

### 문제 1: 위치 권한이 작동하지 않음

**원인:** HTTP 환경에서는 Geolocation API가 제한됨

**해결:**
- Firebase Hosting에 배포 (HTTPS 자동 제공)
- 또는 localhost에서 테스트 (Chrome은 localhost를 secure context로 인정)

### 문제 2: 지도가 표시되지 않음

**확인 사항:**
- [ ] Leaflet CSS가 index.html에 포함되어 있는지 확인
- [ ] 브라우저 ��솔에서 에러 메시지 확인
- [ ] 네트워크 탭에서 tile 이미지 로딩 확인

**해결:**
```html
<!-- index.html -->
<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
  integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
  crossorigin=""
/>
```

### 문제 3: Firestore 데이터를 불러오지 못함

**확인 사항:**
- [ ] Firebase Console > Firestore Database > Rules 확인
- [ ] 읽기 권한이 있는지 확인

**Firestore Rules 예시:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /User/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /trust_reactions/{reactionId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null;
    }
  }
}
```

### 문제 4: 빌드 에러

**TypeScript 에러:**
```bash
npm run build -- --mode production
```

**Module not found 에러:**
```bash
rm -rf node_modules
npm install
npm run build
```

---

## 📊 성능 최적화 (선택사항)

### 1. 이미지 최적화

프로필 이미지를 WebP로 변환하여 Storage에 업로드

### 2. Firestore 인덱스 생성

Firebase Console > Firestore > Indexes에서:
- `trust_reactions` 컬렉션: `to`, `from` 필드 인덱스 생성

### 3. 캐싱 전략

firebase.json에 이미 설정되어 있음:
- 이미지: 1년 캐시
- JS/CSS: 1년 캐시

---

## 🎯 최종 체크리스트

배포 전:
- [ ] `.env.production` 파일 설정 완료
- [ ] `npm run build` 성공
- [ ] `dist` 폴더 생성 확인

배포 후:
- [ ] https://YOUR_PROJECT.web.app 접속 가능
- [ ] Google 로그인 작동
- [ ] 위치 권한 허용/거부 모두 테스트
- [ ] 1촌/2촌 마커 표시 확인
- [ ] Trust score 색상 반영 확인

---

## 📞 지원

문제가 발생하면 다음을 확인하세요:

1. **브라우저 콘솔 (F12)**: JavaScript 에러 확인
2. **Network 탭**: API 호출 실패 확인
3. **Firebase Console**: Firestore 데이터 확인
4. **Firebase Hosting 로그**: 배포 로그 확인

---

**배포 완료!** 🎉
