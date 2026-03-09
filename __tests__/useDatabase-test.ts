import { database } from "../hooks/useDatabase";
global.fetch = jest.fn();

test("getCourses calls correct endpoint", async () => {
	(fetch as jest.Mock).mockResolvedValue({
		ok: true,
		json: async () => [{ id: 1 }],
	});

	const result = await database.getCourses();

	expect(fetch).toHaveBeenCalledWith("/api/courses");
	expect(result).toEqual([{ id: 1 }]);
});
