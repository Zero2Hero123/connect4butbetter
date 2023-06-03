

import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { socketCtx } from "../App";

interface Props {
    displayName: string
}

export default function ChatBox({displayName}: Props){

    const chatForm = useRef<HTMLFormElement>(null)
    const msgInput = useRef<HTMLInputElement>(null)

    const socket = useContext(socketCtx)

    useEffect(() => {
        chatForm?.current?.addEventListener("submit",(e) => {
            e.preventDefault()

            const message = msgInput.current?.value;

            socket.emit('chat-msg', {author: displayName,content: message})
        })
    },[])

    return <>
    
        <div className="absolute rounded-md left-[3%] bg-blue-700 h-[250px] w-[400px] flex flex-col items-center" >
            <p className="text-center text-blue-200" >Chat</p>
            
            <div className=" w-[95%] grow bg-blue-800">

            </div>

            <form ref={chatForm} className="flex flex-col justify-end items-center w-[95%] bg-blue-800 text-white" >
                <input ref={msgInput} className=" rounded-md h-[50px] w-[100%] bg-blue-700 text-white" placeholder="Send a Message" type="text" />
            </form>
        </div>
    
    </>

}