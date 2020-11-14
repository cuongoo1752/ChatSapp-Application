import React, { useEffect, useState } from 'react'
import { Avatar } from '@material-ui/core'
import './SidebarChat.css'
import db from './firebase.js'
import { Link } from 'react-router-dom'
import firebase from 'firebase'

function SidebarChat({ id, name, addNewChat }) {
	const [seed, setSeed] = useState('')
	const [messages, setMessages] = useState('')

	useEffect(() => {
		if (id) {
			db.collection('rooms')
				.doc(id)
				.collection('messages')
				.orderBy('timestamp', 'desc')
				.onSnapshot((snapshot) => setMessages(snapshot.docs.map((doc) => doc.data())))
		}
	}, [id])

	useEffect(() => {
		setSeed(Math.round(Math.random() * 10000))
	}, [])

	const createChat = () => {
		const roomName = prompt('Enter name for new Chatroom')
		if (roomName) {
			db.collection('rooms').add({
				name: roomName,
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			})
		}
	}

	return !addNewChat ? (
		<Link to={`/rooms/${id}`}>
			<div className='sidebarChat'>
				<Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
				<div className='sidebarChat__info'>
					<h2>{name}</h2>
					<div className='sidebarChat__lastMessage'>
						<p>
							{messages[0]
								? messages[0]?.content.substring(0, 20) +
								  (messages[0]?.content.length >= 20 ? '...' : '')
								: ''}
						</p>
						<p>
							{messages[0]
								? new Date(messages[0].timestamp?.toDate()).toLocaleTimeString().split(' ')[0]
								: ''}
						</p>
					</div>
				</div>
			</div>
		</Link>
	) : (
		<div onClick={createChat} className='sidebarChat'>
			<h2>Add new Chatroom</h2>
		</div>
	)
}

export default SidebarChat
