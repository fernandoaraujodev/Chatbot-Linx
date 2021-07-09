import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {ToastProvider} from 'react-toast-notifications';
// import VLibras from '@djpfs/react-vlibras'

import {FirebaseAppProvider} from 'reactfire';
import firebaseConfig from './utils/firebaseConfig.js'
import 'firebase/auth';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import Rotas from './routes'

import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

// const routing = (
//   <Routes />
// )

ReactDOM.render(
  <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <ToastProvider>
      <Router>
        <Rotas />
      </Router>
    </ToastProvider>
  </FirebaseAppProvider>
,
   document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
