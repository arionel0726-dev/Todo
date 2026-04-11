const addInput = document.querySelector('.add__input')
const addBtn = document.querySelector('.add__btn')
const todoList = document.querySelector('.todo-list')
const todosNumber = document.querySelector('.todos-number')
const errorText = document.querySelector('.error-text')
const filterSelect = document.querySelector('.filter__todo')
const clearBtn = document.querySelector('.clear-btn')

document.addEventListener('DOMContentLoaded', getTodos)
filterSelect.addEventListener('change', filterTodo)
clearBtn.addEventListener('click', clearCompleted)

addBtn.addEventListener('click', () => {
	const inputValue = addInput.value.trim()

	if (inputValue === '') {
		clearError()
		showError('Text must be filled out')
		return
	}

	const todoObject = {
		id: Date.now().toString(36) + Math.random().toString(36).substring(2),
		text: inputValue,
		isCompleted: false
	}

	saveToLocalStorage(todoObject)
	filterTodo()
	addInput.value = ''
})

addInput.addEventListener('keydown', event => {
	if (event.key === 'Enter') {
		addBtn.click()
	}
})

function renderTodos(todo) {
	const li = document.createElement('li')
	li.classList.add('todo-item')
	li.dataset.id = todo.id

	if (todo.isCompleted) {
		li.classList.add('completed')
	}

	const buttonChange = document.createElement('button')
	buttonChange.classList.add('todo-change')
	buttonChange.innerHTML = `
			<img
			src="./assets/square-pen.svg"
			alt="todo change"
		/>
	`
	li.appendChild(buttonChange)

	const box = document.createElement('div')
	box.classList.add('todo-item-box')
	li.appendChild(box)

	const checkbox = document.createElement('input')
	checkbox.classList.add('item-checkbox')
	checkbox.type = 'checkbox'
	checkbox.checked = todo.isCompleted
	box.appendChild(checkbox)

	const p = document.createElement('p')
	p.classList.add('todo__item-text')
	p.textContent = todo.text

	if (todo.isCompleted) {
		p.classList.add('completed')
	}

	buttonChange.addEventListener('click', editTask)

	box.appendChild(p)

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

	todoList.appendChild(li)
	clearError()

	todosNumberUpdate()
}

function showError(message) {
	errorText.textContent = message
}

function clearError() {
	errorText.textContent = ''
}

function delTodo(event) {
	const button = event.currentTarget
	const li = button.parentElement

	removeTodoFromLocalStorage(li.dataset.id)
	filterTodo()
	todosNumberUpdate()
}

function handleCheckboxChange(event) {
	const check = event.currentTarget
	const div = check.parentElement
	const li = div.parentElement
	const id = li.dataset.id

	let todos = checkLocalStorage()

	todos = todos.map(todo => {
		if (todo.id === id) {
			return {
				...todo,
				isCompleted: check.checked
			}
		}
		return todo
	})

	localStorage.setItem('todos', JSON.stringify(todos))

	li.classList.toggle('completed', check.checked)
	const p = check.nextElementSibling
	p.classList.toggle('completed', check.checked)

	filterTodo()
	todosNumberUpdate()
}

function todosNumberUpdate() {
	const remainingTodos = todoList.querySelectorAll(
		'.item-checkbox:not(:checked)'
	).length

	todosNumber.textContent = `Your remaining todos: ${remainingTodos}`
}

function filterTodo() {
	let todos = checkLocalStorage()

	let filtered = todos

	if (filterSelect.value === 'all') {
		filtered = todos
	} else if (filterSelect.value === 'active') {
		filtered = filtered.filter(todo => !todo.isCompleted)
	} else if (filterSelect.value === 'completed') {
		filtered = filtered.filter(todo => todo.isCompleted)
	}

	todoList.innerHTML = ''
	filtered.forEach(todo => renderTodos(todo))
}

function checkLocalStorage() {
	let todos
	const storedTodos = localStorage.getItem('todos')

	if (storedTodos === null) {
		todos = []
	} else {
		try {
			todos = JSON.parse(storedTodos)
			if (!Array.isArray(todos)) {
				todos = []
			}
		} catch (error) {
			todos = []
		}
	}

	return todos
}

function saveToLocalStorage(todo) {
	let todos = checkLocalStorage()
	todos.push(todo)
	localStorage.setItem('todos', JSON.stringify(todos))
}

function getTodos() {
	const todos = checkLocalStorage()
	filterTodo()
	todosNumberUpdate()
}

function removeTodoFromLocalStorage(id) {
	let todos = checkLocalStorage()
	todos = todos.filter(todo => todo.id !== id)
	localStorage.setItem('todos', JSON.stringify(todos))
}

function editTask(event) {
	const todoChange = event.currentTarget
	const div = todoChange.nextElementSibling
	const p = div.children[1]
	const input = document.createElement('input')
	input.classList.add('change')
	input.type = 'text'
	input.value = p.textContent

	div.replaceChild(input, p)
	input.focus()

	input.addEventListener('blur', () => saveUpdate())
	input.addEventListener('keydown', e => {
		if (e.key === 'Enter') saveUpdate()
	})

	function saveUpdate() {
		const li = todoChange.parentElement
		const id = li.dataset.id
		const updatedValue = input.value.trim()

		if (updatedValue === '') {
			div.replaceChild(p, input)
			return
		}

		let todos = checkLocalStorage()

		todos = todos.map(todo => {
			if (todo.id === id) {
				return {
					...todo,
					text: updatedValue
				}
			}
			return todo
		})

		localStorage.setItem('todos', JSON.stringify(todos))

		p.textContent = updatedValue
		div.replaceChild(p, input)
	}
}

function clearCompleted() {
	let todos = checkLocalStorage()

	todos = todos.filter(todo => !todo.isCompleted)

	localStorage.setItem('todos', JSON.stringify(todos))

	todoList.innerHTML = ''

	filterTodo()

	todosNumberUpdate()
}

todosNumberUpdate()
