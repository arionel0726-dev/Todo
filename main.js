const addInput = document.querySelector('.add__input')
const addBtn = document.querySelector('.add__btn')
const todoList = document.querySelector('.todo-list')
const todosNumber = document.querySelector('.todos-number')
const errorText = document.querySelector('.error-text')
const filterSelect = document.querySelector('.filter__todo')
//test
document.addEventListener('DOMContentLoaded', getTodos)
filterSelect.addEventListener('change', filterTodo)

addBtn.addEventListener('click', () => {
	const inputValue = addInput.value.trim()

	if (inputValue === '') {
		clearError()

		showError('Text must be filled out')

		return
	}

	renderTodos(inputValue)
	saveToLocalStorage(inputValue)
	addInput.value = ''
})

addInput.addEventListener('keydown', event => {
	if (event.key === 'Enter') {
		addBtn.click()
	}
})

function renderTodos(todoText) {
	// create li
	const li = document.createElement('li')
	li.classList.add('todo-item')

	// li item box
	const box = document.createElement('div')
	box.classList.add('todo-item-box')
	li.appendChild(box)

	// create input checkbox
	const checkbox = document.createElement('input')
	checkbox.classList.add('item-checkbox')
	checkbox.type = 'checkbox'
	box.appendChild(checkbox)

	// create p
	const p = document.createElement('p')
	p.classList.add('todo__item-text')
	p.textContent = todoText
	box.appendChild(p)

	//create button
	const button = document.createElement('button')
	button.classList.add('todo__item-del')
	button.innerHTML = `
		<svg
							xmlns="http://www.w3.org/2000/svg"
							width="19"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-x-icon lucide-x"
						>
							<path d="M18 6 6 18" />
							<path d="m6 6 12 12" />
						</svg>
	`
	li.appendChild(button)
	button.addEventListener('click', delTodo)
	checkbox.addEventListener('change', handleCheckboxChange)

	// append all into ul
	todoList.appendChild(li)
	clearError()
	//todos number length
	todosNumberUpdate()
}

// add error text
function showError(message) {
	console.log(errorText)
	errorText.textContent = message
}

// clear error text
function clearError() {
	errorText.textContent = ''
}
function delTodo(event) {
	// delete li item
	const button = event.currentTarget
	const li = button.parentElement
	removeTodoFromLocalStorage(li)
	li.remove()
	todosNumberUpdate()
}

// check checkbox and if positive then add classlist
function handleCheckboxChange(event) {
	const check = event.currentTarget
	const div = check.parentElement
	const li = div.parentElement
	li.classList.toggle('completed', check.checked)
	const p = check.nextElementSibling
	p.classList.toggle('completed', check.checked)
	todosNumberUpdate()
}
function todosNumberUpdate() {
	const remainingTodos = todoList.querySelectorAll(
		'.item-checkbox:not(:checked)'
	).length

	todosNumber.textContent = `Your remaining todos: ${remainingTodos}`
}

// make the filter
function filterTodo(e) {
	const todo = Array.from(todoList.children)
	todo.forEach(todo => {
		switch (e.target.value) {
			case 'all':
				todo.style.display = 'flex'
				break
			case 'active':
				if (!todo.classList.contains('completed')) {
					todo.style.display = 'flex'
				} else {
					todo.style.display = 'none'
				}
				break
			case 'completed':
				if (todo.classList.contains('completed')) {
					todo.style.display = 'flex'
				} else {
					todo.style.display = 'none'
				}
				break
		}
	})
}

//check storage
function checkLocalStorage() {
	let todos
	if (localStorage.getItem('todos') === null) {
		todos = []
	} else {
		todos = JSON.parse(localStorage.getItem('todos'))
	}
	return todos
}

// save to localStorage
function saveToLocalStorage(todo) {
	let todos = checkLocalStorage()

	todos.push(todo)
	localStorage.setItem('todos', JSON.stringify(todos))
}

function getTodos() {
	let todos = checkLocalStorage()

	todos.forEach(todo => {
		renderTodos(todo)
	})
}
function removeTodoFromLocalStorage(todo) {
	const todoText = todo.children[0].children[1].textContent
	let todos = checkLocalStorage()

	const todoIndex = todos.indexOf(todoText)
	if (todoIndex > -1) {
		todos.splice(todoIndex, 1)
	}
	localStorage.setItem('todos', JSON.stringify(todos))
}

// update the todos number length
todosNumberUpdate()
