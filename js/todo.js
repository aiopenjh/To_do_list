
const todo = {

    items: [], // 할일 목록
    tpl: null,
    add(date, title, content) { // 할일 등록
        
        this.items.push({
            uid: Date.now(),
            date,
            title,
            content
        });

        this.save(); //저장 처리
        this.render(); // 할일 등록 후 화면 갱신
    },
    remove(uid) { // 할일 제거
        
        const index = this.items.findIndex(x => x.uid === Number(uid));
        if (index === -1) return;
        
        this.items.splice(index, 1);

        this.save(); // 저장 처리

        this.render(); // 할일 제거 후 화면 갱신
    },
    save() { // 할일 저장
        localStorage.setItem("todos", JSON.stringify(this.items));
    },
    getTpl() {
        if (!this.tpl) {
            this.tpl = document.getElementById("tpl").innerHTML;
        }

        return this.tpl;
    },
    render() { // 할일 목록을 출력
        const tmp = localStorage.getItem("todos");
        this.items = typeof tmp === 'string' ? JSON.parse(tmp) : [];
        const targetEl = document.getElementById("todo-items");

        if (this.items.length === 0) {
            targetEl.innerHTML = "<li>할일을 등록하세요...</li>";
            return;
        }
       

        let html = "";
        for (const {uid, date, title, content} of this.items) {
            let tpl = this.getTpl();
            tpl = tpl.replace(/\$\{title\}/g, title)
                    .replace(/\$\{content\}/g, content)
                    .replace(/\$\{date\}/g, date)
                    .replace(/\$\{uid\}/g, uid);
            
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
    }   
};


window.addEventListener("DOMContentLoaded", function() {

    todo.render(); // 최초 로딩시 이미 등록된 할일 목록을 출력

    frmTodo.addEventListener("submit", function(e) {
        e.preventDefault(); // 양식의 기본동작을 차단하여 양식에 제출되는 것을 막는다.
        
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

            todo.add(
                frmTodo.date.value.trim(),
                frmTodo.title.value.trim(),
                frmTodo.content.value.trim()
            )

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