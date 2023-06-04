import { createContext, useState } from 'react'
import './App.css'

import io, { SocketOptions } from 'socket.io-client'

import { Routes, Route } from 'react-router-dom'
import { Game } from './pages/Game'
import Home from './pages/Home'

import dotenv from 'dotenv'
dotenv.config()


const socket = io(process.env.SERVER_URL ?? "http://localhost:3001/")

export const socketCtx = createContext<typeof socket>(socket)
function App() {

  const [displayName, setName] = useState("")
  const [roomId,setRoom] = useState("")


  return <>
      <socketCtx.Provider value={socket}>
        <Routes>
          
          <Route path='/' element={<Home setName={setName} setRoom={setRoom} />} />
          <Route path='/game' element={<Game userName={displayName} roomId={roomId}/> } />

        </Routes>
      </socketCtx.Provider>
  </>
}

export default App;