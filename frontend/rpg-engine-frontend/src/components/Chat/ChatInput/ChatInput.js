
import React, {Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import './ChatInput.css';

class ChatInput extends Component {

    render() {
        return <div className="ChatInput">
            <div className="Input-box">
                <Paper component="form" className="root">
                    <InputBase
                        className="inputBar"
                        placeholder="Write your message here"/>
                    <IconButton type="submit" className="iconButton" aria-label="search">
                        <SendIcon />
                    </IconButton>
                </Paper>
            </div>
        </div>
    };
}

export default ChatInput;
