import { Avatar, IconButton } from '@material-ui/core'
import SearchOutLined from "@material-ui/icons/SearchOutlined"
import AttachFile from "@material-ui/icons/AttachFile"
import MoreVert from "@material-ui/icons/MoreVert"
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon"
import MicIcon from "@material-ui/icons/Mic"
import React, { useEffect, useState } from 'react'
import './Chat.css'

function Chat() {

    const [seed, setSeed] = useState('');

    useEffect(() => {
        setSeed(Math.round(Math.random() * 10000));
    }, []);

    return (
        <div className='chat'>

            <div className="chat__header">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />

                <div className="chat__headerInfo">
                    <h3>Room name</h3>
                    <p>Last conversation at...</p>
                </div>
                <div className="chat_headerRight">
                    <IconButton>
                        <SearchOutLined />
                    </IconButton>

                    <IconButton>
                        <AttachFile />
                    </IconButton>

                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>

            <div className="chat__body">
                <p className="chat__message chat__send">
                    <span className="chat__name">User1</span>
                    test message
                    <span className="chat__timestamp">3.45pm</span>
                </p>
                <p className="chat__message">
                    <span className="chat__name">user2</span>
                    test message
                    <span className="chat__timestamp">3.45pm</span>
                </p>
            </div>

            <div className="chat__footer">
                <InsertEmoticonIcon />
                <form>
                    <input type="text" placeholder="Type a message..."/>
                    <button type="submit">Send message</button>
                </form>
                <MicIcon/>
            </div>
        </div>
    )
}

export default Chat;
