import React, { Component } from 'react';
import axios from 'axios';
import { Route, Switch } from 'react-router-dom';
import  Login  from './components/Login.js';
import Lobby from './components/Lobby.js';
import InGame from './components/InGame.js';
//import Front from './frontend-client.js';

class App extends Component {

  loadData() {
    this.setState({ loading: true });
    axios('https://api.randomuser.me/?nat=US&results=5')
      .then(response => this.setState(
        { users: [...this.state.users, ...response.data.results], loading: false }
      ));
  }

  render() {
    return <div className="App">
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/lobby" component={Lobby} />
        <Route exact path="/game" component={InGame} />
        <Route path="/" component={Login} />
      </Switch>
    </div>
  };
}

export default App;
