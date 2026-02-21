const data = [
	{
		id: "math-alg-fc-1",
		title: "Algebra Fundamentals",
		color: "#03A9F4",
		icon: "📝",
		completion: 0.5,
		course: "Mathematics",
	},
	{
		id: "math-cal-fc-2",
		title: "Calculus Essentials",
		color: "#E91E63",
		icon: "⚖️",
		completion: 0.8,
		course: "Mathematics",
	},
	{
		id: "math-stat-fc-3",
		title: "Statistical Analysis",
		color: "#4F51CA",
		icon: "📊",
		completion: 0.9,
		course: "Mathematics",
	},
	{
		id: "ls-gen-fc-1",
		title: "Genetics Basics",
		color: "#4CAF50",
		icon: "🐝",
		completion: 0.8,
		course: "Life Science",
	},
	{
		id: "ls-evo-fc-2",
		title: "Evolutionary Processes",
		color: "#9C27B0",
		icon: "🦖",
		completion: 0.7,
		course: "Life Science",
	},
	{
		id: "ls-bio-fc-3",
		title: "Biochemical Reactions",
		color: "#8BC34A",
		icon: "🔬",
		completion: 0.9,
		course: "Life Science",
	},
];

export async function GET(request: Request) {
	return new Response(JSON.stringify(data), {
		headers: {
			"Content-Type": "application/json",
		},
	});
}
