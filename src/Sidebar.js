import React from 'react';
import Avatar from "@material-ui/core/Avatar";
import { BsFillChatLeftTextFill } from "react-icons/bs";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdDonutLarge } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import './Sidebar.css';
import SidebarChat from './SidebarChat';
import {useState, useEffect} from 'react';
import db from "./firebase";
import { useStateValue } from './StateProvider';
function Sidebar( ){
    const [rooms,setRooms] = useState([]);
    const [{user}, dispatch] = useStateValue();

    useEffect(() => {
     const unsubscribe= db.collection("rooms").onSnapshot((snapshot) => 
         setRooms(snapshot.docs.map((doc) =>({
             id:doc.id,
             data: doc.data(),
         }))
     ));
     return() =>{
         unsubscribe();
     }
    },[] );
    return (
        <div className ="sidebar">
            <div className="sidebar_header">
            <span className="profile"><Avatar src={user?.photoURL}/></span>
                <div className="sidebar_headerRight">
                    <span>
                <MdDonutLarge/></span>
                <span><BsFillChatLeftTextFill/></span> 
                <span><BsThreeDotsVertical/></span>
                </div>
           </div>
            <div className="sidebar_search">
                <span className="search">
             <AiOutlineSearch/>
             </span>
             <div className="sidebar_searchContainer"> <input placeholder="Search or start new chat" type="text"/></div>
            </div>
            <div className= "sidebar_chats">
            <SidebarChat addNewChat/>
            {rooms.map(room => (
                <SidebarChat key = {room.id} id={room.id} name={room.data.name} />
            ))

            }
            </div>
        </div>
    ); 
}

export default Sidebar
