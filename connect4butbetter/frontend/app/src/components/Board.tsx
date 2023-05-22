import { useEffect, useState, useContext, useMemo, useRef, useLayoutEffect } from "react"
import Chip from "./chip"
import PowerUp from "./PowerUp";
import { socketCtx } from "../App";



export default function Board({start, myColor, testMode = false}: {start: boolean, myColor: 'red' | 'yellow', testMode?: boolean}){

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
    const resultRef = useRef<HTMLHeadingElement>(null)

    useEffect(() => {
        setIsTurn(myColor == 'yellow')
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

        socket.emit('play-move',{color, column,currBoard})
        console.log('done')
    }


    useEffect(() => {
        socket.on('win-event', (color) => {
            setIsTurn(false)

            if(resultRef.current){
                resultRef.current.textContent = color == myColor ? "You Win!" : "You Lost!";
            }
        })



        socket.on('update-board', (newBoard) => {

            updateBoard(newBoard)
        })

        socket.on('switch-turns', () => {

            setIsTurn((prev) => !prev) 

        })

        socket.on('update-boards',(newBoard) =>{
            updateBoard(newBoard);
        })

    },[])

    const oppColor = useMemo(() => {
        
        return myColor == 'red' ? 'yellow' : 'red'
    },[myColor])
    
    return <>
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
        {/* <div className=" h-20" >
            <PowerUp name="Skip Turn" />
        </div> */}
    
    </>
}