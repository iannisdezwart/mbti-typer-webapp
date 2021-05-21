import * as pageCompiler from 'page-compiler'
import { inlineCSS, inlineSVG } from 'page-compiler'

const main = async () => {
	const renderNavbar = () => /* html */ `
	<nav id="navbar">
		<div class="left">
			<div class="navbar-item">
				<a href="/" id="logo-link">
					${ inlineSVG('src/pwa/logo.svg') }
					<span class="logo-link-text">MBTI Typer</span>
				</a>
			</div>
		</div>
		<div class="middle">
			<div class="navbar-item">
				<a href="/test.html">Test</a>
			</div>
			<div class="navbar-item">
				<a href="/learn.html">Learn</a>
			</div>
		</div>
		<div class="right">
			<div class="navbar-item">
				<div id="hamburger-container" onclick="toggleNavbar()">
					${ inlineSVG('src/img/hamburger.svg') }
					${ inlineCSS('src/img/hamburger-transformed.css') }
				</div>
			</div>
		</div>
	</nav>
	`

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
			${ renderNavbar() }
			<div id="page">
				<div id="landing">
					<h1>MBTI Typer</h1>
					<p>Discover your MBTI personality type</p>
				</div>

				<div class="horizontal-list">
					<div class="item">
						<div class="vertical-space-between">
							<div>
								<h2>Take the personality test</h2>
								<p>Find your personality type!</p>
							</div>
							<div>
								<a class="big button" href="/test.html">Test</a>
							</div>
						</div>
					</div>
					<div class="item">
						<div class="vertical-space-between">
							<div>
								<h2>Learn about the types</h2>
								<p>Discover everything about the personality types!</p>
							</div>
							<div>
								<a class="big button" href="#">Learn</a>
							</div>
						</div>
					</div>
				</div>

				<a href="/dev-tools.html" class="big button" style="margin-top: 2rem">Dev tools</a>
			</div>
			`, seo),
			path: '/index.html'
		},
		{
			html: pageShell.render('Type me | MBTI Typer', /* html */ `
			${ renderNavbar() }
			<div id="page">
				<div id="landing">
					<h1>Type me</h1>
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
			html: pageShell.render('Development tools | MBTI Typer', /* html */ `
			<div id="page">
				${ renderNavbar() }
				<h1>Development Tools</h1>
				<a class="big button" onclick="clearCache()">Clear Cache</a>
			</div>
			`, seo),
			path: '/dev-tools.html'
		},
		{
			html: pageShell.render('Offline | MBTI Typer', /* html */ `
			${ renderNavbar() }
			<div id="page">
				<div id="landing">
					<h1>Offline</h1>
					<p>You are currently offline and can't see this page.</p>
				</div>
			`, seo),
			path: '/offline.html'
		}
	])
}

main()