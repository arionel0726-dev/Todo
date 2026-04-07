const addInput = document.querySelector('.add__input')
const addBtn = document.querySelector('.add__btn')
const todoList = document.querySelector('.todo-list')
const todoLi = document.querySelector('.todo-item')

addBtn.addEventListener('click', () => {
	if (addInput.value.trim() === '') {
		// later will add p text with error message
		alert('Text must be filled out')
		return
	}

	renderTodos(addInput.value)
	addInput.value = ''
})

function renderTodos(todoText) {
	// create li
	const li = document.createElement('li')
	li.classList.add('todo-item')

	// create p
	const p = document.createElement('p')
	p.classList.add('todo__item-text')
	p.textContent = todoText
	li.appendChild(p)

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

	// append all into ul
	todoList.appendChild(li)
}

function delTodo(event) {
	// delete li item
	const button = event.currentTarget
	const li = button.parentElement
	li.remove()
}
