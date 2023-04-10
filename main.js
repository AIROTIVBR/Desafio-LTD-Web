// Seleção de elementos 
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");;
const filterBtn = document.querySelector("#filter-select");
let oldInputValue;

// Funções

  //fazendo dos elementos serem salvos na mesma div 
  const saveTodo = (text, done = 0, save = 1) => {
  const todo = document.createElement("div");
  todo.classList.add("todo");

  // cria um novo elemento 
  const todoTitle = document.createElement("h3");
  todoTitle.innerText = text;
  todo.appendChild(todoTitle);
  document.getElementById("todo-input").focus();
  // para colocar o input em foco novamente e poder adicionar uma nova tarefa

  // criando botão de done para cada item
  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.innerHTML = 'done';
  todo.appendChild(doneBtn);

  // criando botão de edit para cada item 
  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = 'edit';
  todo.appendChild(editBtn);

  // criando botão de delete para cada item 
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-todo");
  deleteBtn.innerHTML = 'delete';
  todo.appendChild(deleteBtn);

  // Utilizando dados da localStorage(salvando as tarefas feitas)
  if (done) {
    todo.classList.add("done");
  }

  if (save) {
    saveTodoLocalStorage({ text, done: 0 });
  }

  todoList.appendChild(todo);

  todoInput.value = "";
};

// para esconder a área de edição quando não tiver usando ou se estiver editando para esconder a lista e área de input
const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

// atualizar o valor de cada tarefa após a edição
const updateTodo = (text) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3");

    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = text;

      // Utilizando dados da localStorage
      updateTodoLocalStorage(oldInputValue, text);
    }
  });
};

// para a ação de display das tarefas de acordo com a situação, se está como feita, se está para ser feita
const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll(".todo");

  // vai servir para apenas apresentar as tarefas que correspondem á determinado caso (status da tarefa)
  switch (filterValue) {
    case "all":
      todos.forEach((todo) => (todo.style.display = "flex"));

      break;

    case "done":
      todos.forEach((todo) =>
        todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );

      break;

    case "todo":
      todos.forEach((todo) =>
        !todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );

      break;

    default:
      break;
  }
};

// EVENTOS

// salvar o valor do input e impedir que seja salvo um valor nulo
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;

  if (inputValue) {
    saveTodo(inputValue);
  }
});

// 
document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let todoTitle;

  // salvar o valor do input em um elemento 
  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3").innerText || "";
  }

  // atualiza o status da tarefa no local storage
  if (targetEl.classList.contains("finish-todo")) {
    parentEl.classList.toggle("done");

    updateTodoStatusLocalStorage(todoTitle);
  }

  // remove o elemento (tarefa) da lista e do local storage
  if (targetEl.classList.contains("remove-todo")) {
    parentEl.remove();

    // Utilizando dados da localStorage
    removeTodoLocalStorage(todoTitle);
  }

  // edita o valor que o elemento(tarefa) recebe 
  if (targetEl.classList.contains("edit-todo")) {
    toggleForms();

    editInput.value = todoTitle;
    oldInputValue = todoTitle;
  }
});

// cancelar a edição da tarefa e fechar o formulário de edição
cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

// para alterar o "valor" da tarefa, atualizar e mudar o formulário apresentado
editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;

  if (editInputValue) {
    updateTodo(editInputValue);
  }

  toggleForms();
});

// filtrar de acordo com os status de cada tarefa
filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;

  filterTodos(filterValue);
});

// LOCAL STORAGE

// mostrar todos itens salvos no local storage
const getTodosLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  return todos;
};

const loadTodos = () => {
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    saveTodo(todo.text, todo.done, 0);
  });
};

// vai salvar a nova tarefa no local storage e vai colocar ele dentro do array da lista de tarefas
const saveTodoLocalStorage = (todo) => {
  const todos = getTodosLocalStorage();

  todos.push(todo);

  localStorage.setItem("todos", JSON.stringify(todos));
};

// para remover da lista de tarefas determinado item retirar ele da memoria do local storage
const removeTodoLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  const filteredTodos = todos.filter((todo) => todo.text != todoText);

  localStorage.setItem("todos", JSON.stringify(filteredTodos));
};


// para atualizar os "status" das tarefas no local storage 
const updateTodoStatusLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.text === todoText ? (todo.done = !todo.done) : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};


// para toda edição de tarefa também atualizar no local storage
const updateTodoLocalStorage = (todoOldText, todoNewText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.text === todoOldText ? (todo.text = todoNewText) : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};

// mostrar tudo que está salvo no local storage
loadTodos();