import * as pageCompiler from 'page-compiler'

const main = async () => {
	const pageShell = new pageCompiler.PageShell({
		head: /* html */ `
		${ await pageCompiler.importGoogleFont('Ubuntu', [
			{ weight: 300, italic: false },
			{ weight: 400, italic: false },
			{ weight: 700, italic: false }
		]) }
		${
			await pageCompiler.importGoogleFont('Lato', [
				{ weight: 900, italic: false }
			])
		}
		${ pageCompiler.inlineCSS('src/css/index.css') }
		${ pageCompiler.inlineJS('src/js/index.js') }
		${ pageCompiler.importServiceWorker('src/js/service-worker.js') }
		`
	})

	await pageCompiler.createPWAManifest({
		icon: {
			svg: 'src/pwa/logo.svg',
			png: 'src/pwa/logo.png',
			maskableSvg: 'src/pwa/masked-logo.svg',
			maskablePng: 'src/pwa/masked-logo.png'
		},
		name: 'MBTI Typer',
		shortName: 'MBTI Typer',
		backgroundColour: '#4b5378',
		themeColour: '#515980',
		categories: [ 'MBTI', '16 personalities', 'personality types' ],
		description: 'Find your MBTI personality type',
		display: 'standalone',
		lang: 'en-UK',
		orientation: 'portrait-primary',
		startURL: '/'
	}, pageShell)

	const seo = {
		author: 'Iannis de Zwart',
		description: 'Find your MBTI personality type',
		keywords: [ 'MBTI', 'personality type', '16 personalities' ]
	}

	pageCompiler.compilePages([
		{
			html: pageShell.render('MBTI Typer', /* html */ `
			<div id="page">
				<div id="landing">
					<h1>MBTI Typer</h1>
					<p>Discover your MBTI personality type</p>
				</div>

				<div class="horizontal-list">
					<div class="item">
						<h2>Take the test</h2>
						<p>Find your personality type!</p>
						<a class="button" href="/test.html">Test</a>
					</div>
					<div class="item">
						<h2>Learn about the types</h2>
						<p>Discover everything about the personality types!</p>
						<a class="button" href="#">Learn</a>
					</div>
				</div>
			</div>
			`, seo),
			path: '/index.html'
		},
		{
			html: pageShell.render('Type me | MBTI Typer', /* html */ `
			<div id="page">
				<div id="landing">
					<h1><a href="/">MBTI Typer</a> > Type me</h1>
					<p>Find your MBTI personality type</p>
				</div>

				<div class="horizontal-list" id="questionnaire-settings">
					<div class="item">
						<label for="num-of-questions">Number of questions</label>
						<div class="slider">
							<input type="range" min="24" max="80" value="40" step="8" name="num-of-questions" id="num-of-questions">
							<span class="value"></span>
						</div>
					</div>
				</div>

				<div id="questionnaire"></div>

				<div id="results-placeholder"></div>

				${ pageCompiler.inlineJS('src/js/questions.js') }
				${ pageCompiler.inlineJS('src/js/fill-questionnaire.js') }
			</div>
			`, seo),
			path: '/test.html'
		},
		{
			html: pageShell.render('Offline | MBTI Typer', /* html */ `
			<div id="page">
				<div id="landing">
					<h1><a href="/">MBTI Typer</a> > Offline</h1>
					<p>You are currently offline and can't see this page.</p>
				</div>
			`, seo),
			path: '/offline.html'
		}
	])
}

main()