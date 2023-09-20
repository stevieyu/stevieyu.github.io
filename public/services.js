import 'https://esm.sh/@hotwired/turbo@7.3.0?bundle'
import morphdom from 'https://esm.sh/morphdom@2.7.0?bundle'
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
addEventListener('popstate', (event) => {
    if (event.state) {
	Turbo.visit(location.pathname + location.search)
    }
});

import OpenReplay from 'https://esm.sh/@openreplay/tracker@9.0.8?bundle'
import * as Sentry from 'https://esm.sh/@sentry/browser@7.69.0?bundle'
Sentry.init({
	dsn: "https://bf0874f6948140d284dd2ac1e20430b5@o39671.ingest.sentry.io/4505606641745920",
	integrations: [
	  new Sentry.BrowserTracing({
	      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
	    //   tracePropagationTargets: ["localhost", "https:yourserver.io/api/"],
	  }),
	  new Sentry.Replay(),
	],
	// Performance Monitoring
	tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
	// Session Replay
	replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
	replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
const tracker = new OpenReplay({
	projectKey: '7556503659928888',
	onStart: ({ sessionToken }) => {
	  Sentry.setTag("openReplaySessionToken", sessionToken);
	},
  })
tracker.start();
