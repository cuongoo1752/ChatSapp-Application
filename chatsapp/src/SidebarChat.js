import React from 'react'
import { Avatar } from "@material-ui/core"
import "./SidebarChat.css";

function SidebarChat() {


    return (
        <div className="sidebarChat">
            <Avatar src={`https://avatars.dicebear.com/api/male/.svg`}/>
            <div className="sidebarChat__info">
                <h2>Room mate</h2>
                <p>Last message</p>
            </div>
        </div>
    )
}

export default SidebarChat
