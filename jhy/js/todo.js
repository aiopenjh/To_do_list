/*
 * TODO 프로젝트 공부용 주석 버전
 * 큰 흐름: 사용자가 입력 → add() → items 배열 변경 → save() → render()로 화면 갱신.
 * 새로고침하면 render()가 localStorage에서 저장한 데이터를 다시 가져온다.
 * 원본의 등록/삭제 동작은 유지했고, 아직 구현되지 않은 수정 버튼은 그대로 남겨뒀다.
 */
const todo = {
    // TODO 여러 개를 담는 배열. TODO 하나는 uid/date/title/content를 가진 객체다.
    items: [],
    // HTML에 있는 카드 설계도(#tpl)를 처음 한 번만 가져와 보관하려는 공간이다.
    tpl: null,

    // 1) 등록: Form에서 전달받은 세 값을 하나의 TODO 객체로 묶어 배열에 넣는다.
    add(date, title, content) {
        this.items.push({ // push()는 배열의 맨 뒤에 항목을 추가한다. this는 여기서는 todo 객체다.
            uid: Date.now(), // 삭제할 때 구별하려고 ID를 만든다. 같은 밀리초면 겹칠 수 있다.
            date,            // date: date의 축약 표기다.
            title,
            content
        });
        this.save();   // 배열만 바꾸면 새로고침 때 날아갈 수 있으니 브라우저에 저장한다.
        this.render(); // 저장한 최신 목록을 다시 화면에 그린다.
    },

    // 2) 삭제: 버튼에 들어 있는 uid로 정확히 어떤 TODO를 지울지 찾는다.
    remove(uid) {
        // findIndex()는 조건에 맞는 첫 항목의 배열 위치를 돌려준다. 없으면 -1이다.
        // x는 검사 중인 TODO 객체. dataset에서 온 uid는 문자열이라 Number()로 숫자로 바꾼다.
        const index = this.items.findIndex(x => x.uid === Number(uid));
        if (index === -1) return; // 못 찾았으면 아래 삭제 코드를 실행하지 않는다.
        this.items.splice(index, 1); // 찾은 위치에서 딱 한 개 삭제한다. 기존 배열이 바뀐다.
        this.save();   // 삭제 결과를 저장하지 않으면 새로고침 후 다시 나타날 수 있다.
        this.render(); // 삭제된 결과로 화면을 다시 만든다.
    },

    // 3) 저장: JavaScript 배열 → JSON 문자열 → localStorage.
    save() {
        // setItem(이름표, 저장할 문자열). JSON.stringify()가 배열을 JSON 문자열로 만든다.
        localStorage.setItem("todos", JSON.stringify(this.items));
    },

    // 4) 카드 설계도: HTML의 <script id="tpl"> 안에 있는 템플릿을 읽는다.
    getTpl() {
        if (!this.tpl) { // 아직 가져온 적이 없다면 딱 한 번 읽어서 보관한다(캐싱).
            this.tpl = document.getElementById("tpl").innerHTML;
        }
        return this.tpl; // 템플릿 문자열을 render() 쪽에 전달한다.
    },

    // 5) 출력: 저장된 데이터 읽기 → 카드 만들기 → 화면에 넣기 → 삭제 이벤트 연결.
    render() {
        const tmp = localStorage.getItem("todos"); // 저장된 값은 문자열, 없으면 null이다.
        // 삼항 연산자: 문자열이면 JSON.parse()로 배열 복구, 아니면 빈 배열로 시작한다.
        this.items = typeof tmp === "string" ? JSON.parse(tmp) : [];
        const targetEl = document.getElementById("todo-items"); // 카드들을 넣을 <ul>을 찾는다.

        if (this.items.length === 0) { // 배열에 TODO가 없다면 안내 문구만 보여준다.
            targetEl.innerHTML = "<li>할일을 등록하세요...</li>";
            return; // 더 만들 카드가 없으니 여기서 render()를 끝낸다.
        }

        let html = ""; // 반복하면서 만든 카드 HTML을 하나로 모을 빈 문자열이다.
        // for...of로 TODO 객체를 하나씩 꺼내고, 구조 분해로 필요한 속성만 바로 받는다.
        for (const { uid, date, title, content } of this.items) {
            let tpl = this.getTpl(); // 원본 카드 설계도를 가져온다.
            // replace()로 설계도의 ${...} 글자를 실제 데이터로 바꾼다.
            // 정규식의 g는 해당 문구가 여러 번 있어도 전부 교체하라는 뜻이다.
            tpl = tpl.replace(/\$\{title\}/g, title)
                     .replace(/\$\{content\}/g, content)
                     .replace(/\$\{date\}/g, date)
                     .replace(/\$\{uid\}/g, uid);
            html += tpl; // 완성된 카드 하나를 뒤에 이어 붙인다.
        }
        targetEl.innerHTML = html; // 문자열을 HTML로 해석해 화면에 넣는다.
        // 보안 주의: 사용자 입력을 innerHTML에 바로 넣으면 XSS 위험이 있다.
        // 원본 학습용 흐름은 유지했지만 실제 서비스라면 textContent 등으로 안전하게 출력해야 한다.

        // 카드가 화면에 생성된 다음, 각 삭제 버튼에 클릭 이벤트를 연결한다.
        const removeAction = (e) => { // e는 클릭 이벤트 정보를 담은 객체다.
            if (!confirm("정말 삭제하겠습니까?")) return; // 취소하면 아무것도 지우지 않는다.
            const el = e.currentTarget; // 실제로 이벤트를 등록한 삭제 버튼이다.
            const { uid } = el.dataset; // data-uid="101" → 문자열 "101"을 꺼낸다.
            this.remove(uid); // 이 ID에 해당하는 TODO만 삭제한다.
        };
        const deleteActions = document.getElementsByClassName("delete-action");
        for (const action of deleteActions) {
            // 원본에 있던 removeEventListener는 여기서는 실질적으로 필요하지 않다.
            // innerHTML로 버튼이 새로 만들어지고 removeAction 함수도 매번 새로 만들어지기 때문이다.
            action.removeEventListener("click", removeAction);
            action.addEventListener("click", removeAction); // 클릭 시 removeAction 실행 예약.
        }
        // HTML의 '수정' 버튼은 보이지만, 원본 JS에는 수정 이벤트가 아직 없다.
    }
};

// HTML을 끝까지 읽고 DOM 트리가 준비된 뒤에 아래 함수를 실행한다.
// todo.js가 <head>에 있어도 이 시점에는 Form과 #todo-items를 찾을 수 있다.
window.addEventListener("DOMContentLoaded", function() {
    const frmTodo = document.forms["frmTodo"]; // name="frmTodo"인 Form을 명시적으로 찾는다.
    todo.render(); // 새로고침/첫 방문 때 저장된 TODO가 있다면 화면에 다시 표시한다.

    // 등록 버튼(type="submit")을 누르면 Form에서 submit 이벤트가 발생한다.
    frmTodo.addEventListener("submit", function(e) {
        e.preventDefault(); // 브라우저의 기본 Form 제출(페이지 이동/새로고침)을 막는다.
        // 검사할 입력 항목 이름과 비어 있을 때 보여줄 안내 문구를 객체로 묶었다.
        const requiredFields = {
            date: "날짜를 선택하세요.",
            title: "할일 제목을 입력하세요.",
            content: "할일 내용을 입력하세요."
        };
        try {
            // Object.entries()는 객체를 [키, 값] 쌍들의 배열로 만든다.
            // [key, msg]는 구조 분해 할당. 매 반복마다 항목 이름과 메시지를 받는다.
            for (const [key, msg] of Object.entries(requiredFields)) {
                // 대괄호는 변수 key에 든 이름으로 접근한다. ?.는 값이 없을 때 안전하게 멈춘다.
                // trim()은 앞뒤 공백 제거. !는 결과가 비어 있으면 참이 되도록 뒤집는다.
                if (!frmTodo[key]?.value?.trim()) {
                    throw new Error(msg); // 비어 있으면 오류를 만들어 catch로 보낸다.
                }
            }
            // 검사 통과! Form에서 읽은 실제 값을 add()의 매개변수에 순서대로 전달한다.
            todo.add(
                frmTodo.date.value.trim(),
                frmTodo.title.value.trim(),
                frmTodo.content.value.trim()
            );
            // 등록했으니 입력창을 비우고 제목 칸에 커서를 둔다.
            frmTodo.date.value = "";
            frmTodo.title.value = "";
            frmTodo.content.value = "";
            frmTodo.title.focus();
        } catch (err) {
            console.error(err); // 개발자 도구에서 원인 확인용.
            alert(err.message); // 사용자에게 어떤 항목이 비었는지 알려준다.
        }
    });
});
