const data = [
	{ id: 1, title: "Mathematics", icon: "📐", color: "#03A9F4" },
	{ id: 2, title: "Life Science", icon: "🌱", color: "#4CAF50" },
	{ id: 3, title: "Physical Science", icon: "🔬", color: "#E91E63" },
];

export async function GET(request: Request) {
	console.log("requested");
	return new Response(JSON.stringify(data), {
		headers: {
			"Content-Type": "application/json",
		},
	});
}
