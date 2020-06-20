import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './components/Login.js';
import Lobby from './components/Lobby.js';
import InGame from './components/InGame.js';

function App() {
  return (
    <div className="App" style={{ width: "100%" }}>

      <BrowserRouter>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/lobby" component={Lobby} />
          <Route exact path="/game" component={InGame} />
          <Route path="/" component={Login} />
        </Switch>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
