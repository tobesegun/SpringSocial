import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser,  setCurrentAdmin, logoutUser} from './actions/authActions';
import { clearCurrentProfile } from './actions/profileActions';

import { Provider } from 'react-redux';
import store from './store.js'

import PrivateRoute from './components/common/PrivateRoute';

import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';
import Landing from './components/layouts/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/Dashboard/dashboard';
import LoginAdmin from './components/auth/LoginAdmin';
import RegisterAdmin from './components/auth/RegisterAdmin';
import CreateProfile from './components/create-profile/CreateProfile';

import './App.css';

//User
// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);   
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
   // Check for expired token
   const currentTime = Date.now() / 1000;
   if (decoded.exp < currentTime) {
     // Logout user
     store.dispatch(logoutUser());
     // TODO: Clear current Profile
     store.dispatch(clearCurrentProfile());
     // Redirect to login

     // Redirect to login
     window.location.href = '/login';
   }
}

//Admin
// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentAdmin(decoded));
}


class App extends Component {
  render() {
    return (
      <Provider store={ store }>
        <Router>
         <div className="App">
          <Navbar />     
            <Route exact path="/" component={ Landing }/>   
            <div className="container">
              <Route exact path="/register" component={Register}/>
              <Route exact path="/login" component={Login}/>
               <Switch>
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
              </Switch>
              <Route exact path="/registerAdmin" component={RegisterAdmin}/>
              <Route exact path="/loginAdmin" component={LoginAdmin}/>
              <Switch>
                <PrivateRoute
                  exact
                  path="/create-profile"
                  component={CreateProfile}
                />
              </Switch>
            </div>
          < Footer /> 
        </div>
       </Router>
      </Provider>
       
    );
  }
}

export default App;
