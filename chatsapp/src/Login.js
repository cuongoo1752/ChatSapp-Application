import React from 'react'
import { Button } from '@material-ui/core'
import './Login.css'
import { auth, provider } from './firebase'
import { actionTypes } from './reducer'
import { useStateValue } from './StateProvider'

function Login() {
	const [, dispatch] = useStateValue()

	const signIn = () => {
		auth.signInWithPopup(provider)
			.then((result) => {
				dispatch({
					type: actionTypes.SET_USER,
					user: result.user,
				})
			})
			.catch((error) => console.log(error.message))
	}
	return (
		<div className='login'>
			<div className='login__container'>
				<img src='https://i.pinimg.com/originals/8a/26/2e/8a262eec1c2a9b26e522590b5a483c8d.png' alt='' />

				<div className='login__text'>
					<h1>Sign in to Chatsapp</h1>
				</div>

				<Button onClick={signIn}>Sign In With Google</Button>
			</div>
		</div>
	)
}

export default Login
