import React from 'react'
import './App.css'
import Sidebar from './Sidebar'
import Chat from './Chat'
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom'
import Login from './Login'
import { useStateValue } from './StateProvider'

function App() {
	const [{ user }] = useStateValue()

	return (
		<div className='app'>
			<Router>
				{!user ? (
					<Route>
						<Redirect to='/' />
						<Login />
					</Route>
				) : (
					<div className='app__body'>
						<Sidebar />
						<Switch>
							<Route path='/rooms/:roomId'>
								<Chat />
							</Route>
							<Route path='/'></Route>
						</Switch>
					</div>
				)}
			</Router>
		</div>
	)
}

export default App
