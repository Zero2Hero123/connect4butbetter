

import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { socketCtx } from "../App";
interface Props {
    displayName: string,
    myColor: 'red' | 'yellow'
}

interface Message {
    author: string,
    color: 'red' | 'yellow',
    content: string
}

import ChatMessage from "./ChatMessage";

export default function ChatBox({displayName, myColor}: Props){

    const chatForm = useRef<HTMLFormElement>(null)
    const msgInput = useRef<HTMLInputElement>(null)

    const [messages,setMessages] = useState<Message[]>([])

    const socket = useContext(socketCtx)

    useEffect(() => {
        console.log(messages)
    },[messages])

    function addNewMessage(e: FormEvent){
        e.preventDefault()

        const message = msgInput.current?.value;
        
        const obj: Message = {author: displayName,color: myColor,content: message ?? "None"}

        if(msgInput.current){
            msgInput.current.value = ""
        }

        socket.emit('new-message', obj)

        setMessages(prev => [...prev,obj])
    }

    useEffect(() => {

        // chatForm?.current?.addEventListener("submit",addNewMessage)


        socket.on('opp-new-message',(newMessage) => {

            setMessages(prev => [...prev,newMessage])

        })

        // return () => {
        //     chatForm?.current?.removeEventListener("submit",addNewMessage)
        // }
    },[])

    return <>
    
        <div className="absolute rounded-md left-[3%] bg-blue-700 h-[250px] w-[400px] flex flex-col items-center" >
            <p className="text-center text-blue-200" >Chat</p>
            
            <div className=" w-[95%] grow bg-blue-800 overflow-y-scroll">
                {messages.map((m,i) => <ChatMessage key={i} author={m.author == displayName ? "You" : m.author} content={m.content} color={m.color} />)}
            </div>

            <form onSubmit={addNewMessage} ref={chatForm} className="flex flex-col justify-end items-center w-[95%] bg-blue-800 text-white" >
                <input ref={msgInput} className=" rounded-md h-[50px] w-[100%] bg-blue-700 text-white" placeholder="Send a Message" type="text" />
            </form>
        </div>
    
    </>

}