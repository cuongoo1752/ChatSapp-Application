import React from 'react'
import './Sidebar.css';
import { Avatar, IconButton } from "@material-ui/core";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import SearchOutLined from "@material-ui/icons/SearchOutlined"
import SidebarChat from "./SidebarChat.js";


function Sidebar(){
    return(
        <div className="sidebar">
            <div className="sidebar__head">
                <Avatar/>
                <div className="sidebar__headerRight">
                    <IconButton>
                        <DonutLargeIcon />
                    </IconButton>

                    <IconButton>
                        <ChatIcon />
                    </IconButton>

                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>

            <div className="sidebar__seach">
                <div className='sidebar__searchContainer'>
                    <SearchOutLined/>
                    <input placeholder="Seach of start new chat" type ="text"/>
                </div>
                
            </div>

            <div className="sidebar__chats">
                <SidebarChat />
                <SidebarChat />
                <SidebarChat />
                <SidebarChat />
            </div>
        </div>
    )
}

export default Sidebar;