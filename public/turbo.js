import 'https://cdn.skypack.dev/@hotwired/turbo?min'
import morphdom from 'https://cdn.skypack.dev/morphdom?min'
addEventListener("turbo:before-render", (event) => {
	event.detail.render = (currentElement, newElement) => {
		morphdom(currentElement.querySelector(`.main-frame`), newElement.querySelector(`.main-frame`))
		morphdom(currentElement.querySelector(`nav.sidebar`), newElement.querySelector(`nav.sidebar`))
		document.querySelector('dialog').click()
	}
})
addEventListener("turbo:before-visit", (event) => {
	const excpReg = /^\/$/
	if(excpReg.test(new URL(event.detail.url).pathname) || excpReg.test(location.pathname)){
		event.preventDefault()
		location.href = event.detail.url
	}
})