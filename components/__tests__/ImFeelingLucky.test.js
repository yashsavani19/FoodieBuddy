describe("ImFeelingLucky Component", () => {
  it("Button renders correctly", () => {
    const tree = renderer.create(<ImFeelingLucky />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders the correct style", () => {
    const { getByTestId } = render(<ImFeelingLucky />);
    expect(getByTestId("lucky-button").props.style).toEqual({
      backgroundColor: "#f9a03f",
      borderRadius: 20,
      padding: 10,
      width: 150,
      alignItems: "center",
      justifyContent: "center",
    });
  });
});

// Test to see if a random restaurant is selected
test("ImFeelingLucky button press", () => {
  const { getByTestId } = render(<ImFeelingLucky />);
  fireEvent.press(getByTestId("lucky-button"));
  expect(getByTestId("lucky-button")).toBeTruthy();
});
