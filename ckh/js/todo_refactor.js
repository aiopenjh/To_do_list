const todo = {
    items: [],
    listEl: null,
    // [이벤트 루프 최적화 플래그] 
    // 동일 렌더링 프레임 내에 add, update 등의 호출이 여러 번 발생할 때
    // 중복으로 render()가 실행되는 것을 막기 위한 스로틀링(Throttling) 상태 플래그
    isRendering: false,

    init() {
        // [DOM 캐싱] 매번 document.getElementById로 검색하지 않고 초기 1회 캐싱하여 탐색 비용 절감
        this.listEl = document.getElementById("todo-items");
        
        // [5번 개선: I/O 병목 제거]
        // localStorage 동기(Synchronous) I/O와 JSON.parse는 비용이 크므로
        // render()마다 호출하던 기존 방식에서 탈피하여 앱 시작 시 단 1회만 메모리(items)로 로드함
        const saved = localStorage.getItem("todos");
        try {
            this.items = saved ? JSON.parse(saved) : [];
        } catch {
            this.items = [];
        }

        // [3번 개선: 이벤트 위임(Event Delegation) 및 메모리 누수 방지]
        // 기존 코드: render() 실행마다 개별 버튼에 새 클로저 함수로 이벤트 리스너를 계속 중복 등록함
        // 개선 코드: 부모 컨테이너(listEl)에 단 1번만 리스너를 바인딩하고,
        //           이벤트 버블링을 이용해 Element.closest()로 타깃 버튼을 감지함 (메모리 누수 원천 차단)
        this.listEl.addEventListener("click", (e) => {
            // 1. 삭제 버튼 클릭 감지
            const deleteBtn = e.target.closest(".delete-action");
            if (deleteBtn) {
                const uid = Number(deleteBtn.dataset.uid);
                if (confirm("정말 삭제하겠습니까?")) {
                    this.remove(uid);
                }
                return;
            }

            // 2. 수정 버튼 클릭 감지 (기존 누락되었던 1번 핵심 기능 구현)
            const editBtn = e.target.closest(".edit-action");
            if (editBtn) {
                const uid = Number(editBtn.dataset.uid);
                this.edit(uid);
            }
        });

        // 초기 화면 출력 스케줄링
        this.scheduleRender();
    },

    // 데이터 저장 전담 메서드 (I/O 작업 분리)
    save() {
        localStorage.setItem("todos", JSON.stringify(this.items));
    },

    add(date, title, content) {
        this.items.push({
            uid: Date.now(),
            date,
            title,
            content
        });
        this.save();
        // [렌더링 분리] 직접 DOM을 건드리지 않고 브라우저 렌더 주기에 위임
        this.scheduleRender();
    },

    remove(uid) {
        const index = this.items.findIndex(item => item.uid === uid);
        if (index === -1) return;

        this.items.splice(index, 1);
        this.save();
        this.scheduleRender();
    },

    // [1번 개선: 수정 기능] 데이터 모델을 변경하고 저장 및 렌더링 호출
    edit(uid) {
        const item = this.items.find(item => item.uid === uid);
        if (!item) return;

        const newTitle = prompt("수정할 제목을 입력하세요:", item.title);
        if (newTitle !== null && newTitle.trim()) {
            item.title = newTitle.trim();
            this.save();
            this.scheduleRender();
        }
    },

    // [이벤트 루프 & 브라우저 렌더 사이클 최적화: Batching]
    // Task 큐에서 상태가 여러 번 변경되더라도 브라우저의 다음 Repaint 직전(보통 16.6ms 주기)에
    // 단 한 번만 render()가 실행되도록 보장하여 불필요한 메인 스레드 렌더링 부하를 방지함
    scheduleRender() {
        if (this.isRendering) return; // 이미 실행 대기 중인 requestAnimationFrame이 있다면 중복 방지
        this.isRendering = true;

        requestAnimationFrame(() => {
            this.render();
            this.isRendering = false;
        });
    },

    render() {
        // 목록이 비었을 때의 방어 로직
        if (this.items.length === 0) {
            this.listEl.innerHTML = "<li>할일을 등록하세요...</li>";
            return;
        }

        // [DOM Manipulation 최적화 1: DocumentFragment 활용]
        // 반복문에서 DOM에 직접 요소를 추가하면 매번 Reflow(레이아웃 계산) 및 Repaint가 발생함
        // 메모리 상의 가상 컨테이너(DocumentFragment)에 먼저 트리를 완성한 뒤 
        // 실제 DOM에는 단 한 번만 마운트하여 리플로우 비용을 O(N)에서 O(1)로 단축
        const fragment = document.createDocumentFragment();

        for (const item of this.items) {
            const li = document.createElement("li");
            li.id = `item-${item.uid}`;
            li.className = "border border-gray-400 rounded-sm group p-4";

            // [보안 최적화: XSS 방어]
            // 기존 코드: innerHTML에 문자열 템플릿(replace)을 그대로 삽입하여 <script>나 onerror 공격에 취약함
            // 개선 코드: textContent 속성을 사용하여 입력값을 단순 문자열로만 안전하게 파싱함
            const titleBox = document.createElement("div");
            titleBox.className = "group-hover:shadow-md font-bold";
            titleBox.textContent = `[${item.date}] ${item.title}`;

            const contentBox = document.createElement("div");
            contentBox.className = "my-2 text-gray-700";
            contentBox.textContent = item.content;

            const btnWrapper = document.createElement("div");
            btnWrapper.className = "flex justify-between gap-1 mt-2";

            const delBtn = document.createElement("button");
            delBtn.type = "button";
            delBtn.className = "delete-action grow py-2 text-white bg-red-400 hover:bg-red-900 cursor-pointer rounded-sm";
            delBtn.dataset.uid = item.uid;
            delBtn.textContent = "삭제";

            const editBtn = document.createElement("button");
            editBtn.type = "button";
            editBtn.className = "edit-action grow py-2 text-white bg-indigo-400 hover:bg-indigo-900 cursor-pointer rounded-sm";
            editBtn.dataset.uid = item.uid;
            editBtn.textContent = "수정";

            btnWrapper.append(delBtn, editBtn);
            li.append(titleBox, contentBox, btnWrapper);
            fragment.appendChild(li); // 메모리 내 프래그먼트에 노드 추가
        }

        // [DOM Manipulation 최적화 2: replaceChildren 활용]
        // innerHTML = "" 후 다시 자식을 넣는 방식 대비,
        // 브라우저 네이티브 메서드로 기존 자식 노드를 안전하게 제거하고 fragment를 원자적(Atomic)으로 일괄 교체
        this.listEl.replaceChildren(fragment);
    }
};

window.addEventListener("DOMContentLoaded", () => {
    // 앱 초기화 구동 (이벤트 리스너 등록 및 데이터 1회 파싱)
    todo.init();

    frmTodo.addEventListener("submit", (e) => {
        e.preventDefault();

        const date = frmTodo.date.value.trim();
        const title = frmTodo.title.value.trim();
        const content = frmTodo.content.value.trim();

        if (!date || !title || !content) {
            alert("모든 필드를 입력해주세요.");
            return;
        }

        todo.add(date, title, content);
        
        // 폼 초기화 표준 메서드 활용 (각 필드를 일일이 빈값 대입하던 코드 단순화)
        frmTodo.reset();
        frmTodo.title.focus();
    });
});