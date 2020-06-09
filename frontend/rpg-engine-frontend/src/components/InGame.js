import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import GoldenLayout from 'golden-layout';
import $ from 'jquery';
import layout from '../defaultLayout';
import Chat from './Chat.js';
import GameScreen from './GameGrid.js';
import CharacterSheet from './CharacterSheet.js';

window.React = React;
window.ReactDOM = ReactDOM;

class InGame extends Component {

    componentDidMount() {
        var gameLayout = new GoldenLayout(layout, $('#game-layout'));
        gameLayout.registerComponent('chat', Chat);
        gameLayout.registerComponent('game-screen', GameScreen);
        gameLayout.registerComponent('character-sheet', CharacterSheet);
        gameLayout.init();
    }

    render() {
        return <div className="InGame" >
            <div id="game-layout" style={{width:"100vw", height:"100vh"}}></div>
        </div>
    };
}

export default InGame;