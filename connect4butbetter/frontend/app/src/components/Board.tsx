import ReactDOM from "react"
import { useEffect, useState, useContext, useMemo, useRef, useLayoutEffect } from "react"

// components
import Chip from "./chip"
import PowerUp from "./PowerUp";
import PowerUpLabel from "./PowerUpLabel";

import { socketCtx } from "../App";

interface Props {
    start: boolean,
    myColor: 'red' | 'yellow',
    testMode?: boolean,
    showReturn: () => void

}


export default function Board({start, myColor,showReturn, testMode = false}: Props){

    const [boardGrid,updateBoard] = useState<string[][]>(
        [
            new Array(6).fill('empty'),
            new Array(6).fill('empty'),
            new Array(6).fill('empty'),
            new Array(6).fill('empty'),
            new Array(6).fill('empty'),
            new Array(6).fill('empty'),
            new Array(6).fill('empty')
        ]
    )



    const [isMyTurn, setIsTurn] = useState<boolean>()
    const [lastPowerUp,setPowerUp] = useState<string>("none")
    const resultRef = useRef<HTMLHeadingElement>(null)
    const [canUsePowerUp,setCanUse] = useState<boolean>(false)

    useEffect(() => {
        setIsTurn(myColor == 'yellow')
        setCanUse(myColor == 'yellow')
    },[myColor])

    const socket = useContext(socketCtx)

    function addChip(color: 'red' | 'yellow',column: number){
        console.log(isMyTurn)
        if(boardGrid[column].every((c) => c == 'red' || c == 'yellow')) return;
        console.log('e')
        if(!isMyTurn){
            // alert("It's not your turn!")
            
            return;
        }

        const currBoard = Array.from(boardGrid);

        for(let i = 0; i < currBoard[column].length; i++){
            if(currBoard[column][i] == 'empty'){
                currBoard[column][i] = color;
                break;
            }
        }

        updateBoard(currBoard)
        setIsTurn(prev => !prev)
        setCanUse(prev => !prev)

        socket.emit('play-move',{color, column,currBoard},(won: boolean) => {
            if(won){
                if(resultRef.current){
                    resultRef.current.textContent = "You Win!";
                }
                
                showReturn();
            }

            setIsTurn(false)
        })
        console.log('done')
    }

    function showPowerUp(name: string){
        setPowerUp(name)

        setIsTurn(prev => !prev)
        setCanUse(prev => !prev)
    }


    useEffect(() => {
        socket.on('win-event', (winningColor: 'red' | 'yellow') => {
            
            if(resultRef.current){
                resultRef.current.textContent = "You Lost!";
            }

            showReturn();

            setIsTurn(false)
        })

        

        socket.on('update-board', (newBoard) => {

            updateBoard(newBoard)
        })

        socket.on('switch-turns', () => {

            setIsTurn(prev => !prev) // flip turns
            setCanUse(prev => !prev) // flip can-use-power-ups

        })

        socket.on('update-boards',(newBoard) =>{
            updateBoard(newBoard);
        })

    },[])

    const oppColor = useMemo(() => {
        
        return myColor == 'red' ? 'yellow' : 'red'
    },[myColor])
    
    return <>
    <PowerUpLabel name={lastPowerUp} />
        <div >

            {isMyTurn ? <Chip asNormalImg={true} color={myColor}/>: <Chip asNormalImg={true} color={oppColor} />} 
            <h1 className='text-white font-medium text-3xl' >
                {isMyTurn ? "Your Turn" : "Your Opponents Turn"}
            </h1>

        </div>
        <h1 ref={resultRef} className="text-yellow-500 font-bold text-4xl" ></h1>
        <div className="relative border-8 border-blue-800 rounded-sm grid grid-cols-7 w-[43%] min-w-[400px] aspect-[5/4] bg-blue-700" >
           <div className="flex  flex-col-reverse justify-start border border-blue-600">
                {boardGrid[0].filter((c) => c != 'empty').map((c,i) => <Chip key={i} color={c} /> )}

           </div>
           <div className="flex flex-col-reverse justify-start border border-blue-600">
                {boardGrid[1].filter((c) => c != 'empty').map((c,i) => <Chip key={i} color={c} /> )}
           </div>
           <div className="flex flex-col-reverse justify-start border border-blue-600">
                {boardGrid[2].filter((c) => c != 'empty').map((c,i) => <Chip key={i} color={c} /> )}
           </div>
           <div className="flex flex-col-reverse justify-start border border-blue-600">
                {boardGrid[3].filter((c) => c != 'empty').map((c,i) => <Chip key={i} color={c} /> )}
           </div>
           <div className="flex flex-col-reverse justify-start border border-blue-600">
                {boardGrid[4].filter((c) => c != 'empty').map((c,i) => <Chip key={i} color={c} /> )}
           </div>
           <div className="flex flex-col-reverse justify-start border border-blue-600">
                {boardGrid[5].filter((c) => c != 'empty').map((c,i) => <Chip key={i} color={c} /> )}
           </div>
           <div className="flex flex-col-reverse justify-start border border-blue-600">
                {boardGrid[6].filter((c) => c != 'empty').map((c,i) => <Chip key={i} color={c} /> )}
           </div>


            <div className="absolute left-0  grid grid-cols-7 w-[100%] aspect-[5/4]" >
                <div onClick={() => addChip(myColor,0)}  className="hover:cursor-pointer opacity-20 transition-all hover:bg-blue-600 "></div>
                <div onClick={() => addChip(myColor,1)}  className="hover:cursor-pointer opacity-20 transition-all hover:bg-blue-600 "></div>
                <div onClick={() => addChip(myColor,2)}  className="hover:cursor-pointer opacity-20 transition-all hover:bg-blue-600 "></div>
                <div onClick={() => addChip(myColor,3)}  className="hover:cursor-pointer opacity-20 transition-all hover:bg-blue-600 "></div>
                <div onClick={() => addChip(myColor,4)}  className="hover:cursor-pointer opacity-20 transition-all hover:bg-blue-600 "></div>
                <div onClick={() => addChip(myColor,5)}  className="hover:cursor-pointer opacity-20 transition-all hover:bg-blue-600 "></div>
                <div onClick={() => addChip(myColor,6)}  className="hover:cursor-pointer opacity-20 transition-all hover:bg-blue-600 "></div>
            </div>
        </div>
        <div className=" h-20 flex justify-center gap-2 w-[70%]" >
            {/* <PowerUp name="Randomize" canUse={canUsePowerUp} board={boardGrid} setBoard={updateBoard} showPowerUpName={showPowerUp} /> */}
        </div>
    
    </>
}