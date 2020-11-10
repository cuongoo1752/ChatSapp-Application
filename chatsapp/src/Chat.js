import { Avatar, IconButton } from '@material-ui/core'
import AttachFile from '@material-ui/icons/AttachFile'
import MoreVert from '@material-ui/icons/MoreVert'
import SearchOutline from '@material-ui/icons/SearchOutlined'
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon'
import MicIcon from '@material-ui/icons/Mic'
import { useParams } from 'react-router-dom'
import db from './firebase'
import firebase from 'firebase'
import React, { useEffect, useState } from 'react'
import './Chat.css'
import { useStateValue } from './StateProvider'
import ImageIcon from '@material-ui/icons/Image'
import GifIcon from '@material-ui/icons/Gif'

function Chat() {
	const [input, setInput] = useState('')
	const [seed, setSeed] = useState('')
	const { roomId } = useParams()
	const [roomName, setRoomName] = useState('')
	const [messages, setMessages] = useState([])
	const [{ user }, ] = useStateValue()

	useEffect(() => {
		if (roomId) {
			db.collection('rooms')
				.doc(roomId)
				.onSnapshot((snapshot) => setRoomName(snapshot.data().name))
			db.collection('rooms')
				.doc(roomId)
				.collection('messages')
				.orderBy('timestamp', 'asc')
				.onSnapshot((snapshot) =>
					setMessages(snapshot.docs.map((doc) => doc.data()))
				)
		}
	}, [roomId])

	useEffect(() => {
		setSeed(Math.round(Math.random() * 10000))
	}, [roomId])

	const sendMessage = (e) => {
		e.preventDefault()

		db.collection('rooms').doc(roomId).collection('messages').add({
			content: input,
			name: user.displayName,
			email: user.email,
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
		})

		setInput('')
	}
	return (
		<div className='chat'>
			<div className='chat__header'>
				<Avatar
					src={`https://avatars.dicebear.com/api/human/${seed}.svg`}
				/>

				<div className='chat__headerInfo'>
					<h3>{roomName}</h3>
					<p>
						{messages.length !== 0
							? 'Last conversation ' +
							  new Date(
									messages[
										messages.length - 1
									]?.timestamp?.toDate()
							  ).toUTCString()
							: ''}
					</p>
				</div>

				<div className='chat__headerRight'>
					<IconButton>
						<SearchOutline />
					</IconButton>
					<IconButton>
						<AttachFile />
					</IconButton>
					<IconButton>
						<MoreVert />
					</IconButton>
				</div>
			</div>
			<div className='chat__body'>
				{messages.map((message) => (
					<p
						className={`chat__message ${
							message.email === user.email && 'chat__send'
						}`}
					>
						<span className='chat__name'>{message.name}</span>
						{message.content}
						<span className='chat__timestamp'>
							{new Date(
								message.timestamp?.toDate()
							).toLocaleString()}
						</span>
					</p>
				))}
			</div>
			<div className='chat__footer'>
				<IconButton>
					<InsertEmoticonIcon />
				</IconButton>
				<IconButton>
					<GifIcon />
				</IconButton>
				<IconButton>
					<ImageIcon />
				</IconButton>
				<form>
					<input
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder='Type a message'
						type='text'
					/>
					<button onClick={sendMessage} type='submit'>
						Send a Message
					</button>
				</form>
				<IconButton>
					<MicIcon />
				</IconButton>
			</div>
		</div>
	)
}

export default Chat
