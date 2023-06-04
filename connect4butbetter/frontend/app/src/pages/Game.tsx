import Board from "../components/Board"
import ChatBox from "../components/ChatBox"

import { socketCtx } from "../App"
import { SetStateAction, useContext, useEffect, useState, useRef } from "react"
import { Navigate } from "react-router-dom"


interface Player {
    userName: string,
    userId: string,
    color: 'red' | 'yellow' | ''
}

interface Props {
    userName: string,
    roomId: string | number
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


    const returnRef = useRef<HTMLDialogElement>(null)

    function leave(){
        socket.emit('leave')

    }

    
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

        
        <dialog ref={returnRef} className="absolute top-[45%] bg-blue-800 w-[15%] min-w-[150px] h-[20%] flex flex-col justify-between">
            <h1 className="text-white text-2xl text-center" >Game Ended</h1>
            <a href="/">
                <button onClick={leave} className="bg-blue-600 text-white px-3 py-1 font-medium hover:bg-blue-500" >Return</button>
            </a>
        </dialog>

        <div className="flex gap-1 flex-col justify-center items-center h-screen w-screen bg-blue-500">
            
            <div className='absolute top-[10px] lg:right-[5%] lg:top-[50%] flex flex-col items-center justify-center bg-blue-700 p-5 rounded-md' >
                <h1 className='text-xl text-white font-bold' >{started ? 2 : "Waiting for other Player... "+ numPlayers}/2</h1>
                <h1 className='text-2xl text-white font-bold' >Room ID: {roomId}</h1>
                <div className="flex justify-center" >
                    < h1 className="text-2xl font-medium text-blue-300" >{userName} vs. {opponent.userName}</h1>
                </div>
            </div>

            <ChatBox myColor={myColor} displayName={userName} />
            <Board myColor={myColor} start={started} showReturn={() => {  returnRef.current?.classList.add('z-10'); returnRef.current?.show(); }} />
        </div>
    
    </>
}