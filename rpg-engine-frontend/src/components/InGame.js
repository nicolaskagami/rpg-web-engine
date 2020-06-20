import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import GoldenLayout from 'golden-layout';
import $ from 'jquery';
import layout from '../defaultLayout';
import Chat from './Chat/Chat.js';
import GameScreen from './GameGrid.js';
import CharacterSheet from './CharacterSheet.js';
import './InGame.css';

window.React = React;
window.ReactDOM = ReactDOM;

class InGame extends Component {

    componentDidMount() {
        var gameLayout = this.createLayout(layout, $('#game-layout'));
        $(window).resize(function () {
            gameLayout.updateSize();
        });
    }

    createLayout(config, container) {
        var layout = new GoldenLayout(config, $(container));
        layout.registerComponent('chat', Chat);
        layout.registerComponent('game-screen', GameScreen);
        layout.registerComponent('character-sheet', CharacterSheet);
        layout.init();
        return layout;
    }

    render() {
        return <div className="InGame" id="game-layout" style={{ width: "100%", height: "100vh",}}>
        </div>
    };
}

export default InGame;