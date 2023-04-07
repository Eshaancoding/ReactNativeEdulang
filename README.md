# EduLang 

A multilingual storybook app with automatic translation. 


## Features:

* User system
* Automatic Translated books (users can enter their own translation)
* Custom translation (scans text and user can enter text)
* User can upload books 
* Admin system to accept books
* Library of books supported with +107 languages supported

## Installation 

1. Install [node](https://nodejs.org/en)
2. Install react native cli and eject library (for building) via `npm install react-native react-native-eject -g`
3. First, run `npm install --legacy-peer-deps`
4. Build `ios` and `android` folders via `react-native eject`
5. Get the firebase information. Ask Eshaan B. in Slack for information, and add the file contents to `firebase.tsx` located in this directory (`edulang/firebase.tsx`)
6. Make sure you set up the icons according to your build type (ios/android) via [this link](https://github.com/oblador/react-native-vector-icons#installation)
7. Setup simulator
    * If you want to run in an android simulator, then you have to follow instructions from [React Native](https://reactnative.dev/docs/0.68/environment-setup). 
        * Make sure that you install "NDK Side by Side"
8. Run via `npm run android`
    * Note that if you build the project before, you can just use `npm run start` in order to run quicker (uses build cache).
    * See [more](https://stackoverflow.com/questions/56548557/what-is-the-difference-between-npm-start-and-react-native-run-android-deploy)

**Note**: This is not a complete list of steps. I tried to compile everything that I had from memory however I am probably missing a few stuff; let me know if any errors you encounter during installation (not familiar with installing to ios xcode simulator)