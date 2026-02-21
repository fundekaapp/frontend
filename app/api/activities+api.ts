const data = [
	{
		id: "ls-gen-l-1",
		type: "lesson",
		title: "Genetics Basics",
		color: "#4CAF50",
		icon: "🐝",
		completion: 0.8,
		course: "Life Science",
	},
	{
		id: "ls-evo-q-2",
		type: "quiz",
		title: "Evolutionary Processes Quiz",
		color: "#9C27B0",
		icon: "🦖",
		completion: 0.7,
		course: "Life Science",
	},
	{
		id: "ls-bio-fc-3",
		type: "flashcards",
		title: "Biochemical Reactions Flashcards",
		color: "#8BC34A",
		icon: "🔬",
		completion: 0.9,
		course: "Life Science",
	},
	{
		id: "math-alg-l-1",
		type: "lesson",
		title: "Algebra Fundamentals",
		color: "#03A9F4",
		icon: "📝",
		completion: 0.5,
		course: "Mathematics",
	},
	{
		id: "math-cal-q-2",
		type: "quiz",
		title: "Calculus Essentials Quiz",
		color: "#E91E63",
		icon: "⚖️",
		completion: 0.8,
		course: "Mathematics",
	},
	{
		id: "math-stat-fc-3",
		type: "flashcards",
		title: "Statistical Analysis Flashcards",
		color: "#4F51CA",
		icon: "📊",
		completion: 0.9,
		course: "Mathematics",
	},
];

export async function GET(request: Request) {
	return new Response(JSON.stringify(data), {
		headers: {
			"Content-Type": "application/json",
		},
	});
}
