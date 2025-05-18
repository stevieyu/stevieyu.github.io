// import 'https://s.stevie.top/esm.sh/@hotwired/turbo@7.3.0?bundle'
// import morphdom from 'https://s.stevie.top/esm.sh/morphdom@2.7.0?bundle'
// addEventListener("turbo:before-render", (event) => {
// 	event.detail.render = (currentElement, newElement) => {
// 		morphdom(currentElement.querySelector(`.main-frame`), newElement.querySelector(`.main-frame`))
// 		morphdom(currentElement.querySelector(`nav.sidebar`), newElement.querySelector(`nav.sidebar`))
// 		document.querySelector('dialog').click()
// 	}
// })
// addEventListener("turbo:before-visit", (event) => {
// 	const excpReg = /^\/$/
// 	if(excpReg.test(new URL(event.detail.url).pathname) || excpReg.test(location.pathname)){
// 		event.preventDefault()
// 		location.href = event.detail.url
// 	}
// })
// addEventListener('popstate', (event) => {
//     if (event.state) {
// 	Turbo.visit(location.pathname + location.search)
//     }
// });

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

import OpenReplay from 'https://esm.sh/@openreplay/tracker@9.0.8?bundle'
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

// <script>
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init bs ws ge fs capture De calculateEventProperties $s register register_once register_for_session unregister unregister_for_session Is getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty xs Ss createPersonProfile Es gs opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing ys debug ks getPageViewId captureTraceFeedback captureTraceMetric".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    posthog.init('phc_N44KZ70t7Lq5MZxhBF3y8HRk9lJZLnO0iiomKkilY6p', {
        api_host: 'https://us.i.posthog.com',
        person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
    })
// </script>
