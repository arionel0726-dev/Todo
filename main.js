const addInput = document.querySelector('.add__input')
const addBtn = document.querySelector('.add__btn')
const todoList = document.querySelector('.todo-list')
const todosNumber = document.querySelector('.todos-number')
const errorText = document.querySelector('.error-text')

addBtn.addEventListener('click', () => {
	const inputValue = addInput.value.trim()

	if (inputValue === '') {
		clearError()

		showError('Text must be filled out')

		return
	}

	renderTodos(inputValue)
	addInput.value = ''
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
	errorText.innerHTML = message
}

// clear error text
function clearError() {
	errorText.textContent = ''
}
function delTodo(event) {
	// delete li item
	const button = event.currentTarget
	const li = button.parentElement
	li.remove()
	todosNumberUpdate()
}

// check checkbox and if positive then add classlist
function handleCheckboxChange(event) {
	const check = event.currentTarget
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
todosNumberUpdate()
