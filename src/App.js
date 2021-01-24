import React from 'react'
import './App.css';
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import {useState,useRef} from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection, useCollectionData } from 'react-firebase-hooks/firestore' 

firebase.initializeApp ({
  apiKey: "AIzaSyAGBegihbcW-4onVY8GrWqSpiE_Of_rAQA",
  authDomain: "chat-app-e0702.firebaseapp.com",
  projectId: "chat-app-e0702",
  storageBucket: "chat-app-e0702.appspot.com",
  messagingSenderId: "234345712159",
  appId: "1:234345712159:web:409264f5d1237e9f23e32a",
  measurementId: "G-81MX26HGFT"

})

const auth = firebase.auth()
const firestore = firebase.firestore()


function App() {
  const [user] = useAuthState(auth)
  return (
    <div className="App">
      <header>
        <h1><SignOut/></h1>
      </header>
        <section>
          {user ? <ChatRoom /> :  <SignIn />}
        </section>
    
    </div>
  );
}
function SignIn(){
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  }
  return (
    <button onClick = {signInWithGoogle}>Sign in with Google</button>
  )
}
function SignOut(){
  return auth.currentUser && (
    <button onClick = {() => auth.signOut()}>Sign Out</button>
  )
}
function ChatRoom(){
  const dummy = useRef()
  const messagesRef = firestore.collection('messages')
  const query = messagesRef.orderBy('createdAt').limit(25)
  const [messages] = useCollectionData(query, {idField:'id'})
  const [formValue, setformValue] = useState('')
  const sendMessage = async(e) => {
    e.preventDefault()
    const {uid, photoURL} = auth.currentUser
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setformValue('')
    dummy.current.scrollIntoView({behavior:'smooth'})
  }
  return(
    <div>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message ={msg}/>)}
      <div ref={dummy}></div>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange = {(e) => setformValue(e.target.value)}/>
        <button type = "submit">Send</button>
      </form>
      
    </div>
  )

}
function ChatMessage(props){
  const {text, uid, photoURL} = props.message 
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recieved'
  return(
    <div className = {`message ${messageClass}`}>
      <img src = {photoURL} />
    <p>{text}</p>
    </div>
  )
}
export default App;
