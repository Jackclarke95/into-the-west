# Into the West

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
```

The values for the above snippet can be found in Project Settings in the [Firebase Console](https://console.firebase.google.com/)
