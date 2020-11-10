import React from 'react'
import {Button } from "@material-ui/core";
import "Login.css";
import { auth, provider } from "./firebase"
import { actionTypes } from "./reducer"

function Login() {
    const signIn = () => {
        auth.signInWithPopup(provider).then((result) => ({
            type: actionTypes.SET_USER,
            user: result.user,
        }).catch((error) => alert(error.message))
    };
    return (
        <div className="login">
            <div className="login__container">
                <img src="https://en.wikipedia.org/wiki/WhatsApp#/media/File:WhatsApp.svg" alt=""/>
                <div className="login__text">
                    <h1>Sign in to Chatsapp</h1>
                </div>
                <Button type="submit" onClick={signIn}>
                    Sign In With Google
                </Button>
            </div>
        </div>
    )
}

export default Login
