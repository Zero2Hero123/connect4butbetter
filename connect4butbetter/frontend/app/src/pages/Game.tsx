import Board from "../components/Board"

interface Props {
    userName: string,
    roomId: string | number
}

import { socketCtx } from "../App"
import { SetStateAction, useContext, useEffect, useState } from "react"
import { Navigate } from "react-router-dom"

interface Player {
    userName: string,
    userId: string,
    color: 'red' | 'yellow' | ''
}

export function Game({userName, roomId}: Props){
    if(!userName || !roomId){
        return <Navigate replace to="/" />;
    }

    let socket = useContext(socketCtx)

    const [started,setStart] = useState<boolean>(false)
    const [numPlayers,setNumPlayers] = useState(1)
    const [opponent,setOpp] = useState<Player>({userName: '', userId: '', color: ''})
    const [myColor,setColor] = useState<'red' | 'yellow'>('red')
    
    useEffect(() => {

        socket.emit('join-room',{roomId,userName})


        socket.on('new-user', (user) => {
            // console.log(user)
            setNumPlayers(prev => prev + 1)
            setOpp(user)

            socket.emit('get-color1')
        })

        socket.on('update-opp-user',(newName: string) => {
            //for 2nd person who joined
            socket.emit('get-color2')

            setOpp((prev) => {
                return {userName: newName, userId: prev.userId, color: prev.color}})
        })

        socket.on('set-color',(newColor: 'red' | 'yellow') => {
            
            setColor(newColor)
          
        })

        socket.on('start-game',async () => {
            socket.emit('send-username',userName)
            
            
            setStart(true)
        })

        
    },[])


    return <>
    
        <div className="flex gap-1 flex-col justify-center items-center h-screen w-screen bg-blue-500">
            <h1 className='text-xl text-white font-bold' >{started ? 2 : "Waiting for other Player... "+ numPlayers}/2</h1>
            <h1 className='text-2xl text-white font-bold' >Room ID: {roomId}</h1>
            <div className="flex justify-center" >
                < h1 className="text-2xl font-medium text-blue-300" >{userName} vs. {opponent.userName}</h1>
            </div>
            <Board myColor={myColor} start={started} />
        </div>
    
    </>
}