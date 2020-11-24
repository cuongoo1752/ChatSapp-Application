import { Avatar, CircularProgress, IconButton } from '@material-ui/core'
import AttachFile from '@material-ui/icons/AttachFile'
import MoreVert from '@material-ui/icons/MoreVert'
import SearchOutline from '@material-ui/icons/SearchOutlined'
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon'
import MicIcon from '@material-ui/icons/Mic'
import { useParams } from 'react-router-dom'
import db, { storage } from './firebase'
import firebase from 'firebase'
import React, { useEffect, useState } from 'react'
import './Chat.css'
import { useStateValue } from './StateProvider'
import ImageIcon from '@material-ui/icons/Image'
import SendIcon from '@material-ui/icons/Send'
import ReactPlayer from 'react-player'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

function Chat() {
	const [input, setInput] = useState('')
	const [seed, setSeed] = useState('')
	const { roomId } = useParams()
	const [roomName, setRoomName] = useState('')
	const [messages, setMessages] = useState([])
	const [{ user }] = useStateValue()
	const [uploadProgress, setUploadProgress] = useState(0)
	const { transcript, resetTranscript } = useSpeechRecognition()
	const [listening, setListening] = useState(true)

	useEffect(() => {
		if (roomId) {
			db.collection('rooms')
				.doc(roomId)
				.onSnapshot((snapshot) => setRoomName(snapshot.data().name))
			db.collection('rooms')
				.doc(roomId)
				.collection('messages')
				.orderBy('timestamp', 'asc')
				.onSnapshot((snapshot) => setMessages(snapshot.docs.map((doc) => doc.data())))
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
		db.collection('rooms').doc(roomId).set({
			name: roomName,
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
		})

		setInput('')
	}

	const searchMessages = (e) => {
		db.collection('rooms')
			.doc(roomId)
			.collection('messages')
			.where('content', '>=', e.target.value)
			.where('content', '<=', e.target.value + '\uf8ff')
			.orderBy('content')
			.orderBy('timestamp', 'asc')
			.onSnapshot((snapshot) => setMessages(snapshot.docs.map((doc) => doc.data())))
	}

	const hiddenFileInput = React.useRef(null)
	const handleClick = (e) => {
		hiddenFileInput.current.click()
	}
	const handleChange = async (event) => {
		const fileUploaded = event.target.files[0]
		const newName = firebase.firestore.Timestamp.now()['seconds'] + fileUploaded.name
		const fileRenamed = new File([fileUploaded], newName)
		const fileUploadedType = fileUploaded.type.split('/')[0]
		await storage
			.ref(`${fileUploadedType}/${newName}`)
			.put(fileRenamed)
			.on(
				'state_changed',
				(snapshot) => {
					const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
					setUploadProgress(progress)
				},
				function (error) {},
				async function () {
					setUploadProgress(0)
					await storage
						.ref(fileUploadedType)
						.child(newName)
						.getDownloadURL()
						.then((url) => {
							db.collection('rooms').doc(roomId).collection('messages').add({
								content: url,
								name: user.displayName,
								email: user.email,
								timestamp: firebase.firestore.FieldValue.serverTimestamp(),
							})
						})
						.then(() => {
							db.collection('rooms')
								.doc(roomId)
								.collection('messages')
								.orderBy('timestamp', 'asc')
								.onSnapshot((snapshot) => setMessages(snapshot.docs.map((doc) => doc.data())))
						})
				}
			)
		event.target.value = null
	}

	const renderMessage = (content) => {
		if (/https:\/\/firebasestorage.googleapis.com\/v0\/b\/chatsapp-5b981.appspot.com\/o\/image/g.test(content)) {
			return <img src={content} alt='chat' />
		} else if (
			/https:\/\/firebasestorage.googleapis.com\/v0\/b\/chatsapp-5b981.appspot.com\/o\/video/g.test(content)
		) {
			return <ReactPlayer url={content} playing={false} controls />
		} else {
			return <p>{content}</p>
		}
	}

	const speechRecognize = () => {
		setListening(!listening)
		if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
			alert('Your browser does not support speech recognition')
			return
		}
		if (listening) {
			SpeechRecognition.startListening()
		} else {
			SpeechRecognition.stopListening()
			setInput(transcript)
			resetTranscript(transcript)
		}
	}

	return (
		<div className='chat'>
			<div className='chat__header'>
				<Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />

				<div className='chat__headerInfo'>
					<h3>{roomName}</h3>
					<p>
						{messages.length !== 0
							? 'Last conversation ' +
							  new Date(messages[messages.length - 1]?.timestamp?.toDate()).toUTCString()
							: ''}
					</p>
				</div>

				<div className='chat__headerRight'>
					<input onChange={searchMessages} type='text' placeholder='Search for messages' />
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
					<div className={`chat__message ${message.email === user.email && 'chat__send'}`}>
						<span className='chat__name'>{message.name}</span>
						{renderMessage(message.content)}
						<span className='chat__timestamp'>
							{new Date(message.timestamp?.toDate()).toLocaleString()}
						</span>
					</div>
				))}
			</div>
			<div className='chat__footer'>
				<IconButton>
					<InsertEmoticonIcon />
				</IconButton>
				{uploadProgress !== 0 ? (
					<CircularProgress variant='static' value={uploadProgress} />
				) : (
					<IconButton onClick={handleClick}>
						<input
							ref={hiddenFileInput}
							onChange={handleChange}
							style={{ display: 'none' }}
							accept='image/*,video/*'
							id='icon-button-file'
							type='file'
						/>
						<ImageIcon />
					</IconButton>
				)}

				<IconButton onClick={speechRecognize}>
					{listening ? <MicIcon /> : <MicIcon style={{ color: '#72caaf' }} />}
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
				<IconButton onClick={sendMessage}>
					<SendIcon />
				</IconButton>
			</div>
		</div>
	)
}

export default Chat
