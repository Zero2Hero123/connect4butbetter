import { createContext, SetStateAction, useState } from "react"

interface Props {
  setName: React.Dispatch<SetStateAction<string>>, 
  setRoom: React.Dispatch<SetStateAction<string>> 
}

import { Link } from 'react-router-dom'

export default function Home({ setName , setRoom}: Props) {
    


    return <>
    
        <div className="flex gap-20 flex-col justify-center items-center bg-blue-600 h-screen w-screen">
            <h1 className="text-5xl text-white font-medium" >Conncet4 But Better!</h1>
            <form className="flex bg-blue-500 p-10 rounded-md flex-col justify-center items-center gap-4" >
                <input onChange={(e) => setName(e.target.value)} className="text-center text-xl rounded-md" placeholder="Display Name" type="text" />
                <input onChange={(e) => setRoom(e.target.value)} className="text-center text-xl rounded-md" placeholder="Create/Join Code" type="text" />
                <Link to='/game' >
                    <button className="text-white font-medium text-xl bg-blue-700 rounded-md px-3 py-2" >Join</button>
                </Link>
            </form>
        </div>
    
    </>
}