import React from 'react'
import { useEffect,useState } from 'react';
import { useParams } from 'react-router-dom';
import "./Chat.css";
import Avatar from "@material-ui/core/Avatar";
import { AiOutlineSearch } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlinePaperClip } from "react-icons/ai";
import {MdOutlineEmojiEmotions } from "react-icons/md";
import {MdOutlineMic } from "react-icons/md";
import db from './firebase';
import { useStateValue } from './StateProvider';
import firebase from 'firebase';
function Chat() {
        const[input,setInput] = useState('');
        const[seed,setSeed] = useState("");
        const { roomId } = useParams();
        const [roomName, setRoomName]= useState("");
        const [messages,setMessages]=useState([]);
        const [{user},dispatch]= useStateValue();
        useEffect(()=>{
           if(roomId){
               db.collection("rooms").doc(roomId).onSnapshot((snapshot) =>
                   setRoomName(snapshot.data().name
               ));
               db.collection('rooms').doc(roomId).collection("messages").orderBy('timestamp','asc').onSnapshot((snapshot)=>setMessages(snapshot.docs.map((doc)=>doc.data()))
               );
              
           }
        }, [roomId])

        useEffect(() => {
            setSeed(Math.floor(Math.random()*5000)); 
        }, [roomId])
        const sendMessage = (e)=>{
            e.preventDefault();
            console.log('You typed >>>',input);
            db.collection('rooms').doc(roomId).collection('messages').add({
                message:input,
                name:user.displayName,
                timestamp:firebase.firestore.FieldValue.serverTimestamp(),
            })
            setInput("");
        }; 
    return (
        <div className='chat'>
            <div className="chat_header">
            <Avatar src={`https://avatars.dicebear.com/api/avataaars/:${seed}.svg`}/> 
            <div className="chat_headerInfo">
                <h3>{roomName}</h3>
                <p>Last seen{" "}{
                    new Date(messages[messages.length-1]?.timestamp?.toDateString()).toUTCString()
                } </p>
            </div>
            <div className="chat_headerRight">
                <span>
                <AiOutlineSearch/></span>
                <span><AiOutlinePaperClip/></span> 
                <span><BsThreeDotsVertical/></span>
                </div>
            </div>
            <div className="chat_body">
                {
                    messages.map(message=>(
                        <p className={`chat_message ${message.name===user.displayName &&"chat_reciever"}`}>
                        <span className="chat_name">{message.name} </span>
                       {message.message}
                        <span className="chat_timestamp">
                            {new Date(message.timestamp?.toDateString()).toUTCString()}
                        </span>
                        </p>
                    ))
                }
            </div>
            <div className="chat_footer">
            <span className="emoji"><MdOutlineEmojiEmotions/></span>
            <form>
                <input value= {input} onChange={e=> setInput(e.target.value)}placeholder="Type a message" type="text"/>
                <button onClick={sendMessage} type="submit">Send a message</button>
            </form>
            <span className="emoji"><MdOutlineMic/></span>
            </div>
        </div>
    )
}

export default Chat
