#  TODO LIST 
- HTML : 사용자에게 보여줄 구조
- TailwindCSS : 디자인
- JavaScript : 기능  -> localStorage : 저장

# 웹개발 사고
사용자 -> HTML -> JavaScript -> items -> localStorage -> JavaScript -> HTML

# Tailwind - 디자인 담당
<!-- <ul
    id="todo-items"
    class="m-4 p-4 grid md:grid-cols-2 gap-4"
> --> -> 레이아웃 만드는데 관여
## todo.js - 행동 담당
등록 버튼을 누른다 -> TODO 추가
삭제 버튼을 누른다 -> TODO 삭제
새로고침한다 -> wjwkgoTejs TODO 다시 표시

<\html>
<\input type="text" name="title"> 
<-JavaScript 공부 입력 

-> <\JS> frmTodo.title.value를 통해 그 값을 가져감

## todo.js 덩어리
1. TODO 관리자
    const todo ={...} -> todo 객체


    데이터 관리
    추가
    삭제
    저장
    화면 출력

2. 이벤트 처리
    DOMContentLoaded
    submit

    사용자가 뭘 하면 위의 TODO rhksflwkfmf ghcnf

## todo 객체 - todo 관리와 관련된것들
const todo = {
    items: [],
    tpl: null,
    add(){}, remove(){}, save(){} , getTpl(){}, render(){}
}

- items/tple : property
- add(),remove(),save(), getTpl(), render() : Mothod

- add : 새 TODO 만들어 -> items에 넣어 -> 저장해 -> 화면 다시그려
- remove : 삭제할 TODO찾아 -> items에서 없애 -> 저장해 -> 화면 다시그려
- save : 현재 items -> 브라우저 저장소에 저장
- getTpl() : HTML에 있는 TODO카드 설계도 -> 가져오기
- render() : 현재 TODO데이터 -> 카드모양으로 변ㄴ환 -> HTML에 집어넣음 -> 사용자가 봄

**데이터변경 -> 저장 -> 화면 갱신**

## 새로고침 이후에도 남아있는 저장공간 - localStorage
localStorage.setItem(...)

JavsScript의 items의 작업 결과를 localStorage에 보관
items가 초기화 -> localStorage 열어봄 -> 저장해둔 TODO 발견 -> items로 다시 가져옴 -> render() ->화면에 다시 표시

## HTMl - tpl : 설계도
<!-- <script type="text/html" id="tpl">

    <li id="item-${uid}">

        <div>
            [${date}]${title}
        </div>

        <div>
            ${content}
        </div>

        <button>삭제</button>
        <button>수정</button>

    </li>

</script> -->
JS데이터 ( date / title / content) 가 들어오면 카드가 만들어진다


## HTML 덩어리
<\html>
    <\head>
        준비영역
        - style.css 연결
        - Tailwind 연결
        - todo.js 연결
<!-- <link
    rel="stylesheet"
    href="css/style.css" - 추가 css
>

<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script> - 디자인

<script src="js/todo.js"></script> - 기능 -->\ 
    <\/head>

    <\body>  - 실제 사용자가 만나는 공간
        제목
        <h1>할일을 등록하세요</h1> - 제목
        
 
        입력 Form - 사용자가 데이터를 작성해서 제출하는 하나의 묶음
        <form name = "frmTodo">
        
        - 날짜
        - 제목
        - 내용
        -------> 각각 따로있는 데이터 -> TODO하나에 대한 정보 -> 객체로묶자
        TODO 여러가지 -> Array -> items: []


        - 등록버튼

        TODO 출력 장소

        TODO template
    <\/body>
<\/html>

## index.html 실행 순서
index.html 실행
-> 브라우저가 페이지 준비 -> HTML 읽기 시작 -> HTML을 DOM으로 변환
-> JavaScript 실행 -> HTML을 끝까지 읽고 -> DOM 완서 -> DOMContentLoaded발생 
-> 등록한 함수 실행 -> render()

1. 최상위 객체인 window가 만들어짐
2. window 
    - document : HTML 문서 (JavaScript가 다룰수 있게 만든 객체 -DOM)
    - location : 주소와 관련된 객체
    - history : 방문기록 객체
    - navigator
    - screen
    - .....

## DOM!!
TODO를 화면에 출력하려면 JavaScript가 HTML의 이 부분을 찾아야한다
<!-- 
<ul id="todo-items"></ul> -->
-> Javascript에서 나중에 document.getElementById("todo-items")
-> document야 현재 HTML 문서에서 id가 "todo-items"인 Element를 찾아줘
-> 아직 브라우저가 HTML을 거까지 안읽었다면? Element가 DOM에 없을수 있다
-> **DOM이 언제 준비됐는가가 중요**
-> DOMContentLoaded : HTML을 읽고 DOM구조를 만드는 작업이 완료됐다
-> Event : 어떤 일이 발생했다는 신호 - DOMContentLoaded dkffuwna

window.addEventListener(
    "DOMContentLoaded",
    function() {

    } -> callback function : 지금 실행 x 특정 상황이 되었을 때 실행
);
 -> DOMContentLoaded가 발생하는지 기다렸다가 -> 발생 하면 지정한 일을 해줘

DOM Tree 완성 -> 브라우저 "DOMContentloaded" -> 등록되엇던 callback 발견
-> function(){...} 실행

## 페이지 시작
todo.render() <- todo 객체 안에 있는 render 메서드실행

페이지 실행-> DOM 완성-> DOMContentLoaded->
todo.render()-> localStorage 확인-> 저장된 TODO 가져오기-> 화면에 다시 그리기

render() {
    const tmp = localStorage.getItem("todos"); -> 저장된 todo가있는지 localStorage 확인후 

    this.items =
        typeof tmp === "string" 
            ? JSON.parse(tmp)
            : []; 
    const targetEl =
        document.getElementById("todo-items");

    // ...
}

## localStorage와 JSON
localStorage는 데이터를 이름과 값의 쌍으로 보관
얘한테 key가 todos 고 value가 [{"title":"운동"}]

저장시 :localStorage.setItem("todos", "운동");
가져올때 : const result = localStorage.getItem("todos");
삭제시 :localStorage.removeItem("todos");

- JSON.stringify()  : 데이터를 JSON문자열로 변환한다.
    const result = JSON.stringify(items);
    JavaScript 배열 -> JSON.stringify() -> JSON문자열 -> localStorage

- JSON.parse() : JSON문자열을 데이터로 변환
    const restored = JSON.parse(result);
    JSON문자열 -> JSON.parse() -> JavaScript 배열

## save() - 저장만 담당 화면 변경x
save() {
    localStorage.setItem(
        "todos",
        JSON.stringify(this.items) // this.items = > todo.items
    );
}
// save()가 todo의 매서드 <\todo.save();> -> 매서드 내부의 this는 todo를 가리킨다

 ## TODO 카드만들기
 this.items = [
    {
        uid: 101,
        date: "2026-10-01",
        title: "JavaScript 공부",
        content: "DOM 복습"
    },
    {
        uid: 102,
        date: "2026-10-02",
        title: "운동",
        content: "헬스장 가기"
    }
];
## RENDER의 화면생성 
render() { // 할일 목록을 출력
        const tmp = localStorage.getItem("todos");
        this.items = typeof tmp === 'string' ? JSON.parse(tmp) : []; 
        // 삼항연산자 : 조건?참일때값:거짓일때값
        const targetEl = document.getElementById("todo-items");
        // 화면에서 출력장소를 찾는다. -> targetEl을 통해 요소의 내용변경 가능

        //데이터를 배열로 복구


        if (this.items.length === 0) {
            targetEl.innerHTML = "<li>할일을 등록하세요...</li>";
            return;
        }
       // length는 배열의 항목개수 -> 0개라면 안내문구 출력 후 return으로 render 실행 끝냄

        let html = ""; // 빈문자열 만들기 -> TODO 카드 여러갤 하나의 HTML문자열로 모으기 위해

        //구조 분해 할당 + 반복문
        for (const {uid, date, title, content} of this.items) {
            let tpl = this.getTpl();
            tpl = tpl.replace(/\$\{title\}/g, title)
                    .replace(/\$\{content\}/g, content)
                    .replace(/\$\{date\}/g, date)
                    .replace(/\$\{uid\}/g, uid);
            
            //replace로 문자열치환으로 직접 처리
            
            html += tpl; // html = html + tpl; 카드추가


        }

        targetEl.innerHTML = html;

        // 삭제, 수정 버튼 클릭 처리 
        const removeAction = (e) => {
            if (!confirm('정말 삭제하겠습니까?')) return;

            const el = e.currentTarget;
            const { uid } = el.dataset;
            this.remove(uid);
        };

        const deleteActions = document.getElementsByClassName("delete-action");
        for (const action of deleteActions) {
            action.removeEventListener("click", removeAction);
            action.addEventListener("click", removeAction);
        }
    }
## 사용자 행동
    window.addEventListener("DOMContentLoaded", function() {

    todo.render(); // 최초 로딩시 이미 등록된 할일 목록을 출력

    frmTodo.addEventListener("submit", function(e) {
        e.preventDefault();
        // Form제출로 페이지가 이동하거나 새로고침 되는 동작 필요 x 
        
        const requiredFields = {
            date: "날짜를 선택하세요.",
            title: "할일 제목을 입력하세요.",
            content: "할일 내용을 입력하세요.",
        };
        try {
            for (const [key, msg] of Object.entries(requiredFields)) {
                if (!frmTodo[key]?.value?.trim()) {
                    throw new Error(msg);
                }
            }

        // Object.entries() : 객체를 [key, value]형태의 배열로 바꾼다.
        // [key,msg] : 배열 구조분해 할당 -> 세입력값을 하나의 반복문으로
        // frmTodo[key]  - 어떤 프로퍼티에 접근할지 실행중에 결정할 때 대괄호 표기
        // if (!frmTodo[key]?.value?.trim())  {throw new Error(msg);}
            - ?. : 선택적 연결 연산자 : 앞의 값이 null/undefined면 undefined를 반환
            - trim() : 문자열 양쪽의 공백을 제거
            - ! : 논리 부정 연산자 -> 입력값이 빈 문자열이라면 조건이 참이됨
            - throw new Error(msg)를 실행해 오류 발생
            - 오류는 catch에서 처리

        

            todo.add(
                frmTodo.date.value.trim(),
                frmTodo.title.value.trim(),
                frmTodo.content.value.trim()
            )
            // 실제 데이터 추가하기 <- 함수에 데이터를 전달
       


            // 등록이 완료 되면 입력내용을 비워준다.
            frmTodo.date.value = "";
            frmTodo.title.value = "";
            frmTodo.content.value = "";
            frmTodo.title.focus();
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    });
});