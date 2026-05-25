const taskInput =
  document.getElementById("taskInput");

const addTaskBtn =
  document.getElementById("addTaskBtn");

const taskList =
  document.getElementById("taskList");

const totalTasks =
  document.getElementById("totalTasks");

const completedTasks =
  document.getElementById("completedTasks");

const pendingTasks =
  document.getElementById("pendingTasks");

const emptyMessage =
  document.getElementById("emptyMessage");

let tasks = [];



addTaskBtn.addEventListener(
  "click",
  addTask
);

taskInput.addEventListener(
  "keydown",
  event => {

    if(event.key === "Enter"){

      addTask();

    }

  }
);



async function addTask(){

  const text =
    taskInput.value.trim();

  if(text === ""){

    alert("Escribe una tarea");

    return;

  }

  await fetch("/tasks", {

    method:"POST",

    headers:{
      "Content-Type":"application/json"
    },

    body:JSON.stringify({ text })

  });

  taskInput.value = "";

  loadTasks();

}



async function loadTasks(){

  const response =
    await fetch("/tasks");

  tasks =
    await response.json();

  renderTasks();

}



function renderTasks(){

  taskList.innerHTML = "";

  tasks.forEach(task => {

    const div =
      document.createElement("div");

    div.className =
      task.completed
      ? "task completed"
      : "task";

    div.innerHTML = `

      <div>

        <h3>${task.text}</h3>

        <p class="status">

          ${
            task.completed
            ? " Completa"
            : " Incompleta"
          }

        </p>

      </div>

      <div class="buttons">

        <button
          class="complete-btn"
          onclick="toggleTask(${task.id})"
        >

          ${
            task.completed
            ? "Deshacer"
            : "Completar"
          }

        </button>

        <button
          class="delete-btn"
          onclick="deleteTask(${task.id})"
        >
          Eliminar
        </button>

      </div>

    `;

    taskList.appendChild(div);

  });

  updateStats();

}



async function toggleTask(id){

  const task =
    tasks.find(
      task => task.id === id
    );

  await fetch(`/tasks/${id}`, {

    method:"PUT",

    headers:{
      "Content-Type":"application/json"
    },

    body:JSON.stringify({

      completed:
        task.completed ? 0 : 1

    })

  });

  loadTasks();

}



async function deleteTask(id){

  await fetch(`/tasks/${id}`, {

    method:"DELETE"

  });

  loadTasks();

}



function updateStats(){

  const completed =
    tasks.filter(
      task => task.completed
    ).length;

  totalTasks.textContent =
    tasks.length;

  completedTasks.textContent =
    completed;

  pendingTasks.textContent =
    tasks.length - completed;

  if(tasks.length === 0){

    emptyMessage.style.display =
      "block";

  }else{

    emptyMessage.style.display =
      "none";

  }

}



loadTasks();