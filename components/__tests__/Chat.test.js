import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Chat from "../../components/Chat"; // Adjust the import path
import useOpenAIHandler from "../../controller/OpenAIHandler"; // Adjust the import path

// Mock axios if your `useOpenAIHandler` makes HTTP requests
jest.mock("axios");

// Mock the useContext to provide a controlled context environment
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest
    .fn()
    .mockReturnValue({ localRestaurants: [{ name: "Test Restaurant" }] }),
}));

// Mock your custom hook
jest.mock('../../controller/OpenAIHandler', () => ({
    __esModule: true,
    default: jest.fn(() => ({
      sendMessage: jest.fn().mockResolvedValue("Simulated response"),
      resetMessages: jest.fn(),
      messages: [{ role: "system", content: "Welcome message" }]
    })),
  }));

describe("Chat Component", () => {
  it("renders initial messages", () => {
    console.log(useOpenAIHandler()); // This should log the mocked object
    const { getByText } = render(<Chat />);
    expect(getByText("Welcome message")).toBeTruthy();
  });

//   it("allows users to type and send a message", async () => {
//     const { getByPlaceholderText, getByText } = render(<Chat />);
//     const input = getByPlaceholderText("Type a message...");
//     fireEvent.changeText(input, "Hello, world!");
//     fireEvent.press(getByText("Send")); // Adjust if your send button has different text

//     await waitFor(() => {
//       expect(getByText("Response to Hello, world!")).toBeTruthy();
//     });
//   });

//   it("resets messages when reset button is pressed", () => {
//     const { getByText } = render(<Chat />);
//     fireEvent.press(getByText("Reset")); // Adjust if your reset button has different text or icons
//     expect(getByText("Welcome message")).toBeTruthy(); // Assuming reset brings back the initial message
//   });
});
