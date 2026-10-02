const STORAGE_KEY = 'todo-list:items';

const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const list = document.querySelector('#todo-list');
const emptyState = document.querySelector('#empty-state');

let todos = load();

function load() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // Storage full or blocked; the in-memory list still works.
  }
}

function updateEmptyState() {
  emptyState.classList.toggle('hidden', todos.length > 0);
}

function makeButton(label, classes) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.className = classes;
  return button;
}

function renderItem(todo) {
  const li = document.createElement('li');
  li.className = 'flex items-center gap-2 rounded bg-white p-3 shadow-sm';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = todo.completed;
  checkbox.setAttribute('aria-label', 'Completed');
  checkbox.className = 'h-5 w-5 shrink-0';

  const text = document.createElement('span');
  text.className = 'min-w-0 flex-1 break-words';
  text.textContent = todo.text;

  const editButton = makeButton('Edit', 'shrink-0 rounded px-2 py-1 text-sm text-blue-700 hover:bg-blue-50');
  const deleteButton = makeButton('Delete', 'shrink-0 rounded px-2 py-1 text-sm text-red-700 hover:bg-red-50');

  function applyCompleted() {
    text.classList.toggle('line-through', todo.completed);
    text.classList.toggle('text-slate-400', todo.completed);
  }
  applyCompleted();

  checkbox.addEventListener('change', () => {
    todo.completed = checkbox.checked;
    applyCompleted();
    save();
  });

  function startEdit() {
    if (li.querySelector('input[type="text"]')) return;
    const editor = document.createElement('input');
    editor.type = 'text';
    editor.value = todo.text;
    editor.setAttribute('aria-label', 'Edit todo');
    editor.className = 'min-w-0 flex-1 rounded border border-blue-500 px-2 py-1 focus:outline-none';
    let done = false;

    function finish(commit) {
      if (done) return;
      done = true;
      const value = editor.value.trim();
      if (commit && value) {
        todo.text = value;
        save();
      }
      text.textContent = todo.text;
      editor.replaceWith(text);
    }

    editor.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') finish(true);
      else if (event.key === 'Escape') finish(false);
    });
    editor.addEventListener('blur', () => finish(true));

    text.replaceWith(editor);
    editor.focus();
    editor.select();
  }

  editButton.addEventListener('click', startEdit);
  text.addEventListener('dblclick', startEdit);

  deleteButton.addEventListener('click', () => {
    todos = todos.filter((t) => t.id !== todo.id);
    li.remove();
    save();
    updateEmptyState();
  });

  li.append(checkbox, text, editButton, deleteButton);
  return li;
}

function render() {
  list.replaceChildren(...todos.map(renderItem));
  updateEmptyState();
}

function addTodo(rawText) {
  const value = rawText.trim();
  if (!value) return;
  const todo = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2),
    text: value,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  todos.push(todo);
  list.append(renderItem(todo));
  save();
  updateEmptyState();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  addTodo(input.value);
  input.value = '';
  input.focus();
});

render();
