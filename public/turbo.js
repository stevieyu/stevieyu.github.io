import 'https://esm.sh/@hotwired/turbo?bundle'
import morphdom from 'https://esm.sh/morphdom?bundle'
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

import OpenReplay from 'https://esm.sh/@openreplay/tracker?bundle'
import * as Sentry from 'https://esm.sh/@sentry/browser?bundle'
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
