import { Restaurant } from "@/model/Restaurant";
import {
  storeRecommendedRestaurants,
  clearRecommendedRestaurants,
} from "../DatabaseHandler";
import { db } from "../FirebaseHandler";
import { initializeApp } from "firebase/app";
import { collection, addDoc, getDocs, deleteDoc, getFirestore } from "firebase/firestore";

jest.mock("../FirebaseHandler", () => ({
  db: jest.fn(),
}));

// Mock Firestore functions
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
  deleteDoc: jest.fn(),
  getFirestore: jest.fn(),
}));

jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
}));

// Mock the alert function
global.alert = jest.fn();

describe("Buddy Recommended Database Functions", () => {
  const chatRoomId = "testChatRoomId";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should store recommended restaurants", async () => {
    const recommendedRestaurants = [
      { id: "1", name: "Restaurant 1" } as Restaurant,
      { id: "2", name: "Restaurant 2" } as Restaurant,
    ];

    // Mock implementation for addDoc
    (addDoc as jest.Mock).mockResolvedValueOnce({});
    (collection as jest.Mock).mockReturnValueOnce({});

    const result = await storeRecommendedRestaurants(
      chatRoomId,
      recommendedRestaurants
    );
    expect(result).toBe(true);
    expect(addDoc).toHaveBeenCalledTimes(recommendedRestaurants.length);
  });

  it("should clear recommended restaurants", async () => {
    const mockDoc = { ref: {} };
    // Mock implementation for getDocs and deleteDoc
    (getDocs as jest.Mock).mockResolvedValueOnce({
      forEach: (cb: (doc: any) => void) => [mockDoc].forEach(cb),
    });
    (deleteDoc as jest.Mock).mockResolvedValueOnce({});

    const result = await clearRecommendedRestaurants(chatRoomId);
    expect(result).toBe(true);
    expect(deleteDoc).toHaveBeenCalledTimes(1);
  });
});
