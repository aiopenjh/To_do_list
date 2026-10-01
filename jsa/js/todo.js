const todo = {
    items: [], // 할 일 목록
    tpl: null,
    editUid: null, // 수정 중인 할 일의 uid (null이면 등록 모드)
    cancelBtn: null, // 수정 모드에서만 나타나는 취소 버튼
    add(date, title, content) { // 할 일 등록
        
        this.items.push({
            uid: Date.now(),
            date,
            title,
            content
        });

        this.save(); // 저장 처리
        this.render(); // 할 일 등록 후 화면 갱신
    },
    update(uid, date, title, content) { // 할 일 수정
        const item = this.items.find(x => x.uid === Number(uid));
        if (!item) return;

        item.date = date;
        item.title = title;
        item.content = content;

        this.save(); // 저장 처리
        this.render(); // 할 일 수정 후 화면 갱신
    },
    remove(uid) { // 할 일 제거
        
        const index = this.items.findIndex(x => x.uid === Number(uid));
        if (index === -1) return;
        
        this.items.splice(index, 1);

        // 수정 중이던 할 일을 삭제하면 수정 모드도 종료
        if (this.editUid === Number(uid)) {
            this.resetForm();
        }

        this.save(); // 저장 처리

        this.render(); // 할 일 제거 후 화면 갱신
    },
    startEdit(uid) { // 수정 모드 시작: 선택한 할 일을 양식에 채우기
        const item = this.items.find(x => x.uid === Number(uid));
        if (!item) return;

        this.editUid = item.uid;

        frmTodo.date.value = item.date;
        frmTodo.title.value = item.title;
        frmTodo.content.value = item.content;

        this.updateFormMode();

        // 목록이 길어도 양식이 보이도록 위로 이동
        frmTodo.scrollIntoView({ behavior: "smooth", block: "start" });
        frmTodo.title.focus({ preventScroll: true });
    },
    resetForm() { // 입력 내용 비우고 등록 모드로 되돌리기
        this.editUid = null;

        frmTodo.date.value = "";
        frmTodo.title.value = "";
        frmTodo.content.value = "";

        this.updateFormMode();
    },
    updateFormMode() { // 등록/수정 모드에 맞게 버튼과 강조 표시 변경
        const isEditing = this.editUid !== null;

        // 제출 버튼 문구 변경
        const submitBtn = frmTodo.querySelector('button[type="submit"]');
        submitBtn.textContent = isEditing ? "수정하기" : "등록하기";

        // 취소 버튼: 수정 모드일 때만 제출 버튼 아래에 추가
        if (isEditing && !this.cancelBtn) {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.textContent = "취소";
            btn.className = "bg-gray-400 hover:bg-gray-700 py-2 px-5 mt-2 rounded-sm text-white text-lg block mx-auto cursor-pointer max-w-xs w-1/2";
            btn.addEventListener("click", () => {
                this.resetForm();
                frmTodo.title.focus();
            });
            submitBtn.after(btn);
            this.cancelBtn = btn;
        } else if (!isEditing && this.cancelBtn) {
            this.cancelBtn.remove();
            this.cancelBtn = null;
        }

        // 수정 중인 할 일 강조 표시
        const lis = document.querySelectorAll("#todo-items > li");
        for (const li of lis) {
            const isTarget = isEditing && li.id === `item-${this.editUid}`;
            li.classList.toggle("ring-2", isTarget);
            li.classList.toggle("ring-indigo-500", isTarget);
        }
    },
    save() { // 할 일 저장
        localStorage.setItem("todos", JSON.stringify(this.items));
    },
    getTpl() {
        if (!this.tpl) {
            this.tpl = document.getElementById("tpl").innerHTML;
        }

        return this.tpl;
    },
    render() { // 할 일 목록 출력
        const tmp = localStorage.getItem("todos");
        this.items = typeof tmp === 'string' ? JSON.parse(tmp) : [];
        const targetEl = document.getElementById("todo-items");

        if (this.items.length === 0) {
            targetEl.innerHTML = "<li>오늘 해야 할 일은 무엇인가요?</li>";
            return;
        }
       

        let html = "";
        for (const {uid, date, title, content} of this.items) {
            let tpl = this.getTpl();
            tpl = tpl.replace(/\$\{title\}/g, title)
                    .replace(/\$\{content\}/g, content)
                    .replace(/\$\{date\}/g, date)
                    .replace(/\$\{uid\}/g, uid);
            
            html += tpl;
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

        const editAction = (e) => {
            const el = e.currentTarget;
            const { uid } = el.dataset;
            this.startEdit(uid);
        };

        const editActions = document.getElementsByClassName("edit-action");
        for (const action of editActions) {
            action.removeEventListener("click", editAction);
            action.addEventListener("click", editAction);
        }

        // 목록을 다시 그린 뒤에도 수정 중인 항목 강조 유지
        this.updateFormMode();
    }   
};


window.addEventListener("DOMContentLoaded", function() {

    todo.render(); // 최초 로딩 시 이미 등록된 할 일 목록을 출력

    frmTodo.addEventListener("submit", function(e) {
        e.preventDefault(); // 양식의 기본 동작을 차단하여 양식에 제출되는 것 막기
        
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

            const date = frmTodo.date.value.trim();
            const title = frmTodo.title.value.trim();
            const content = frmTodo.content.value.trim();

            if (todo.editUid !== null) { // 수정 모드
                todo.update(todo.editUid, date, title, content);
            } else { // 등록 모드
                todo.add(date, title, content);
            }

            // 등록/수정이 완료 되면 입력 내용 비우고 등록 모드로 복귀
            todo.resetForm();
            frmTodo.title.focus();
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    });
});
