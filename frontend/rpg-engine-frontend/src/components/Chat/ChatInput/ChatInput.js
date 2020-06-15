
import React, {Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';


const useStyles = makeStyles((theme) => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
}));

class ChatInput extends Component {

    render() {
        return <div className="ChatInput">
            <Paper component="form" className="root">
                <InputBase
                    className="inputBar"
                    placeholder="Write your message here"
                />
                <IconButton type="submit" className="iconButton" aria-label="search">
                    <SendIcon />
                </IconButton>
            </Paper>
        </div>
    };
}

export default ChatInput;
