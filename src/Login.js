import React, { Component } from 'react';
import firebase from './firebase';
import './style.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

library.add(fab);

class Login extends Component {
  constructor(props) {
    super(props);

    this.signInWithGoogle = this.signInWithGoogle.bind(this);
    this.logIn = this.props.logIn;
  }

  signInWithGoogle(e) {
    const logIn = this.logIn;
    e.preventDefault();
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(googleProvider)
      .then(function(result) {
        logIn();
      }).catch(error => {
        alert(`ERROR: ${error}`);
      });
  }

  render() {
    return (
      <div className="container">
      <div className="jumbotron vertical-center">
        <div className="text-center">
          <p>Log In</p>
        </div>
        <form>
          <button id="signInWithGoogle" onClick={this.signInWithGoogle}><FontAwesomeIcon className="icon" icon={['fab', 'google']} />Sign In With Google</button>
        </form>
      </div>
    </div>
    );
  }
}

export default Login;
