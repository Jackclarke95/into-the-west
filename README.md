# Into the West

This project is a web app for tracking a Dungeons and Dragons campaign called Into the West. It primarily uses Google Firebase for server side functionality, and implements a React.JS-powered web client, written in TypeScript. Database management is handled through Firebase Realtime Database, and user authentication is handled through Firebase Email/Password Authentication. Autodeployment is handled by GitHub Actions.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Development

### Environment Variables

In order to run the code locally, enviornment variables need to be configured or the app will fail to execute. These are stored in a file called `.env` stored at the project's root directory (the same place as `package.json`, `.gitignore`, `README.md` etc). The following snippet is required:

```
REACT_APP_FIREBASE_API_KEY={apiKey}
REACT_APP_FIREBASE_AUTH_DOMAIN={authDomain}
REACT_APP_FIREBASE_DATABASE_URL={databaseURL}
REACT_APP_FIREBASE_PROJECT_ID={projectId}
REACT_APP_FIREBASE_STORAGE_BUCKET={storageBucket}
REACT_APP_FIREBASE_MESSAGING_SENDER_ID={messagingSenderId}
REACT_APP_FIREBASE_APP_ID={appId}
REACT_APP_DISCORD_WEBHOOK_URL={found in Discord Server}
```

The values for the above snippet can be found in Project Settings in the [Firebase Console](https://console.firebase.google.com/)

## Continuous Development and Integration

Pull requests and merges to the main branch trigger various workflows using GitHub Actions. In future, the intention is to have unit tests run on every pull request, as well as UI tests to run against the test website (see below)

### Pull Request

The creation of a pull request triggers a GitHub action that attempts to build and deploy a preview of that branch to its own website for preview.

In future, UI tests will be run against this website, and unit tests will be run against the code, as well as build validation, which must all succeed before a merge can be completed.

## Merge to Main

A merge to the main branch automatically triggers a production release. Currently, there is no automated testing, but this is intended to be improved in the future, in order to reduce any regressions.
