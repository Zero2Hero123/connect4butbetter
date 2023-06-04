

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
        chatForm?.current?.addEventListener("submit",(e) => {
            e.preventDefault()

            const message = msgInput.current?.value;
            
            const obj: Message = {author: displayName,color: myColor,content: message ?? "None"}

            socket.emit('new-message', obj)

            setMessages(prev => [...prev,obj])
        })

        socket.on('opp-new-message',(newMessage) => {

            setMessages(prev => [...prev,newMessage])

        })

        
    },[])

    return <>
    
        <div className="absolute rounded-md left-[3%] bg-blue-700 h-[250px] w-[400px] flex flex-col items-center" >
            <p className="text-center text-blue-200" >Chat</p>
            
            <div className=" w-[95%] grow bg-blue-800">
                {messages.map((m) => <ChatMessage author={m.author} content={m.content} color={m.color} />)}
            </div>

            <form ref={chatForm} className="flex flex-col justify-end items-center w-[95%] bg-blue-800 text-white" >
                <input ref={msgInput} className=" rounded-md h-[50px] w-[100%] bg-blue-700 text-white" placeholder="Send a Message" type="text" />
            </form>
        </div>
    
    </>

}