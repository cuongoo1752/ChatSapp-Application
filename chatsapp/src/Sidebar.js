import React, { useEffect, useState } from 'react'
import './Sidebar.css'
import { Avatar, IconButton } from '@material-ui/core'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import ChatIcon from '@material-ui/icons/Chat'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import SearchOutLined from '@material-ui/icons/SearchOutlined'
import SidebarChat from './SidebarChat.js'
import db from './firebase'
import { useStateValue } from './StateProvider'
import firebase from 'firebase'

function Sidebar() {
	const [rooms, setRooms] = useState([])
	const [{ user }] = useStateValue()

	useEffect(() => {
		const unsubscribe = db
			.collection('rooms')
			.orderBy('timestamp', 'desc')
			.onSnapshot((snapshot) =>
				setRooms(
					snapshot.docs.map((doc) => ({
						id: doc.id,
						data: doc.data(),
					}))
				)
			)

		return () => {
			unsubscribe()
		}
	}, [])

	const searchRoom = (e) => {
		db.collection('rooms')
			.where('name', '>=', e.target.value)
			.where('name', '<=', e.target.value + '\uf8ff')
			.onSnapshot((snapshot) =>
				setRooms(
					snapshot.docs.map((doc) => ({
						id: doc.id,
						data: doc.data(),
					}))
				)
			)
	}

	const signOut = (e) => {
		firebase
			.auth()
			.signOut()
			.then((window.location = '/'))
	}

	return (
		<div className='sidebar'>
			<div className='sidebar__head'>
				<div className='sidebar__userInfo'>
					<Avatar src={user?.photoURL} />
					<h4>{user?.displayName}</h4>
				</div>
				<div className='sidebar__headerRight'>
					<IconButton onClick={signOut}>
						<ExitToAppIcon />
					</IconButton>
				</div>
			</div>

			<div className='sidebar__search'>
				<div className='sidebar__searchContainer'>
					<SearchOutLined />
					<input onChange={searchRoom} placeholder='Search of start new chat' type='text' />
				</div>
			</div>

			<div className='sidebar__chats'>
				<SidebarChat addNewChat />
				{rooms.map((room) => (
					<SidebarChat key={room.id} id={room.id} name={room.data.name} />
				))}
			</div>
		</div>
	)
}

export default Sidebar
