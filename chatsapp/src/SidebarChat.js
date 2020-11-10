import React, { useEffect, useState } from 'react'
import { Avatar } from "@material-ui/core"
import "./SidebarChat.css";
import db from "./firebase.js";
import {Link} from "react-router-dom"

function SidebarChat({ addNewChat }) {
    const [seed, setSeed] = useState('');
    const [message, setMessages] = useState("");

    useEffect(() => {
        if(id) {
            db.collection("rooms").doc(id).collection("message").orderBy("timestamp","desc").onSnapshot((snapshot) => 
                setMessages(snapshot.docs.map((doc) => doc.data()))
            );
        }
    }, [id]);

    useEffect(() => {
        setSeed(Math.round(Math.random() * 10000));
    }, [])

    const createChat = () => {
        const roomname = prompt("Enter name for new Chatroom");
        if (roomname) {
            // do some clever database stuff...
            db.collection("rooms").add({
                name: roomName,
            })
        }
    }

    return !addNewChat ? (
        <Link to={`/rooms/${id}`}>
            <div className="sidebarChat">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                <div className="sidebarChat__info">
                    <h2>{name}</h2>
                    <p>{messages[0]?.message} </p>
                </div>
            </div>
        </Link>
    ) : (
            <div onClick={createChat} className="sidebarChat">
                <h2>Add new Chatroom</h2>
            </div>
        )
}

export default SidebarChat;
