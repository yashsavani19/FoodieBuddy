import { doc, getDoc } from "firebase/firestore";
import { searchUsername } from "../DatabaseHandler";
import { AppContext } from "@/context/AppContext";
import { useContext } from "react";

// Mocking the database
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
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

// Create a mock context provider
const MockAppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const mockUserObject = {
    friends: [],
    // other user properties
  };

  const mockAddFriendContext = jest.fn().mockImplementation((newFriend) => {
    mockUserObject.friends.push(newFriend);
    return Promise.resolve(newFriend);
  });

  return (
    <AppContext.Provider value={{ userObject: mockUserObject, addFriendContext: mockAddFriendContext }}>
      {children}
    </AppContext.Provider>
  );
};

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

test("Search for a username", async () => {
  const username = "test";
  const expectedFriend = {
    username: "test",
    uid: "1234",
    profileImageUrl: "test",
  };

  // Mocking the database to return the expected result
  (getDoc as jest.Mock).mockResolvedValue({
    exists: jest.fn().mockReturnValue(true),
    id: "test",
    data: jest.fn().mockReturnValue({
      uid: "1234",
      profileImageUrl: "test",
    }),
  });

  const result = await searchUsername(username);
  console.log(result);
  expect(result).toStrictEqual(expectedFriend);
});

test("Search for a username that does not exist", async () => {
  const username = "test";

  // Mocking the database to return no existing record
  (getDoc as jest.Mock).mockResolvedValue({
    exists: jest.fn().mockReturnValue(false),
  });

  const result = await searchUsername(username);

  expect(result).toBeNull();
});

test("Add friend to user", async () => {
  // add context call to user object and add friend function
  const { userObject, addFriendContext } = useContext(AppContext);

  const newFriend = {
    username: "test",
    uid: "1234",
    profileImageUrl: "test",
  };

  const result = await addFriendContext(newFriend);

  expect(userObject.friends).toContainEqual(newFriend);
});
