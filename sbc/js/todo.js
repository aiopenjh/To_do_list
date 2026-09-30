// 전체 흐름: 페이지 로드 → 저장된 목록 읽기 → 날짜순 출력 → 등록/수정/삭제 → 다시 저장하고 출력.
// 이 객체는 할 일 데이터와 처리 함수를 묶음. 메서드에서 this는 todo 객체를 가리킴.
// const는 todo 변수 자체의 재대입을 막으며 객체 내부의 속성 변경은 가능함.
const todo = {
    // 현재 페이지에서 다루는 할 일 배열임. 새로고침 후 render()가 저장된 배열을 불러옴.
    items: [], // 할 일 목록
    // 카드 템플릿 문자열을 보관함. 처음 읽은 뒤 재사용하는 캐시임.
    tpl: null,

    // 등록: 날짜·제목·내용을 받아 배열 끝에 새 객체를 추가함.
    // 등록 후에는 저장부터 하고 화면을 다시 그림.
    add(date, title, content){ // 추가
        this.items.push({
            // 현재 시각을 밀리초 숫자로 받아 항목 식별값으로 사용함.
            // date, title, content는 같은 이름의 매개변수 값을 넣는 객체 속성 단축 표기임.
            uid:Date.now(),
            date,
            title,
            content,
        })

        this.save(); // 저장 처리
        this.render(); // 추가 후 화면 갱신
    }, 

    // 수정: uid는 대상 식별값, changes는 { title: ..., content: ... }처럼 바꿀 속성을 담은 객체임.
    // changes에서 생략한 속성은 유지됨. 실제 팝업 폼은 세 입력값을 모두 전달함.
    update(uid, changes) {
        // find는 조건에 맞는 첫 객체를 반환함. dataset.uid는 문자열이므로 숫자로 변환해 비교함.
        // item은 배열에 들어 있는 객체를 참조하므로 item의 속성을 바꾸면 배열 속 데이터도 바뀜.
        const item = this.items.find(x => x.uid === Number(uid));

        // 대상이 없으면 예외를 발생시킴. 폼 이벤트의 catch에서 메시지를 보여줌.
        if (!item) {
            throw new Error('수정할 항목을 찾을 수 없습니다.');
        }

        // 수정 가능한 세 속성만 순회함. uid 등의 다른 속성은 수정하지 않음.
        for (const key of ['date', 'title', 'content']) {
            // 해당 속성이 changes에 직접 포함되어 있을 때만 수정함.
            // 값의 참/거짓을 검사하지 않으므로 빈 문자열도 전달된 값으로 취급함.
            if (Object.hasOwn(changes, key)) {
                item[key] = changes[key];
            }
        }

        this.save(); // 저장 처리
        this.render(); // 수정 후 화면 갱신
    },
    
    // 삭제: 식별값에 해당하는 배열 위치를 찾고 그 항목 하나를 제거함.
    remove(uid){ // 제거

        // findIndex는 조건에 맞는 첫 위치를 반환하며, 찾지 못하면 -1을 반환함.
        const index = this.items.findIndex(x => x.uid === Number(uid));

        // 없는 항목을 삭제하려고 하면 여기서 종료함. splice(-1, 1)은 마지막 항목을 지우므로 이 검사가 필요함.
        if (index === -1){
            return
        }

        // index 위치부터 한 개를 삭제함. splice는 원래 배열을 직접 바꿈.
        this.items.splice(index, 1);

        this.save(); // 저장 처리
        this.render(); // 제거 후 화면 갱신
    },

    // 저장: localStorage는 현재 브라우저의 사이트별 저장 공간임.
    // 서버나 다른 기기와 공유되지 않으며 일반적으로 새로고침 후에도 유지됨.
    // 마지막 항목을 삭제하면 빈 배열 문자열 []이 저장됨.
    save() { // 저장
        // localStorage는 문자열을 저장하므로 JSON.stringify로 배열을 JSON 문자열로 바꿈.
        // todos 키에 저장하며 기존 값이 있으면 덮어씀.
        localStorage.setItem('todos', JSON.stringify(this.items));
    },

    // 템플릿 가져오기: HTML의 script#tpl 내부 내용을 문자열로 읽음.
    getTpl() {
        // 캐시가 없을 때만 DOM에서 읽고, 이후에는 이미 저장한 문자열을 반환함.
        if( !this.tpl ){
            this.tpl = document.getElementById('tpl').innerHTML;
        }

        return this.tpl;
    },


    // 화면 출력: 저장 데이터 읽기 → 날짜 정렬 → 각 카드의 템플릿 값 교체 → 목록 영역 갱신.
    render() {
        // todos 키의 문자열을 읽음. 저장된 값이 없으면 null을 반환함.
        const tmp = localStorage.getItem('todos');
        // 문자열이면 JSON.parse로 배열을 복원하고, 없으면 빈 배열을 사용함.
        // 저장 문자열이 올바른 JSON이라는 전제이며, 잘못된 JSON은 parse에서 오류가 발생함.
        this.items = typeof tmp === 'string' ? JSON.parse(tmp) : [];

        // 날짜 오름차순: 이전 날짜 → 이후 날짜
        // 날짜 입력값은 YYYY-MM-DD 형식이라 문자열 비교로 날짜순 정렬할 수 있음.
        // sort는 배열 자체를 정렬함. 여기서는 표시 순서를 정하고 즉시 저장하지는 않음.
        this.items.sort((a, b) => a.date.localeCompare(b.date));

        // 기존 화면 출력 코드 유지

        
            // 완성한 카드 HTML을 넣을 ul 요소를 찾음. HTML의 id와 정확히 같아야 함.
            const targetEl = document.getElementById('todo-lists');
            
            // 모든 카드의 HTML을 누적할 문자열임. 항목이 없으면 빈 문자열이 유지됨.
            let html = '';

            // 배열을 순회하면서 객체 구조 분해로 각 속성을 꺼냄.
            for (const { uid, date, title, content } of this.items){
                // 항목마다 원본 템플릿 문자열을 가져옴. 문자열 replace는 새 문자열을 반환함.
                let Tpl = this.getTpl();
                // 정규식으로 ${uid} 등의 자리표시자를 실제 값으로 교체함. g는 모든 일치 위치를 바꾼다는 뜻임.
                // uid는 카드 id와 버튼 data-uid 양쪽에 들어가므로 전체 교체가 필요함.
                // 현재 구현은 입력 문자열을 HTML에 직접 넣음. HTML 특수문자를 일반 텍스트로 변환하는 처리는 포함되지 않음.
                Tpl = Tpl.replace(/\$\{uid\}/g, uid)
                        .replace(/\$\{date\}/g, date)
                        .replace(/\$\{title\}/g, title)
                        .replace(/\$\{content\}/g, content);

                // 이번 카드 문자열을 전체 목록 문자열 뒤에 이어 붙임.
                html += Tpl;
            }

            // ul 내부 HTML을 교체해 목록을 다시 그림.
            // 빈 배열이면 빈 문자열을 넣으므로 마지막 항목 삭제 시 화면도 비워짐.
            targetEl.innerHTML = html;
        },
}

// HTML 요소가 준비된 뒤 실행함. 여기서 폼을 찾고 등록·수정·삭제 이벤트를 연결함.
window.addEventListener('DOMContentLoaded', function() {
    // name="frmTodo"인 등록 폼을 찾음. 요소의 name을 이용해 elements에서 입력창을 찾을 수 있음.
    const addForm = document.forms['frmTodo'];
    // HTML의 수정 팝업 요소임. 등록 폼과 별도의 수정 폼을 이 안에 둠.
    const dialog = document.getElementById('edit-dialog');

    // 등록 폼을 복사하여 팝업용 수정 폼 생성
    // true는 폼 안의 입력창과 버튼까지 깊게 복사한다는 뜻임.
    // addEventListener로 연결한 이벤트는 복사되지 않으므로 아래에서 수정용 submit 이벤트를 따로 연결함.
    const editForm = addForm.cloneNode(true);
    // 등록 폼과 구별되는 이름을 지정함. 등록 폼과 수정 폼의 입력값은 각각 따로 관리됨.
    editForm.name = 'frmEditTodo';
    // CSS 선택자로 복사된 폼의 제출 버튼을 찾아 문구만 바꿈. textContent는 일반 텍스트를 설정함.
    editForm.querySelector('button[type="submit"]').textContent =
        '수정 저장';

    // 복사한 폼을 팝업 안의 준비된 위치에 삽입함.
    document.getElementById('edit-form-area').append(editForm);

    // 현재 수정 중인 항목의 식별값임. null은 아직 수정 대상이 없다는 뜻임.
    let editingUid = null;

    // 처음 페이지가 열릴 때 반드시 호출하여 저장된 항목을 불러오고 표시함.
    // 이를 생략하면 빈 items로 새 항목을 등록하면서 기존 저장 데이터를 덮어쓸 수 있음.
    todo.render();

    // 폼의 값을 검사하고 가져오기
    // 등록 폼과 수정 폼이 함께 사용하는 입력 검사 함수임.
    // 전달받은 form에서만 값을 읽고 { date, title, content } 객체를 반환함.
    function getValues(form) {
        // 입력창 name과 비어 있을 때 보여줄 안내 메시지를 짝지어 둠.
        const requiredFields = {
            date: '날짜 선택',
            title: '제목 입력',
            content: '내용 입력',
        };

        // 검사를 통과한 입력값을 담을 객체임.
        const values = {};

        // Object.entries는 객체를 [키, 값] 쌍의 배열로 바꿈.
        // 구조 분해로 key에는 입력창 이름, message에는 안내 메시지를 받음.
        for (const [key, message] of Object.entries(requiredFields)) {
            // 입력값 앞뒤 공백을 제거함. 등록 폼과 수정 폼에서 같은 name을 사용해도 form별로 구분됨.
            const value = form.elements[key].value.trim();

            // 빈 값이면 예외를 던져 제출 처리를 중단함. 따라서 현재 UI에서는 세 항목 모두 필수임.
            if (!value) {
                throw new Error(message);
            }

            // 검사한 값을 해당 속성에 담음. 예를 들어 key가 title이면 values.title에 저장함.
            values[key] = value;
        }

        // 모든 필드가 유효하면 입력값 객체를 제출 이벤트에 돌려줌.
        return values;
    }

    // 기존 폼: 새 할 일 등록
    // 등록 폼 제출 처리임. 버튼 클릭뿐 아니라 폼 제출로 발생하는 이벤트도 처리함.
    addForm.addEventListener('submit', function(e) {
        // 폼의 기본 제출과 페이지 이동을 막고 JS로 처리함.
        e.preventDefault();

        try {
            // 검사 중 발생한 예외는 catch로 이동하므로 유효한 값일 때만 등록됨.
            const values = getValues(addForm);

            // 검사한 값을 등록 함수에 전달함. add 내부에서 저장과 화면 갱신까지 수행함.
            todo.add(values.date, values.title, values.content);

            // 등록 완료 후 입력값을 초기값으로 되돌리고 제목 입력창으로 포커스를 옮김.
            addForm.reset();
            addForm.elements.title.focus();
        } catch (err) {
            // 검증 또는 저장 처리 중 발생한 오류 메시지를 표시함.
            alert(err.message);
        }
    });

    // 팝업 폼: 기존 할 일 수정
    // 수정 폼 제출 처리임. 원래 등록 폼의 add 동작과 별도로 update를 실행함.
    editForm.addEventListener('submit', function(e) {
        // 폼의 기본 제출과 페이지 이동을 막고 JS로 처리함.
        e.preventDefault();

        try {
            // 수정 대상이 없는 상태에서는 저장하지 않음.
            if (editingUid === null) return;

            // 팝업 입력값도 등록할 때와 같은 필수 입력 검사를 거침.
            const values = getValues(editForm);

            // 현재 수정 대상에 폼 값을 반영함. 수정하지 않은 입력창에는 기존 값이 그대로 남아 있음.
            todo.update(editingUid, values);
            dialog.close();
        } catch (err) {
            // 검증 또는 저장 처리 중 발생한 오류 메시지를 표시함.
            alert(err.message);
        }
    });

    // 취소 버튼: 저장하지 않고 닫기
    // 취소 시 update를 호출하지 않고 팝업만 닫으므로 입력한 변경값은 저장되지 않음.
    document.getElementById('cancel-edit')
        .addEventListener('click', function() {
            dialog.close();
        });

    // 팝업을 닫으면 수정 상태 초기화
    // 저장 완료·취소·Esc 등으로 팝업이 닫혔을 때 수정 상태와 폼을 초기화함.
    dialog.addEventListener('close', function() {
        editingUid = null;
        editForm.reset();
    });

    // 목록의 삭제 / 수정 버튼
    // 이벤트 위임: 버튼마다 이벤트를 붙이지 않고 부모 ul에 클릭 이벤트 하나를 연결함.
    // render가 카드를 새로 만들어도 ul은 그대로이므로 새 버튼에서도 클릭을 처리할 수 있음.
    document.getElementById('todo-lists')
        .addEventListener('click', function(e) {
            // 실제로 클릭한 요소부터 가까운 삭제/수정 버튼을 찾음.
            // 버튼 내부에 다른 요소를 넣어도 해당 버튼을 찾을 수 있음.
            const button = e.target.closest(
                '.delete-action, .edit-action'
            );

            // 카드 내용 등 버튼이 아닌 영역을 클릭했으면 처리하지 않음.
            if (!button) return;

            // data-uid 속성은 dataset.uid로 읽음. 문자열을 숫자로 바꾸어 저장된 uid와 비교함.
            const uid = Number(button.dataset.uid);

            // 클래스로 버튼 종류를 구분함. 삭제 버튼이면 삭제 후 종료하여 수정 처리로 이어지지 않게 함.
            if (button.classList.contains('delete-action')) {
                todo.remove(uid);
                return;
            }

            // 수정 버튼이면 현재 목록에서 해당 uid의 데이터를 찾음.
            const item = todo.items.find(x => x.uid === uid);

            // 대상이 없으면 팝업을 열지 않음.
            if (!item) return;

            // 이후 수정 저장에서 사용할 대상 식별값을 기억함.
            editingUid = uid;

            // 팝업 입력창에 기존 값 채우기
            // 기존 날짜·제목·내용을 수정 폼에 채움. 사용자는 바꿀 입력창만 수정하면 됨.
            editForm.elements.date.value = item.date;
            editForm.elements.title.value = item.title;
            editForm.elements.content.value = item.content;

            // 모달 팝업을 열어 뒤쪽 페이지 조작을 막고, 제목 입력창에 포커스를 둠.
            dialog.showModal();
            editForm.elements.title.focus();
        });
});