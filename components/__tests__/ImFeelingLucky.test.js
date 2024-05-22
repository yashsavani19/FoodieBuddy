import { render, fireEvent } from "@testing-library/react-native";
import ImFeelingLucky from "../ImFeelingLucky";

// describe("ImFeelingLucky Component", () => {
//   it("Button renders correctly", () => {
//     const tree = render(<ImFeelingLucky />).toJSON();
//     expect(tree).toBeOnTheScreen();
//   });

//   it("renders the correct style", () => {
//     const { getByTestId } = render(<ImFeelingLucky />);
//     expect(getByTestId("lucky-button").props.style).toEqual({
//       // styles to be tested
//     });
//   });
// });

// Test to see if a random restaurant is selected
test("ImFeelingLucky button press", () => {
  const { getByTestId } = render(<ImFeelingLucky />);
  fireEvent.press(getByTestId("lucky-button"));

  // Check if a restaurant is selected (returned restaurant not null)
  expect(getByTestId("selected-restaurant")).toBeTruthy();
});
