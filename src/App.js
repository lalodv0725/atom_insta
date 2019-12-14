import React, { Component } from 'react'
import firebase from 'firebase'
import {
    BrowserRouter as Router, //Enrutador
    Switch,
    Route,
} from 'react-router-dom'

//css
import 'bulma/css/bulma.css'
import './App.css'

//pages
import Login from './pages/login'
import Home from './pages/home'

//Initialize Firebase
let firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
    authDomain: "atom-insta-100.firebaseapp.com",
    databaseURL: "https://atom-insta-100.firebaseio.com",
    projectId: "atom-insta-100",
    storageBucket: "atom-insta-100.appspot.com",
    messagingSenderId: "713544193086",
    appId: "1:713544193086:web:a52809a2c1173b402cad6f",
    measurementId: "G-BGFLEPWTX0"
}
firebase.initializeApp(firebaseConfig)
//console.log(firebaseConfig)

class App extends Component {
    constructor(props){
        super(props)
    }

  render() {
    //console.log(process.env)
    return (
        <div className="container">
            <div className="section">
                <Router>
                    <Switch>
                        <Route 
                        path="/" 
                        exact
                        component={Login}
                        />
                        <Route path="/home" 
                        exact
                        component={Home}
                        />
                    </Switch>
                </Router>
            </div>
         </div>
    )
  }
}

export default App;
