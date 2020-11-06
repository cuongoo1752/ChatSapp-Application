import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyDib33XpYWpnVBF2aluB3tRqIaHQwTBMzw",
  authDomain: "chatsapp-5b981.firebaseapp.com",
  databaseURL: "https://chatsapp-5b981.firebaseio.com",
  projectId: "chatsapp-5b981",
  storageBucket: "chatsapp-5b981.appspot.com",
  messagingSenderId: "899432261906",
  appId: "1:899432261906:web:9c0b0d3392776a9c176bcb"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;