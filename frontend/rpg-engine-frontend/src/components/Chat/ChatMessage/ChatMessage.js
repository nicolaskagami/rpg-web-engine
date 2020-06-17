import React, { Component } from 'react';
import './ChatMessage.css'
import Paper from '@material-ui/core/Paper';

const Title = ({ agent, action, complement, target }) => <p> {agent} <span>{action}</span> {complement} {target} </p>;
const MessageContent = ({ message }) => <p> {message} </p>;
const DiceRoll = ({ imageURL, diceRollList, advTag, normalTag, disTag }) => {
    return <div className="DiceRoll">
        <image src={imageURL}></image>
        {diceRollList.map((roll, index) => <a key={index}>{roll} | </a>)}
        {advTag == true &&
            <p>
                Adv.
            </p>
        }
        {normalTag == true &&
            <p>
                Adv.
            </p>
        }
        {disTag == true &&
            <p>
                Adv.
            </p>
        }
    </div>

};
const Result = ({ message }) => <h2> Loading {message} </h2>;
const DamageRoll = ({ damageRollList, weapon }) => {
    return <div className="DamageRoll">
        {damageRollList.map((roll, index) => <Die key={index} imageURL={roll.dice.imageURL} numberOfDice={roll.dice.numberOfDice}>{roll} | </Die>)}
    </div>
};

const Die = ({ imageURL, numberOfDice }) => <a> this is {numberOfDice} dice </a>;
const Timestamp = ({ message }) => <a className="time-stamp"> {message} </a>;

class ChatMessage extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const message = this.props.message;
        return <div className="ChatMessage" >

            <div className="chat-contents">
                <Title agent={message.source} ></Title>
                <MessageContent message={message.message}></MessageContent>
                <Timestamp message={message.timestamp}></Timestamp>
            </div>

        </div>
    };
}

export default ChatMessage;