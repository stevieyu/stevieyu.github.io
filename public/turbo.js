import 'https://skypack-1251075901.cos-website.ap-hongkong.myqcloud.com/@hotwired/turbo?min'
import morphdom from 'https://skypack-1251075901.cos-website.ap-hongkong.myqcloud.com/morphdom?min'
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

import OpenReplay from 'https://skypack-1251075901.cos-website.ap-hongkong.myqcloud.com/@openreplay/tracker?min'
import * as Sentry from 'https://skypack-1251075901.cos-website.ap-hongkong.myqcloud.com/@sentry/browser?min'
Sentry.init({
	dsn: "https://6318dba86435427c87869099519ca6e5@o39671.ingest.sentry.io/4505327000158208",
	integrations: [
	  new Sentry.BrowserTracing(),
	  new Sentry.Replay(),
	],
  });
const tracker = new OpenReplay({
	projectKey: '7556503659928888',
	onStart: ({ sessionToken }) => {
	  Sentry.setTag("openReplaySessionToken", sessionToken);
	},
  })
tracker.start();
