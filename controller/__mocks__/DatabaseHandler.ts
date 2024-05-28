// src/__mocks__/DatabaseHandler.ts
export const searchUsername = jest.fn((username) => {
    return username === "test" ? Promise.resolve(true) : Promise.resolve(false);
  });
  