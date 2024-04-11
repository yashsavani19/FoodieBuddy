import { MessageProps } from "../components/Message";

/**
 * Default message for Buddy when chat is started
 */
export const initialBuddyMessage: MessageProps = {
  id: "1", // First message in list
  text: "Hi! I'm Buddy, your friendly foodie guide at your service! Looking for some tasty bites? Just let me know what you're craving, and I'll whip up a list of great places for you to check out. Whether it's burgers, pizza, tacos, or something fancy, I've got you covered! So, what's on your mind?",
  imageUrl: require("../assets/images/buddy-icon.png"),
  type: "received",
};
