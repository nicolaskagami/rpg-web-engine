import React, { Component } from 'react';
import ChatMessage from './ChatMessage/ChatMessage';
import ChatInput from './ChatInput/ChatInput';

class Chat extends Component {
    
    render() {
        const messages = [
            {
                source: "user1", // physics, magic, gab
                tag: "combat",
                message: "hello world",
                timestamp: "10:30"
            },
            {
                source: "user2", // physics, magic, gab
                tag: "dialog",
                message: "hello world 2",
                timestamp: "10:33"
            },
            {
                source: "user3", // physics, magic, gab
                tag: "combat",
                message: "hello world 3",
                timestamp: "10:43"
            }
        ];
        return <div className="Chat" style={{ width: "100%", margin: "0"}}>
            {messages.map((message, index) => <ChatMessage key={index} message={message}> </ChatMessage>)}
            <ChatInput></ChatInput>
        </div>
    };
}

export default Chat;