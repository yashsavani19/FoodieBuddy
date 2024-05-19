import { searchUsername } from "../DatabaseHandler";

test("Search for a username", async () => {
  const username = "test";
  const result = await searchUsername(username);
  expect(result).toBe(true);
});
