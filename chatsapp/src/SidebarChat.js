import React, { useEffect, useState } from 'react'
import { Avatar } from "@material-ui/core"
import "./SidebarChat.css";

function SidebarChat({ addNewChat }) {
    const [seed, setSeed] = useState('')

    useEffect(() => {
        setSeed(Math.round(Math.random() * 10000));
    }, [])

    const createChat = () => {
        const roomname = prompt("Enter name for new Chatroom");
        if (roomname) {
            // add chat room...
        }
    }

    return !addNewChat ? (
        <div className="sidebarChat">
            <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
            <div className="sidebarChat__info">
                <h2>Room name</h2>
                <p>Last message</p>
            </div>
        </div>
    ) : (
            <div onClick={createChat} className="sidebarChat">
                <h2>Add new Chatroom</h2>
            </div>
        )
}

export default SidebarChat;
