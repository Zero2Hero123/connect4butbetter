import { createContext, SetStateAction, useState } from "react"
import patternImg from '../assets/pattern.png'


interface Props {
  setName: React.Dispatch<SetStateAction<string>>, 
  setRoom: React.Dispatch<SetStateAction<string>> 
}

import { Link } from 'react-router-dom'

export default function Home({ setName , setRoom}: Props) {
    


    return <>
        <div className="flex gap-20 flex-col justify-center items-center bg-blue-600 h-screen w-screen">

            <div className=" absolute w-screen h-screen overflow-hidden" >
                <div className="bg-chip-pattern bg-repeat animate-slide h-[1000vh] w-[1000vw] animate-slide" ></div>
            </div>

            <h1 className="text-5xl text-center text-white font-medium z-10" >Connect4 But Better!</h1>
            <form className="flex bg-blue-500 p-10 rounded-md flex-col justify-center items-center gap-4 z-10" >
                <input onChange={(e) => setName(e.target.value)} className="text-center text-xl rounded-md" placeholder="Display Name" type="text" />
                <input onChange={(e) => setRoom(e.target.value)} className="text-center text-xl rounded-md" placeholder="Create/Join Code" type="text" />
                <Link to='/game' >
                    <button className="text-white font-medium text-xl bg-blue-700 rounded-md px-3 py-2" >Join</button>
                </Link>
            </form>
        </div>
    
    </>
}