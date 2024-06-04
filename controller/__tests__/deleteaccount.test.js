import React from "react";
import { render } from "@testing-library/react-native";
import {db, deleteUserAccount} from "../FirebaseHandler";
import { getDatabase } from "firebase/database";

jest.mock("../FirebaseHandler", () => ({
    db: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
    collection: jest.fn(),
    doc: jest.fn(),
    delete: jest.fn(),
    getFirestore: jest.fn(),
    }));

jest.mock("firebase/auth", () => ({ 
    getAuth: jest.fn(),
    deleteUser: jest.fn(),
    }));
    
jest.mock("firebase/database", () => ({
    ref: jest.fn(),
    getDatabase: jest.fn(),
    remove: jest.fn(),
    }));

jest.mock("firebase/app", () => ({
    initializeApp: jest.fn(),
    }));

jest.mock("@react-native-async-storage/async-storage", () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    ReactNativeAsyncStorage: jest.fn(),
    }));

describe("deleteUserAccount", () => {
    it("deletes user account", async () => {
        const user = {uid: "123"};
        const auth = require("firebase/auth");
        auth.getAuth.mockReturnValue({currentUser: user});
        await deleteUserAccount();
        expect(auth.deleteUser).toHaveBeenCalled();
    }
    );

});

