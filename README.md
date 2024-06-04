

![App Icon 2](https://github.com/yashsavani19/FoodieBuddy/assets/160118560/aa5f70cf-fa35-47e3-a650-aa3ae04afb68)

<h1 align="center">
  <span><strong>Welcome to FoodieBuddy </strong></span>
</h1>

## Table of Contents

- [Installation](#installation)                         
- [Usage](#usage)
- [Features](#features)

## Installation

### Expo:

Download and install Node.js: https://nodejs.org/en/download/package-manager

Download Expo Go on a device or emulator: https://expo.dev/go
```bash
# Clone the repository
git clone https://github.com/yashsavani19/FoodieBuddy.git

# Navigate to the project directory
cd FoodieBuddy

# Install Dependencies - see package.json for details
npm install

# Start server
npm start
```

Scan the QR code with Expo Go on your device or enter the IP address in your emulator in the format: exp://X.X.X.X:8081 (Default port)

If successful the app will compile and run on your device from within Expo Go

## Usage

### Login Screen

You can register and login from this screen, and if you forget your password, you can recover it here too.

### Home View (List)

Here you will find a list of popular local restaurants, along with their rating, price level, open status and the ability to quickly add or remove them from your favourites or bookmarked places.

You can search for a restaurant using a keyword, or selelct one of the many fiters available.

The list is sorted by your personal food preferences by default, but if you would like to sort by something else, you can do that from the sorting menu.

Pressing one of the local restaurants will open a detailed view with more information about the place, and a mini map.

### Map View

Here you can navigate around the map to see the relative location of the list of restaurants to your position.

You can select a restaurant and view brief details, oget directions within the app, or link to Google Maps.

Here you can also search by keyword and filter restaurants.

### Chat View

In the chat view you can create chats and add your friends, or alternatively you can speak directly to our chatbot, Buddy, who will be happy to give you recommendations based on your preferences and local restaurants.

In your group chat you can always call on buddy to provide you and your friends with suggestions.

You can remove chats from the list with the minus button.

### Profile

Here is where you can view your favourite, saved and visited restaurants. You can press on a restaurant to view more detailed information.

This is also where you can search for and send requests to your friends. Additionally you can view friends, thier profiles and saved lists from this page.

You may also edit your account information from this page including profile image username, password and email address.

## Features

### Login Screen

- Create account
- Recover password
- Login

### Home (List)

- Local restaurant list
- Restaurant cover image
- Open status indicator
- "Visited" indicator
- Short restaurant details
- "Bookmark" add/remove button
- "Favourite" add/remove button
- "Share" button for external sharing
- Keyword search
- Result filters
- Sort by
- "I'm feeling lucky" easter egg

### Detailed view
- Restaurant details
- External website link
- Mini map

### Map

- Map view
- List restaurants tagged
- Brief restaurant details callout
- Access to Details view
- Navigation in app
- Navigation external app
- Keyword search
- Result filters

### Chat

- AI suggestions in buddy chat
- AI suggestion restaurant cards
- Create chat rooms with friends
- Add Image to chat room for identification
- Realtime chat
- Typing indicator
- AI suggestions in group chat
- AI suggestion restaurant cards
- Clear suggestions
- Remove messages
- Remove group chat

### Profile

- Favourite list
- Bookmarked list
- Visited list
- Edit profile image from camera or gallery
- Edit email
- Edit username
- Edit password
- Delete account
- View friends
- View friend requests
- Search for and send friend requests
- View friends profiles
- View friends saved lists
- View friends preferences
- Remove friends

## Steps to setup the .env file

1. Firebase configurations
   - To use Firebase services in your FoodieBuddy app, you need to create a Firebase project and obtain the configuration details.
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Create firebase project, Add app to firebase project, and obtain firebase configuration keys.
2. OpenAI Configuration
   - Go to the [OpenAI website](https://platform.openai.com/docs/overview)
   - Generate an API key.
   - Add OpenAI configuration to .env
3. Google API Key
   - Go to the [Google Cloud Console](https://console.cloud.google.com/welcome?project=theta-cable-418602)
   - Enable Places API (New) and Directions API
   - Generate API key and add it to .env

Create a .env file in the root directory of the app.
- Copy and paste the below code into the .env file.

### .env 
```javascript
FIREBASE_API_KEY="your_firebase_api_key"
FIREBASE_AUTH_DOMAIN="your_firebase_auth_domain"
FIREBASE_DATABASE_URL="your_firebase_database_url"
FIREBASE_PROJECT_URL="your_firebase_project_url"
FIREBASE_STORAGE_BUCKET="your_firebase_storage_bucket"
FIREBASE_MESSAGING_SENDER_ID="your_firebase_messaging_sender_id"
FIREBASE_APP_ID="your_firebase_app_id"
FIREBASE_MEASUREMENT_ID="your_firebase_measurement_id"
OPENAI_API_KEY="your_openai_api_key"
OPENAI_ORG_ID="your_openai_org_id"
GOOGLE_API_KEY="your_google_api_key"
```

