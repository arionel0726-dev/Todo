const addInput = document.querySelector('.add__input')
const addBtn = document.querySelector('.add__btn')
const todoList = document.querySelector('.todo-list')
const todosNumber = document.querySelector('.todos-number')
const errorText = document.querySelector('.error-text')
const filterSelect = document.querySelector('.filter__todo')
const clearBtn = document.querySelector('.clear-btn')

document.addEventListener('DOMContentLoaded', () => {
	filterTodo()
	updateTodosNumber()
})

filterSelect.addEventListener('change', filterTodo)
clearBtn.addEventListener('click', clearCompleted)

addBtn.addEventListener('click', addTodo)

addInput.addEventListener('keydown', event => {
	if (event.key === 'Enter') {
		addTodo()
	}
})

function addTodo() {
	const inputValue = addInput.value.trim()

	if (inputValue === '') {
		showError('Text must be filled out')
		return
	}

	const todoObject = {
		id: Date.now().toString(36) + Math.random().toString(36).substring(2),
		text: inputValue,
		isCompleted: false
	}

	saveToLocalStorage(todoObject)
	addInput.value = ''
	clearError()
	filterTodo()
	updateTodosNumber()
}

function renderTodos(todo) {
	const li = document.createElement('li')
	li.classList.add('todo-item')
	li.dataset.id = todo.id

	const buttonChange = document.createElement('button')
	buttonChange.classList.add('todo-change')
	buttonChange.type = 'button'
	buttonChange.setAttribute('aria-label', 'Edit task')
	buttonChange.innerHTML = `
		<img
			src="./assets/square-pen.svg"
			alt="Edit task"
		/>
	`

	const box = document.createElement('div')
	box.classList.add('todo-item-box')

	const checkbox = document.createElement('input')
	checkbox.classList.add('item-checkbox')
	checkbox.type = 'checkbox'
	checkbox.checked = todo.isCompleted

	const p = document.createElement('p')
	p.classList.add('todo__item-text')
	p.textContent = todo.text

	if (todo.isCompleted) {
		p.classList.add('completed')
	}

	const buttonDel = document.createElement('button')
	buttonDel.classList.add('todo__item-del')
	buttonDel.type = 'button'
	buttonDel.setAttribute('aria-label', 'Delete task')
	buttonDel.innerHTML = `
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
		>
			<path d="M18 6 6 18" />
			<path d="m6 6 12 12" />
		</svg>
	`

	box.appendChild(checkbox)
	box.appendChild(p)

	li.appendChild(buttonChange)
	li.appendChild(box)
	li.appendChild(buttonDel)

	buttonChange.addEventListener('click', editTask)
	buttonDel.addEventListener('click', delTodo)
	checkbox.addEventListener('change', handleCheckboxChange)

	todoList.appendChild(li)
}

function showError(message) {
	errorText.textContent = message
}

function clearError() {
	errorText.textContent = ''
}

function delTodo(event) {
	const button = event.currentTarget
	const li = button.closest('.todo-item')

	removeTodoFromLocalStorage(li.dataset.id)
	filterTodo()
	updateTodosNumber()
}

function handleCheckboxChange(event) {
	const checkbox = event.currentTarget
	const li = checkbox.closest('.todo-item')
	const id = li.dataset.id

	let todos = checkLocalStorage()

	todos = todos.map(todo => {
		if (todo.id === id) {
			return {
				...todo,
				isCompleted: checkbox.checked
			}
		}
		return todo
	})

	localStorage.setItem('todos', JSON.stringify(todos))
	filterTodo()
	updateTodosNumber()
}

function updateTodosNumber() {
	const todos = checkLocalStorage()
	const remainingTodos = todos.filter(todo => !todo.isCompleted).length
	todosNumber.textContent = `Your remaining todos: ${remainingTodos}`
}

function filterTodo() {
	const todos = checkLocalStorage()
	let filtered = todos

	if (filterSelect.value === 'active') {
		filtered = todos.filter(todo => !todo.isCompleted)
	} else if (filterSelect.value === 'completed') {
		filtered = todos.filter(todo => todo.isCompleted)
	}

	todoList.innerHTML = ''
	filtered.forEach(todo => renderTodos(todo))
}

function checkLocalStorage() {
	const storedTodos = localStorage.getItem('todos')

	if (storedTodos === null) {
		return []
	}

	try {
		const todos = JSON.parse(storedTodos)
		return Array.isArray(todos) ? todos : []
	} catch (error) {
		return []
	}
}

function saveToLocalStorage(todo) {
	const todos = checkLocalStorage()
	todos.push(todo)
	localStorage.setItem('todos', JSON.stringify(todos))
}

function removeTodoFromLocalStorage(id) {
	let todos = checkLocalStorage()
	todos = todos.filter(todo => todo.id !== id)
	localStorage.setItem('todos', JSON.stringify(todos))
}

function editTask(event) {
	const editButton = event.currentTarget
	const li = editButton.closest('.todo-item')
	const box = li.querySelector('.todo-item-box')
	const p = box.querySelector('.todo__item-text')

	const input = document.createElement('input')
	input.classList.add('change')
	input.type = 'text'
	input.value = p.textContent

	box.replaceChild(input, p)
	input.focus()
	input.select()

	let isSaved = false

	function saveUpdate() {
		if (isSaved) return
		isSaved = true

		const updatedValue = input.value.trim()

		if (updatedValue === '') {
			box.replaceChild(p, input)
			return
		}

		let todos = checkLocalStorage()

		todos = todos.map(todo => {
			if (todo.id === li.dataset.id) {
				return {
					...todo,
					text: updatedValue
				}
			}
			return todo
		})

		localStorage.setItem('todos', JSON.stringify(todos))

		p.textContent = updatedValue
		box.replaceChild(p, input)
	}

	input.addEventListener('blur', saveUpdate)
	input.addEventListener('keydown', e => {
		if (e.key === 'Enter') {
			saveUpdate()
		}

		if (e.key === 'Escape') {
			isSaved = true
			box.replaceChild(p, input)
		}
	})
}

function clearCompleted() {
	let todos = checkLocalStorage()
	todos = todos.filter(todo => !todo.isCompleted)

	localStorage.setItem('todos', JSON.stringify(todos))
	filterTodo()
	updateTodosNumber()
}
