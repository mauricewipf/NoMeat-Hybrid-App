# NoMeat (Hybrid App)

### Track days when you don’t eat meat

# 🙅‍♂️🍖

- A hybrid, mobile app built on [Ionic Framework](https://ionicframework.com) and [Angular](https://angular.io/)
- [Firebase](https://firebase.google.com/) for data storing and authentication
- [laker007/ionic3-calendar](https://github.com/laker007/ionic3-calendar)
- An [earlier version](https://github.com/mauricewipf/No-Meat-App) was based on Angular 1 + NodeJS + MongoDB

## Run locally

[Create a Firebase project](https://firebase.google.com/) and store the Firebase config in `.src/app/environments/environment.ts`

```
export const environment = {
  production: false,
  firebase: {
    apiKey: "...",
    authDomain: "...",
    databaseURL: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "..."
  }
};

```

```
$ npm install -g cordova ionic	
$ cd NoMeat
$ npm install
$ ionic serve
```

## Deploy to Ionic

```
$ git add .
$ git commit -am "make it better"
$ git push ionic master
```

