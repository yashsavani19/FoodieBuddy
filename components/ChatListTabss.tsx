/**
 * ChatListTabs.tsx
 * 
 * This file defines a component for displaying a top tab navigator with two tabs: Buddy ChatBot and Friends Chat.
 * The component utilizes React Navigation's MaterialTopTabNavigator for navigation between the tabs.
 * 
 * Each tab renders a ChatList component with a different type prop ("buddy" or "friends"), which determines the type
 * of chat rooms displayed. The ChatListTabs component is styled with custom tab bar styles, including background color,
 * indicator style, and label style.
 * 
 * The ChatRoomItem component is responsible for rendering individual chat room items in the chat list. It includes
 * functionality for navigating to the chat screen and deleting chat rooms. The component fetches chat rooms from a
 * database and supports creating new chat rooms through a modal form.
 * 
 * Components:
 * - BuddyChatBot: Renders a ChatList component with type="buddy".
 * - FriendsChat: Renders a ChatList component with type="friends".
 * - ChatListTabs: Contains the top tab navigator with BuddyChatBot and FriendsChat tabs.
 */

import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ChatList from "./ChatList";

const Tab = createMaterialTopTabNavigator();

const BuddyChatBot: React.FC = () => <ChatList type="buddy" />;
const FriendsChat: React.FC = () => <ChatList type="friends" />;

const ChatListTabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: { backgroundColor: "#1e1e1e" },
      tabBarIndicatorStyle: {
        backgroundColor: "#ff6f00",
        width: "30%",
        borderRadius: 5,
        height: 5,
        alignSelf: "center",
        marginLeft: 38.5,
      },
      tabBarLabelStyle: {
        color: "#ffffff",
        fontWeight: "bold",
        textTransform: "none",
        fontSize: 18,
      },
    }}
  >
    <Tab.Screen name="Buddy ChatBot" component={BuddyChatBot} />
    <Tab.Screen name="Friends Chat" component={FriendsChat} />
  </Tab.Navigator>
);

export default ChatListTabs;