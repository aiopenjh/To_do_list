
const todo = {
    items: [],
    tpl: null,
    add(date, title, content) {
        this.items.push({
            uid: Date.now(),
            date,
            title,
            content,
        })

        this.save();
        this.render();
    },
    update(uid, changes) {
        const item = this.items.find(x => x.uid === Number(uid));

        if (!item) {
            throw new Error('수정할 항목을 찾을 수 없습니다.');
        }

        for (const key of ['date', 'title', 'content']) {
            if (Object.hasOwn(changes, key)) {
                item[key] = changes[key];
            }
        }

        this.save();
        this.render();
    },

    remove(uid) {

        const index = this.items.findIndex(x => x.uid === Number(uid));

        if (index === -1) {
            return
        }

        this.items.splice(index, 1);

        this.save();
        this.render();
    },

    save() {
        localStorage.setItem('todos', JSON.stringify(this.items));
    },

    getTpl() {
        if (!this.tpl) {
            this.tpl = document.getElementById('tpl').innerHTML;
        }

        return this.tpl;
    },


    render() {
        const tmp = localStorage.getItem('todos');

        this.items = typeof tmp === 'string' ? JSON.parse(tmp) : [];

        this.items.sort((a, b) => a.date.localeCompare(b.date));




        const targetEl = document.getElementById('todo-lists');

        let html = '';

        for (const { uid, date, title, content } of this.items) {
            let Tpl = this.getTpl();
            Tpl = Tpl.replace(/\$\{uid\}/g, uid)
                .replace(/\$\{date\}/g, date)
                .replace(/\$\{title\}/g, title)
                .replace(/\$\{content\}/g, content);

            html += Tpl;
        }
        targetEl.innerHTML = html;
    },
}


window.addEventListener('DOMContentLoaded', function () {

    const addForm = document.forms['frmTodo'];

    const dialog = document.getElementById('edit-dialog');


    const editForm = addForm.cloneNode(true);

    editForm.name = 'frmEditTodo';
    editForm.querySelector('button[type="submit"]').textContent =
        '수정 저장';


    document.getElementById('edit-form-area').append(editForm);

    const addCalendar = flatpickr(addForm.elements.date, {
        locale: 'ko',
        dateFormat: 'Y-m-d',
        disableMobile: true
    });

    const editCalendar = flatpickr(editForm.elements.date, {
        locale: 'ko',
        dateFormat: 'Y-m-d',
        disableMobile: true,
        static: true
    });

    let editingUid = null;

    todo.render();

    function getValues(form) {
        const requiredFields = {
            date: '날짜 선택',
            title: '제목 입력',
            content: '내용 입력',
        };

        const values = {};

        for (const [key, message] of Object.entries(requiredFields)) {
            const value = form.elements[key].value.trim();

            if (!value) {
                throw new Error(message);
            }

            values[key] = value;
            values[key] = value;
        }
        return values;
    }

    addForm.addEventListener('submit', function (e) {
        e.preventDefault();

        try {
            const values = getValues(addForm);
            todo.add(values.date, values.title, values.content);
            addForm.reset();
            addCalendar.clear();
            editCalendar.clear();
            addForm.elements.title.focus();
        } catch (err) {

            alert(err.message);
        }
    });

    editForm.addEventListener('submit', function (e) {
        e.preventDefault();

        try {
            if (editingUid === null) return;
            const values = getValues(editForm);
            todo.update(editingUid, values);
            dialog.close();
        } catch (err) {
            alert(err.message);
        }
    });

    document.getElementById('cancel-edit')
        .addEventListener('click', function () {
            dialog.close();
        });
    dialog.addEventListener('close', function () {
        editingUid = null;
        editForm.reset();
    });
    document.getElementById('todo-lists')
        .addEventListener('click', function (e) {
            const button = e.target.closest(
                '.delete-action, .edit-action'
            );

            if (!button) return;

            const uid = Number(button.dataset.uid);

            if (button.classList.contains('delete-action')) {
                todo.remove(uid);
                return;
            }

            const item = todo.items.find(x => x.uid === uid);

            if (!item) return;
            editingUid = uid;

            editCalendar.setDate(item.date, false, 'Y-m-d');
            editForm.elements.title.value = item.title;
            editForm.elements.content.value = item.content;
            dialog.showModal();
            editForm.elements.title.focus();
        });
});