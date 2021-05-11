(() => {
	interface Question {
		statement: string
		factor: Factor
		index: number
	}

	class Result {
		Fe = 0
		Fi = 0
		Te = 0
		Ti = 0
		Se = 0
		Si = 0
		Ne = 0
		Ni = 0
	}

	const createQuestion = (question: Question) => /* html */ `
	<div class="question" data-factor="${ question.factor }" data-index="${ question.index }">
		<h3 class="statement">${ question.statement }</h3>
		<div class="answers">
			<div class="answer just-like-me" title="Just like me"></div>
			<div class="answer like-me" title="Like me"></div>
			<div class="answer slightly-like-me" title="Slightly like me"></div>
			<div class="answer neutral" title="Neutral"></div>
			<div class="answer not-really-me" title="Not really me"></div>
			<div class="answer not-me" title="Not me"></div>
			<div class="answer not-me-at-all" title="Not me at all"></div>
		</div>
		<div class="answers-keys">
			<span>Just like me</span>
			<span>Not me at all</span>
		</div>
	</div>
	<div class="seperator"></div>
	`

	const allQuestionsAnswered = () => {
		const answerLists = document.querySelectorAll<HTMLDivElement>('.answers')

		for (const answerList of answerLists) {
			const selected = answerList.querySelector('.selected')
			if (selected == null) return false
		}

		return true
	}

	const scoreByAnswer = (answer: HTMLDivElement) => {
		if (answer.classList.contains('just-like-me')) return 3
		if (answer.classList.contains('like-me')) return 2
		if (answer.classList.contains('slightly-like-me')) return 1
		if (answer.classList.contains('neutral')) return 0
		if (answer.classList.contains('not-really-me')) return -1
		if (answer.classList.contains('not-me')) return -2
		if (answer.classList.contains('not-me-at-all')) return -3
	}

	const computeResult = () => {
		const answerLists = document.querySelectorAll<HTMLDivElement>('.answers')
		const result = new Result()

		for (let i = 0; i < answerLists.length; i++) {
			const answerList = answerLists[i]
			const selected = answerList.querySelector<HTMLDivElement>('.selected')
			const factor = answerList.parentElement.getAttribute('data-factor')
			const score = scoreByAnswer(selected)

			result[factor] += score
		}

		return result
	}

	const registerOnClickEvents = () => {
		const answerButtonOnClickHandler = (button: HTMLDivElement) => {
			const parent = button.parentElement as HTMLDivElement
			const children = parent.children as HTMLCollectionOf<HTMLDivElement>

			for (const child of children) {
				child.classList.remove('selected')
			}

			button.classList.add('selected')
		}

		const submitButtonOnClickHandler = () => {
			if (!allQuestionsAnswered()) {
				new Popup({
					title: 'Not all questions were filled in',
					description: 'Please fill in all questions'
				})

				return
			}

			const maxScore = +numOfQuestionsSlider.value

			const computeScorePercentage = (score: number) => {
				return score / maxScore * 50 + 50
			}

			const resultObj = computeResult()
			const resultsPlaceholderEl = document.querySelector<HTMLDivElement>('#results-placeholder')
			const resultArr = factors.map(factor => ({ factor, score: resultObj[factor] }))

			resultArr.sort((a, b) => b.score - a.score)

			resultsPlaceholderEl.innerHTML = /* html */ `
			<div id="results">
				<h1>Results</h1>
				<p>These are your cognitive functions ordered by usage:</p>
				${
					resultArr.map(result => /* html */ `
					<div class="result-line">
						<div class="cognitive-function">${ result.factor }</div>
						<div class="progress-bar">
							<div class="progress" style="width: ${ computeScorePercentage(result.score) }%"></div>
						</div>
						<span class="score">${ result.score }</span>
					</div>
					`).join('')
				}
			</div>
			`

			location.hash = ''
			location.hash = 'results'
		}

		const answerButtons = document.querySelectorAll<HTMLDivElement>('.answer')

		for (const answerButton of answerButtons) {
			answerButton.addEventListener('click', () => answerButtonOnClickHandler(answerButton))
		}

		const submitButton = document.querySelector<HTMLButtonElement>('#submit-questionnaire')
		submitButton.addEventListener('click', () => submitButtonOnClickHandler())
	}

	const renderQuestions = (numOfQuestions: number) => {
		const questionnaire = document.querySelector('#questionnaire')

		// Prepare questions

		const displayedQuestions: Question[] = []

		for (const factor of factors) {
			const questionList = questions[factor] as QuestionList

			for (let i = 0; i < numOfQuestions / 8 && i < questionList.length; i++) {
				const statement = questionList[i]
				displayedQuestions.push({ statement, factor, index: i })
			}
		}

		// Shuffle questions

		displayedQuestions.sort(() => 2 * Math.round(Math.random()) - 1)

		// Render questionnaire

		questionnaire.innerHTML = /* html */ `
		${ displayedQuestions.map(question => createQuestion(question)).join('') }
		<button id="submit-questionnaire" class="big button">Submit</button>
		`

		registerOnClickEvents()
	}

	// Rerender questions whenever the selected number of questions changes

	const numOfQuestionsSlider = document.querySelector<HTMLInputElement>('#num-of-questions')

	numOfQuestionsSlider.addEventListener('change',
		() => renderQuestions(+numOfQuestionsSlider.value)
	)

	// Render questions

	renderQuestions(+numOfQuestionsSlider.value)
})()
