import { searchUsername } from "../DatabaseHandler";

// Mocking the database
jest.mock("firebase/firestore", () => ({
  getDoc: jest.fn().mockResolvedValue({
    exists: true,
  }),
}));

jest.mock("firebase/auth", () => ({
  getUser: jest.fn().mockResolvedValue({
    exists: true,
  }),
}));

jest.mock("@/controller/FirebaseHandler", () => ({
  getFirestore: jest.fn().mockResolvedValue({
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    get: jest.fn().mockResolvedValue({
      exists: true,
    }),
  }),
}));

test("Search for a username", async () => {
  const username = "test";
  const result = await searchUsername(username, "");
  expect(result).toBe(null);
});
