# 📋 Team Todo List & 학습 발표 프로젝트

본 저장소는 **팀원별 Todo List 구현 과제** 및 **수업 학습 내용 요약 발표**를 함께 공유하고 발표하기 위한 협업 공간입니다.

---

## 📌 프로젝트 개요

| 구분 | 내용 | 발표 시간 |
| :--- | :--- | :---: |
| **1. 학습 내용 요약 발표** | • 범위: **9/14 ~ 10/1** 학습 내용 (필수 포함)<br>• 그동안 학습한 핵심 개념과 전반적인 흐름 정리 | 30분 |
| **2. Todo 리스트 구현 과제** | • 팀별로 함께 기획/구상 후, **구현은 팀원 각자 개별 진행**<br>• 실력 향상을 위해 순수 개인 역량으로 구현 (AI 사용 지양) | 20~25분 |

---

## 🛠️ 기능 요건 & 기술 스택

### 1. 필수 기능 (CRUD)
- **할 일 등록 (Create)**: 새로운 할 일 입력 및 목록 추가
- **할 일 조회 (Read)**: 저장된 할 일 목록 화면 출력
- **할 일 수정 (Update)**: 완료 여부 토글(Check/Uncheck) 및 내용 수정
- **할 일 삭제 (Delete)**: 선택한 항목 목록에서 제거
- **DOM 조작**: 순수 JavaScript를 통한 요소 선택, 생성, 추가, 제거
- **데이터 보관 및 상태 유지**: 브라우저 `localStorage` 객체를 활용한 새로고침 후에도 유지되는 상태 관리

### 2. 스타일링
- **Tailwind CSS** 적용 (직관적이고 반응형 UI 구성)

---

## 📁 현재 디렉토리 및 파일 구조

```text
To_do_list/
├── README.md
├── cjh/
├── jsa/
├── sbc/
├── lym/
└── jhy/
```

각 개인 폴더에는 `index.html`, `css/style.css`, `js/todo.js`가 있습니다.
루트의 팀 메인 대문 `index.html`은 아직 작성되지 않았습니다.

---

## 👥 개인 작업 및 브랜치 반영 현황

2026-10-02 기준, 아래 모든 브랜치의 커밋이 `main`에 포함되어 있습니다.
병합 완료는 실행 테스트 완료를 의미하지 않습니다.

| 팀원명 | 하위 폴더 | 브랜치 | main 반영 상태 | 소스 바로가기 |
| :--- | :--- | :--- | :--- | :--- |
| cjh (최지훈) | `cjh/` | `Cjh_TDL` | 병합 완료 (`bb697f7`) | [HTML](./cjh/index.html) |
| jsa (조성아) | `jsa/` | `feature/jsa` | PR #2 병합 완료 | [HTML](./jsa/index.html) |
| sbc (선병철) | `sbc/` | `feature/sbc` | PR #1 병합 완료 | [HTML](./sbc/index.html) |
| lym (이영민) | `lym/` | `feature/이영민` | 병합 완료 (`bfc21e4`) | [HTML](./lym/index.html) |
| jhy (정학용) | `jhy/` | `hakyong` | 병합 완료 (`851fcb6` 포함) | [HTML](./jhy/index.html) |

팀원 식별자는 실제 하위 폴더명과 동일하게 표기합니다.
정학용님의 학습 정리는 [jhy/study.md](./jhy/study.md)에서 확인할 수 있습니다.
### PR 현황

- [PR #1: [SBC] Todo List 구현](https://github.com/aiopenjh/To_do_list/pull/1): `feature/sbc` → `main`, 병합 완료
- [PR #2: Feature/jsa](https://github.com/aiopenjh/To_do_list/pull/2): `feature/jsa` → `main`, 병합 완료
- 확인 시점에 열린 PR과 병합 없이 닫힌 PR은 없습니다.
- 두 PR 모두 리뷰·댓글·자동 검사 기록이 없으며, GitHub Actions 실행 기록도 없습니다.

### 개인 결과물 실행

저장소를 복제한 뒤 각 개인 폴더의 `index.html`을 브라우저에서 열어 확인합니다.
위 HTML 링크는 GitHub의 소스 파일 링크입니다.
Tailwind CSS 및 일부 화면의 flatpickr는 CDN을 사용하므로 인터넷 연결이 필요합니다.

---
## 🎤 발표 방식 & 안내

1. **팀별 대문(랜딩) 페이지 제작 (예정)**
   - 루트 경로의 `index.html`에 팀 소개 및 팀원별 작업물 링크를 연결합니다.
2. **발표 진행**
   - 현재는 각 개인 폴더의 `index.html`을 직접 열어 발표합니다. 메인 랜딩 페이지 제작 후에는 팀원별 링크로 연결합니다.
   - 각 팀원이 직접 구현한 기능(CRUD, localStorage 연동, UI 구성 등)을 본인이 직접 시연하고 설명합니다.

---

## 🚀 시작하기 (Git 협업 규칙)

### 저장소 복제 (Clone)
```bash
git clone https://github.com/aiopenjh/To_do_list.git
cd To_do_list
```

### 브랜치 생성 및 작업
```bash
# 본인 이름의 브랜치 생성 후 이동
git checkout -b feature/[본인이름]

# 작업 완료 후 커밋 & 푸시
git add .
git commit -m "feat: [본인이름] Todo List 구현"
git push origin feature/[본인이름]
```
