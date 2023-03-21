"use strict";

// ADD YOUR CODE HERE

const linkText = document.querySelectorAll(".text-description");
const linkLine = document.querySelectorAll(".line");
const link = document.querySelectorAll("li");

const verifyLink = (index) => {
    for(let text of linkText) {
        text.classList.remove("active")
    }
    linkText[index].classList.add("active")

    for(let line of linkLine){
        line.classList.remove("active")
    }
    linkLine[index].classList.add("active")
}

link.forEach((item, index) => {
    item.addEventListener("click", () => {
        verifyLink(index);
        renderTodos(filteredTasks(tasks));
    })
})

const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskList = document.getElementById("tasks");
const addTaskForm = document.querySelector(".add-task-label form");
const statusFilter = document.getElementById("task-sorting");
const searchInput = document.getElementById("search");

const filteredTasks = (tasks) => {
    let filteredTasks;
    if (linkText[0].classList.contains("active")) {
        filteredTasks = tasks.filter((task) => !task.done);
        return filteredTasks;
    } else if (linkText[1].classList.contains("active")) {
        filteredTasks = tasks.filter((task) => task.done);
        return filteredTasks
    } else {
        return tasks;
    }
}

const addTodo = (taskDescription) => {
    const newToDo = {
      id: Date.now(),
      description: taskDescription,
      done: false,
    };
    tasks.unshift(newToDo);
  
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTodos(filteredTasks(tasks));
    createNotification("success");
}

const renderTodos = (filteredTasks) => {
    taskList.innerHTML = "";

    filteredTasks.forEach((todo) => {
        const taskElement = document.createElement("div");
        taskElement.classList.add("to-do-element");
        if (todo.done) {
            taskElement.classList.add("done");
        }

        taskElement.innerHTML = `
        <p class="task-description">${todo.description}</p>
        <div class="control-icons">
            <button class="check-icon" data-id="${todo.id}"></button>
            <button class="delete-icon" data-id="${todo.id}"></button>
        </div>
        `;

        taskList.appendChild(taskElement);
    });
}

addTaskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const taskDescription = addTaskForm.add.value; 
    if (taskDescription !== "") {
        addTodo(taskDescription);
        addTaskForm.reset();
    } else {
        createNotification("warning");
    }
});

const toggleTaskDoneState = (taskId) => {
    const taskIndex = tasks.findIndex((todo) => todo.id === Number(taskId));
    tasks[taskIndex].done = !tasks[taskIndex].done;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTodos(filteredTasks(tasks));
}

const deleteTask = (taskId) => {
    const taskIndex = tasks.findIndex((todo) => todo.id === Number(taskId));
    tasks.splice(taskIndex, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTodos(tasks);
    createNotification("delete")
}

taskList.addEventListener("click", (event) => {
    const clickedElement = event.target;
  
    if (clickedElement.classList.contains("check-icon")) {
        toggleTaskDoneState(clickedElement.dataset.id);
    } else if (clickedElement.classList.contains("delete-icon")) {
        deleteTask(clickedElement.dataset.id);
    }
});

//theme changer
const toggleColorScheme = () => {
    const body = document.querySelector('body');
    
    if (body.classList.contains('light-scheme')) {
      body.classList.remove('light-scheme');
      body.classList.add('dark-scheme');
    } else {
      body.classList.remove('dark-scheme');
      body.classList.add('light-scheme');
    }
};

//notification mechanism
const notifications = document.getElementById("notifications")
const notificationDetails = {
    timer: 5000,
    success:{
        text: 'You succesfully added a task to your list.'
    }, 
    warning : {
        text: 'You have to write something to be added to the to do list!'
    },
    delete : {
        text: 'You succesfully deleted a task.'
    }
}

const removeNotification = (notification) => {
    notification.classList.add("hide");
    if(notification.timeoutId) clearTimeout(notification.timeoutId); 
    setTimeout(() => notification.remove(), 500); 
}

const createNotification = (state) => {
    const {text} = notificationDetails[state];
    const notification = document.createElement("li");
    notification.className = `notification`;
    notification.innerHTML = `<div class="column">
                         <div class="notification-icon"></div>
                         <span>${text}</span>
                      </div>
                      `;
    notifications.appendChild(notification);
    notification.timeoutId = setTimeout(() => removeNotification(notification), notificationDetails.timer);
}

console.log(notificationDetails)

//search functionality
const searchForm = document.querySelector(".form-icons form");
searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const searchQuery = searchInput.value;
    renderTodos(filteredTasks(performSearch(searchQuery)));
});

const performSearch = (searchQuery) => {
    let filteredTasks = tasks.filter( (task) =>
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filteredTasks;
};
renderTodos(filteredTasks(tasks));


