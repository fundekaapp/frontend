import { render } from "@testing-library/react-native";
import CourseCard from "../course-card";

const course = { title: "Mathematics", icon: "📐", color: "#03A9F4" };
describe("<CourseCard />", () => {
	test("It renders Correctly", () => {
		const tree = render(<CourseCard {...course} />).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
