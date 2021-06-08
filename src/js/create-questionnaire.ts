interface Questions {
	Fe: string[]
	Fi: string[]
	Te: string[]
	Ti: string[]
	Se: string[]
	Si: string[]
	Ne: string[]
	Ni: string[]
}

interface QuestionnaireParams {
	cognitiveFunctionsDescription: string
	typeDescription: string
	questions: Questions
	questionsPerCognitiveFunction: number
	minDisplayedQuestionsPerCognitiveFunction: number
	defaultDisplayedQuestionsPerCognitiveFunction: number
	fullyAgreeText: string
	agreeText: string
	slightlyAgreeText: string
	neutralText: string
	slightlyDisagreeText: string
	disagreeText: string
	fullyDisagreeText: string
}

const createQuestionnaire = (params: QuestionnaireParams) => {
	type CognitiveFunction = 'Fe' | 'Fi' | 'Te' | 'Ti' | 'Se' | 'Si' | 'Ne' | 'Ni'
	const cognitiveFunctions: CognitiveFunction[] = [
		'Fe', 'Fi', 'Te', 'Ti', 'Se', 'Si', 'Ne', 'Ni'
	]

	type MBTIType = [ CognitiveFunction, CognitiveFunction,
		CognitiveFunction, CognitiveFunction ]

	const MBTITypes: {
		[ name: string ]: MBTIType
	} = {
		ENFJ: [ 'Fe', 'Ni', 'Se', 'Ti' ],
		ESFJ: [ 'Fe', 'Si', 'Ne', 'Ti' ],
		ENFP: [ 'Ne', 'Fi', 'Te', 'Si' ],
		ENTP: [ 'Ne', 'Ti', 'Fe', 'Si' ],
		ENTJ: [ 'Te', 'Ni', 'Se', 'Fi' ],
		ESTJ: [ 'Te', 'Si', 'Ne', 'Fi' ],
		ESFP: [ 'Se', 'Fi', 'Te', 'Ni' ],
		ESTP: [ 'Se', 'Ti', 'Fe', 'Ni' ],
		INFJ: [ 'Ni', 'Fe', 'Ti', 'Se' ],
		ISFJ: [ 'Si', 'Fe', 'Ti', 'Ne' ],
		INFP: [ 'Fi', 'Ne', 'Si', 'Te' ],
		INTP: [ 'Ti', 'Ne', 'Si', 'Fe' ],
		INTJ: [ 'Ni', 'Te', 'Fi', 'Se' ],
		ISTJ: [ 'Si', 'Te', 'Fi', 'Ne' ],
		ISFP: [ 'Fi', 'Se', 'Ni', 'Te' ],
		ISTP: [ 'Ti', 'Se', 'Ni', 'Fe' ]
	}

	interface Question {
		statement: string
		cognitiveFunction: CognitiveFunction
		index: number
	}

	class CognitiveFunctionsResult {
		Fe = 0
		Fi = 0
		Te = 0
		Ti = 0
		Se = 0
		Si = 0
		Ne = 0
		Ni = 0
	}

	const {
		questions, cognitiveFunctionsDescription, typeDescription,
		questionsPerCognitiveFunction, minDisplayedQuestionsPerCognitiveFunction,
		defaultDisplayedQuestionsPerCognitiveFunction,
		fullyAgreeText, agreeText, slightlyAgreeText, neutralText,
		slightlyDisagreeText, disagreeText, fullyDisagreeText
	} = params

	const createQuestion = (question: Question) => /* html */ `
	<div class="question" data-cognitive-function="${ question.cognitiveFunction }" data-index="${ question.index }">
		<h3 class="statement">${ question.statement }</h3>
		<div class="answers">
			<div class="answer agree-3" title="${ fullyAgreeText }"></div>
			<div class="answer agree-2" title="${ agreeText }"></div>
			<div class="answer agree-1" title="${ slightlyAgreeText }"></div>
			<div class="answer neutral" title="${ neutralText }"></div>
			<div class="answer disagree-1" title="${ slightlyDisagreeText }"></div>
			<div class="answer disagree-2" title="${ disagreeText }"></div>
			<div class="answer disagree-3" title="${ fullyDisagreeText }"></div>
		</div>
		<div class="answers-keys">
			<span>${ fullyAgreeText }</span>
			<span>${ fullyDisagreeText }</span>
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

	const addCurrentSetToResults = (results: CognitiveFunctionsResult) => {
		const answerLists = document.querySelectorAll<HTMLDivElement>('.answers')

		for (let i = 0; i < answerLists.length; i++) {
			const answerList = answerLists[i]
			const selected = answerList.querySelector<HTMLDivElement>('.selected')
			const cognitiveFunction = answerList.parentElement.getAttribute('data-cognitive-function')
			const score = scoreByAnswer(selected)

			results[cognitiveFunction] += score
		}
	}

	const matchTypes = (result: CognitiveFunctionsResult) => {
		const matchingResults = Object.keys(MBTITypes).map(type => {
			const cognitiveFunctionList = MBTITypes[type]
			const maxScore = +numOfQuestionsSlider.value / 8 * 3

			const dominantResult = result[cognitiveFunctionList[0]] / maxScore
			const auxiliaryResult = result[cognitiveFunctionList[1]] / maxScore
			const tertiaryResult = result[cognitiveFunctionList[2]] / maxScore
			const inferiorResult = result[cognitiveFunctionList[3]] / maxScore

			const dominantExpected = 1
			const auxiliaryExpected = 5 / 7
			const tertiaryExpected = 3 / 7
			const inferiorExpected = 1 / 7

			const dominantDiff = (dominantExpected - dominantResult) ** 2
			const auxiliaryDiff = (auxiliaryExpected - auxiliaryResult) ** 2
			const tertiaryDiff = (tertiaryExpected - tertiaryResult) ** 2
			const inferiorDiff = (inferiorExpected - inferiorResult) ** 2

			const diff = dominantDiff * 0.55
				+ auxiliaryDiff * 0.40
				+ tertiaryDiff * 0.10
				+ inferiorDiff * 0.05

			return { type, diff }
		}).sort((a, b) => a.diff - b.diff)

		return matchingResults
	}

	const registerOnClickEvents = (
		results: CognitiveFunctionsResult,
		nextCallback: () => void
	) => {
		const answerButtonOnClickHandler = (button: HTMLDivElement) => {
			const parent = button.parentElement as HTMLDivElement
			const children = parent.children as HTMLCollectionOf<HTMLDivElement>

			for (const child of children) {
				child.classList.remove('selected')
			}

			button.classList.add('selected')
		}

		const answerButtons = document.querySelectorAll<HTMLDivElement>('.answer')

		for (const answerButton of answerButtons) {
			answerButton.addEventListener('click', () => answerButtonOnClickHandler(answerButton))
		}

		const nextButton = document.querySelector<HTMLButtonElement>('#next')

		nextButton.addEventListener('click', () => {
			if (!allQuestionsAnswered()) {
				new Popup({
					title: 'Not all questions were filled in',
					description: 'Please fill in all questions'
				})

				return
			}

			addCurrentSetToResults(results)
			nextCallback()
		})
	}

	interface GeneratedQuestionSet {
		questionSet: Question[]
		lastSet: boolean
		progress: number
	}

	const createQuestionSetGenerator = function * (questions: Question[], questionsPerSet: number) {
		for (let i = 0; i < questions.length; i += questionsPerSet) {
			yield {
				questionSet: questions.slice(i, i + questionsPerSet),
				lastSet: i + questionsPerSet >= questions.length,
				progress: i / questions.length
			}
		}
	}

	const showResults = (questionnaire: HTMLDivElement, results: CognitiveFunctionsResult) => {
		const maxScore = +numOfQuestionsSlider.value / 8 * 3

		const computeScorePercentage = (score: number) => {
			return score / maxScore * 50 + 50
		}

		const typesResult = matchTypes(results)

		const resultArr = cognitiveFunctions.map(cognitiveFunction => ({
			cognitiveFunction,
			score: results[cognitiveFunction]
		}))

		resultArr.sort((a, b) => b.score - a.score)

		questionnaire.innerHTML = /* html */ `
		<div id="results">
			<h1>Results</h1>
			<p>${ cognitiveFunctionsDescription }</p>
			${
				resultArr.map(result => /* html */ `
				<div class="result-line">
					<div class="cognitive-function">${ result.cognitiveFunction }</div>
					<div class="progress-bar">
						<div class="progress" style="max-width: ${ computeScorePercentage(result.score) }%"></div>
					</div>
					<span class="score">${ result.score }</span>
				</div>
				`).join('')
			}
			<p>${ typeDescription }</p>
			<div class="types-list">
				${
					typesResult.map(typeResult => /* html */ `
					<div class="result-line">
						<div class="mbti-type">${ typeResult.type }</div>
						<span class="difference">Difference: ${ typeResult.diff.toFixed(3) }</span>
					</div>
					`).join('')
				}
				<a class="expand button">See all</a>
			</div>
		</div>
		`

		const typesList = questionnaire.querySelector('.types-list')
		const expandButton = typesList.querySelector('.expand.button')

		expandButton.addEventListener('click', () => {
			typesList.classList.add('opened')
			expandButton.remove()
		})
	}

	const renderQuestions = (
		questionnaire: HTMLDivElement,
		questions: Question[],
		results: CognitiveFunctionsResult,
		lastSet: boolean
	) => new Promise<void>(resolve => {
		// Render questionnaire

		questionnaire.innerHTML =
		questions.map(createQuestion).join('')
		+ (lastSet ? /* html */ `
		<button id="next" class="big button">Submit</button>
		` : /* html */ `
		<button id="next" class="big button">Next</button>
		`)

		registerOnClickEvents(results, resolve)
	})

	const startQuestionnaire = async (numOfQuestions: number) => {
		const questionnaire = document.querySelector<HTMLDivElement>('#questionnaire')

		// Prepare questions

		const displayedQuestions: Question[] = []

		for (const cognitiveFunction of cognitiveFunctions) {
			const questionList = questions[cognitiveFunction] as string[]
			questionList.sort(() => 2 * Math.round(Math.random()) - 1)

			for (let i = 0; i < numOfQuestions / 8 && i < questionsPerCognitiveFunction; i++) {
				const statement = questionList[i]
				displayedQuestions.push({ statement, cognitiveFunction: cognitiveFunction, index: i })
			}
		}

		// Shuffle questions

		displayedQuestions.sort(() => 2 * Math.round(Math.random()) - 1)

		// Keep track of results

		const results = new CognitiveFunctionsResult()

		// Add question progress bar

		document.body.insertAdjacentHTML('beforeend', /* html */ `
		<div id="question-progress" class="progress-bar">
			<div class="progress"></div>
		</div>
		`)

		const questionProgress = document.querySelector<HTMLDivElement>('#question-progress .progress')

		// Generate questions

		const questionSetGenerator = createQuestionSetGenerator(displayedQuestions, 8)

		while (true) {
			const { questionSet, lastSet, progress } = questionSetGenerator.next().value as GeneratedQuestionSet

			// Update progress bar

			questionProgress.style.maxWidth = `${ progress * 100 }%`

			// Render questions and wait until they have been submitted

			await renderQuestions(questionnaire, questionSet, results, lastSet)

			// Scroll up

			location.hash = ''
			location.hash = 'questionnaire'

			if (lastSet) break
		}

		// Show results

		showResults(questionnaire, results)

		// Update progress bar

		questionProgress.style.maxWidth = `100%`

		setTimeout(() => {
			questionProgress.parentElement.classList.add('invisible')

			setTimeout(() => {
				questionProgress.parentElement.remove()
			}, 300)
		}, 500)
	}

	// Create questionnaire HTML structure

	const minQ = 8 * minDisplayedQuestionsPerCognitiveFunction
	const maxQ = 8 * questionsPerCognitiveFunction
	const defaultQ = 8 * defaultDisplayedQuestionsPerCognitiveFunction

	document.querySelector<HTMLDivElement>('#questionnaire-placeholder').innerHTML = /* html */ `
	<div class="horizontal-list" id="questionnaire-settings">
		<div class="item">
			<label for="num-of-questions">Number of questions</label>
			<div class="slider">
				<input type="range" min="${ minQ }" max="${ maxQ }" value="${ defaultQ }"
					step="8" name="num-of-questions" id="num-of-questions">
				<span class="value"></span>
			</div>
		</div>
	</div>

	<div id="questionnaire"></div>

	<div id="results-placeholder"></div>
	`

	// Restart questionnaire whenever the selected number of questions changes

	const numOfQuestionsSlider = document.querySelector<HTMLInputElement>('#num-of-questions')

	numOfQuestionsSlider.addEventListener('change',
		() => startQuestionnaire(+numOfQuestionsSlider.value)
	)

	// Start questionnaire

	startQuestionnaire(+numOfQuestionsSlider.value)
}