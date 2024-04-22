import React from "react";
import { render } from "@testing-library/react-native";
import Message from "@/components/Message";

jest.mock("react-native/Libraries/StyleSheet/StyleSheet", () => {
  const realStyleSheet = jest.requireActual(
    "react-native/Libraries/StyleSheet/StyleSheet"
  );
  return {
    ...realStyleSheet,
    create: jest.fn().mockImplementation((styles) => styles),
    compose: jest
      .fn()
      .mockImplementation((style1, style2) => ({ ...style1, ...style2 })),
  };
});

describe("Message Component", () => {
  it("renders loading state correctly", () => {
    const { getByTestId } = render(<Message type="loading" />);
    expect(getByTestId("loading-view")).toBeTruthy();
  });

  it("renders suggestion message correctly", () => {
    const suggestionText = "Explore local cuisines!";
    const { getByText } = render(
      <Message type="suggestion" text={suggestionText} />
    );
    expect(getByText(`Restaurant info panel: ${suggestionText}`)).toBeTruthy();
  });

  it('renders sent message correctly', () => {
    const text = "Hello World!";
    const { getByTestId } = render(<Message type="sent" text={text} />);
    expect(getByTestId("sentTextBox").props.style).toEqual({
      backgroundColor: "#3464ac",
      borderRadius: 15,
      borderBottomEndRadius: 3,
      padding: 10
    });
  });
  

  it("renders received message with image correctly", () => {
    const text = "See you soon!";
    const imageUrl = { uri: "@/assets/images/buddy-icon.png" };
    const { getByText, getByTestId } = render(
      <Message type="received" text={text} imageUrl={imageUrl} />
    );
    expect(getByText(text)).toBeTruthy();
    expect(getByTestId("message-image").props.source).toEqual(imageUrl);
  });
});

const styles = {
  messageContainer: {
    flexDirection: "row",
    padding: 0,
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 5,
    marginVertical: 10,
  },
  sentTextBox: {
    backgroundColor: "#3464ac",
    borderRadius: 15,
    borderBottomEndRadius: 3,
    padding: 10,
  },
  receivedTextBox: {
    backgroundColor: "#363232",
    borderRadius: 15,
    borderBottomStartRadius: 3,
    padding: 10,
    flexDirection: "row",
  },
  text: {
    color: "white",
    fontSize: 16,
  },
  suggestionText: {
    color: "black",
    fontSize: 16,
  },
  sentMessage: {
    justifyContent: "flex-end",
    marginLeft: 100,
  },
  receivedMessage: {
    marginRight: 100,
  },
  loading: {
    backgroundColor: "white",
    borderRadius: 8,
    margin: 3,
    width: 8,
    height: 8,
  },
};
