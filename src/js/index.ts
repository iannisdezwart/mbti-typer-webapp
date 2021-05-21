// Navbar

const toggleNavbar = () => {
	document.querySelector('html').classList.toggle('mobile-navbar-opened')
}

// Service worker messaging

interface WorkerMessage {
	command: string
	args?: any
}

const messageWorker = (data: WorkerMessage) => {
	const messageChannel = new MessageChannel()

	messageChannel.port1.onmessage = e => {
		new Popup({
			title: 'Service Worker',
			description: e.data
		})
	}

	navigator.serviceWorker.controller.postMessage(data, [ messageChannel.port2 ])
}

const clearCache = () => {
	messageWorker({ command: 'clear-cache' })
}

// Popups

interface PopupOptions {
	title: string
	description: string
}

class Popup {
	static id = 0

	popupEl: HTMLDivElement
	closeButtonEl: HTMLButtonElement

	constructor(options: PopupOptions) {
		const id = `popup-${ Popup.id++ }`

		document.body.insertAdjacentHTML('beforeend', /* html */ `
		<div id="${ id }" class="invisible popup">
			<h2>${ options.title }</h2>
			<p>${ options.description }</p>
			<button class="button">Close</button>
		</div>
		`)

		this.popupEl = document.getElementById(id) as HTMLDivElement
		this.closeButtonEl = this.popupEl.querySelector('button')

		requestAnimationFrame(() => requestAnimationFrame(() => this.popupEl.classList.remove('invisible')))
		this.closeButtonEl.addEventListener('click', () => this.onCloseHandler())
	}

	onCloseHandler() {
		this.popupEl.classList.add('invisible')
		setTimeout(() => this.popupEl.remove(), 300)
	}
}

addEventListener('DOMContentLoaded', () => {
	// Sliders

	const slideChangeHandler = (slider: HTMLInputElement) => {
	const sliderContainer = slider.parentElement as HTMLDivElement
		const valueEl = sliderContainer.querySelector('.value') as HTMLSpanElement

		valueEl.innerHTML = slider.value
	}

	const sliders = document.querySelectorAll<HTMLInputElement>('.slider input[type="range"]')

	for (const slider of sliders) {
		slider.addEventListener('input', () => slideChangeHandler(slider))
		slideChangeHandler(slider) // Initial value
	}
})
