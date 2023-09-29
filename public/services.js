import 'https://s.stevie.top/esm.sh/@hotwired/turbo@7.3.0?bundle'
import morphdom from 'https://s.stevie.top/esm.sh/morphdom@2.7.0?bundle'
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

import * as Sentry from 'https://s.stevie.top/esm.sh/@sentry/browser@7.69.0?bundle'
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

import OpenReplay from 'https://s.stevie.top/esm.sh/@openreplay/tracker@9.0.8?bundle'
const tracker = new OpenReplay({
	projectKey: '7556503659928888',
	onStart: ({ sessionToken }) => {
		Sentry.setTag("openReplaySessionToken", sessionToken);
	},
})
tracker.start();


// <script>
//dgjx126
	var _hmt = _hmt || [];
	(function() {
	var hm = document.createElement("script");
	hm.src = "https://hm.baidu.com/hm.js?21b81ead291a8ae69599f1c368a3e5ad";
	var s = document.getElementsByTagName("script")[0];
	s.parentNode.insertBefore(hm, s);
})();
// </script>
// <script type="text/javascript">
//clarity.microsoft.com
	(function(c,l,a,r,i,t,y){
	c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
	t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
	y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "fcxij3wbq5");
// </script>

// <script>
	//webpushr
	(function(w,d, s, id) {if(typeof(w.webpushr)!=='undefined') return;w.webpushr=w.webpushr||function(){(w.webpushr.q=w.webpushr.q||[]).push(arguments)};var js, fjs = d.getElementsByTagName(s)[0];js = d.createElement(s); js.id = id;js.async=1;js.src = "https://cdn.webpushr.com/app.min.js";fjs.parentNode.appendChild(js);}(window,document, 'script', 'webpushr-jssdk'));webpushr('setup',{'key':'BOH2aA3F97cQ6biSlCcnCKviTPtVFMYPV_r4jA-ree7I39QR3M5yTz_bkhIVV8yjWkmsEFmZSA92-zvYkZoGL0o' });
// </script>

