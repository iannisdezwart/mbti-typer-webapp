// 10 questions per factor

type QuestionList = [
	string, string, string, string, string,
	string, string, string, string, string
]

interface Questions {
	Fe: QuestionList
	Fi: QuestionList
	Te: QuestionList
	Ti: QuestionList
	Se: QuestionList
	Si: QuestionList
	Ne: QuestionList
	Ni: QuestionList
}

const questions: Questions = {
	Se: [
		`I prefer enjoying what is happening right now to thinking over the past and future.`,
		`I fear missing out on current enjoyments and possibilities.`,
		`I quickly notice opportunities that others miss.`,
		`I prefer to see situations without judging them.`,
		`I'm rather practical when it comes to learning. I prefer to learn through experience and hands-on application. Learning is doing.`,
		`Talk is cheap. Actions are valueable.`,
		`I am stimulated by physical challenges and can sometimes even take physical risks.`,
		`I prefer to let life do its thing. I don't try to micro-manage or fully control life.`,
		`I like to fully immerse myself in the sensations around me`,
		`When I talk about a past experience, I try to recite all facts in a sequential order.`
	],

	Si: [
		`I compare and contrast a lot. I can notice quickly when a current experience does not line up with something from the past.`,
		`I enjoy recalling and reliving favourite past experiences.`,
		`I rarely repeat the same mistakes.`,
		`I remember past events in vivid detail.`,
		`I quickly notice when something was rearranged.`,
		`I like to do things in systematic order.`,
		`I prefer conversations that have an practical purpose. Philosofical conversations are boring.`,
		`I like noticing details in events and relationships.`,
		`When I talk about a past experience, I recite the most important facts in what sometimes seems like a random order.`,
		`I possess a very detailed internal map of past memories.`,
	],

	Ne: [
		`I am driven by possibility. "What possibility does this hold?" "What new things could I do with this?"`,
		`I like making mistakes, because I will learn new things and explore new possibilities.`,
		`I am focussed on the possibilities the future holds. Sometimes I lose sight of the present.`,
		`Everything is connected in my mind. I am constantly placing new information in a spiderweb of connections.`,
		`I like to brainstorm with people to generate new possibilities and innovative ideas.`,
		`I am lost in thoughts of theoretical possibilities. I lose track of the outside world.`,
		`I dislike narrowing down possibilities and get indecisive if I have to.`,
		`I see potential everywhere. New possibilities and innovative thoughts keep coming.`,
		`I like to change, reinvent and experiment with the external world in order to find new and interesting ideas.`,
		`I like to be free to explore new opportunities in my life.`,
	],

	Ni: [
		`I am driven by inspiration that seems to come from nowhere.`,
		`I like abstract, theoretical conversations.`,
		`I constantly ask myself "why?". I want to get to the innermost level of knowledge.`,
		`I need time alone to give freedom to my mind and gain insights.`,
		`I use my senses to gather clues about the meaning of things and relations.`,
		`I get lost in meanings and abstractions. I lose track of the concrete and physical details around me.`,
		`I struggle explaining intuitions from my inner world to the outer world.`,
		`I trust my gut instincts.`,
		`I often intuitively know and understand something, without being able to put it in words.`,
		`I use my inner undestanding of how things and concepts fit together to help me understand how things work.`,
	],

	Te: [
		`I like to instruct and organise people to efficiently get the job done. I can seem a little bossy.`,
		`I dislike procrastination. When I get an idea, I want to get it done straight away.`,
		`My inner feelings should not be reflected in my decisions. This will result in biased decisions and makes things unfair for others.`,
		`Thinking out loud helps me to process my decisions.`,
		`I like to live in an organised outer world. This way I can think more clearly.`,
		`Being prepared for everything is important. I create plans for unforseen things.`,
		`I am decisive. I can form a conclusions based on small amounts of information.`,
		`I like to work with to-do-lists, charts, or spreadsheets to plan and organise my time.`,
		`I need to work with competent people when I'm doing team work.`,
		`I'm good at laying out methods for others to complete tasks in time and resource-efficient ways.`,
	],

	Ti: [
		`I prefer to stay objective. Emotions lead to biases. Therefore I like to detach myself from a situation before analysing it.`,
		`I make my decisions internally. I don't tell others about everything I decide.`,
		`I need to understand something in my own way. I prefer to do my own research to just sticking with universal truths.`,
		`I like to speak accurately. I dislike generalised statements that do not fit in the situation.`,
		`I dislike being rushed to decide. I must look at every angle of the problem before making a decision.`,
		`I like organising my inner thoughts and truths`,
		`I like to see a problem from different perspectives. I can easily play the devil's advocate.`,
		`I am very independent. I dislike pre-established structures and routines. I want to get things done in my way.`,
		`I might seem disorganised from the outside, but I am organised very well from the inside.`,
		`I struggle to explain personal decisions. It is hard to get my thoughts into words.`,
	],

	Fe: [
		`I am very aware of expectations and needs of a group. I can easily adapt to desired behaviour.`,
		`Sometimes it is not what I want, but what others want, that is more important.`,
		`I dislike conflict. I try to solve conflicts and create peace by searching for compromises.`,
		`In order to maintain or establish relationships with other people, I act to meet their needs.`,
		`I find it hard to give critisism. I worry about the impact of my words and dislike to make others feel bad about themselves.`,
		`I like to talk out and discuss decisions.`,
		`I often ask myself whether or not something is good and about possible impacts on others.`,
		`I empathise easily. I pick up emotions of people around me. Other people's emotions can influence mine easily.`,
		`I want to arrange things in such a way that it makes everyone comfortable.`,
		`I feel responsible for other people's feelings. It is my duty to give them warmth, compassion and kindness.`,
	],

	Fi: [
		`Authenticity is important. I want to be myself. I dislike social nicities and small talk.`,
		`I notice quickly when something is out of line with my personal values`,
		`I only share deep feelings with my closest and most trusted people.`,
		`I dislike showing negative emotions. I don't want to cry in front of people.`,
		`I don't care about how society says I should look like. I prefer unique styles.`,
		`Everyone has their own values. I dislike manipulating others' values with my values.`,
		`I have strong convictions and core beliefs that remain true no matter what.`,
		`I don't like to share everything about myself. People find me mysterious or enigmatic.`,
		`I dislike being critisised because it makes me feel bad about myself.`,
		`I am good at picking up other people's feelings, but I don't get influenced easily by them.`,
	]
}