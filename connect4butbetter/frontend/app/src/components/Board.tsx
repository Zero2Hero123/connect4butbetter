import { useEffect, useState, useContext, useMemo, useRef } from "react"
import Chip from "./chip"
import PowerUp from "./PowerUp";
import { socketCtx } from "../App";



export default function Board({start, myColor, testMode = false}: {start: boolean, myColor: 'red' | 'yellow', testMode?: boolean}){

    const [boardGrid,updateBoard] = useState<string[][]>(
        [
            [],
            [],
            [],
            [],
            [],
            [],
            []
        ]
    )

    const [isMyTurn, setIsTurn] = useState<boolean>()
    const resultRef = useRef<HTMLHeadingElement>(null)

    useEffect(() => {
        setIsTurn(myColor == 'yellow')
    },[myColor]) 

    function checkForWin(forColor: 'red' | 'yellow'): boolean{
        // up-down 4s

        for(let i = 0; i < boardGrid.length; i++){
            let countsOfSameColor = 0; // counts of same color
            for(let j = 0; j < boardGrid[0].length; j++){
                if(boardGrid[i][j] != forColor){
                    countsOfSameColor = 0
                } else {
                    countsOfSameColor++;
                }

                if(countsOfSameColor >= 4){
                    return true;
                }
            }
        }

        // right-left 4s

        for(let b = 0; b < boardGrid[0].length; b++){
            let countsOfSameColor = 0; // counts of same color
            for (let a = 0; a < boardGrid.length; a++) {
                if(boardGrid[a][b] != forColor){
                    countsOfSameColor = 0
                } else {
                    countsOfSameColor++;
                }

                if(countsOfSameColor >= 4){
                    return true;
                }
            }
        }

        // diagonal 4s
        let z = 0;
        let y = 0;
        while(z < boardGrid.length && z < boardGrid[0].length){
            let countsOfSameColor = 0; // counts of same color

            if(boardGrid[z][y] != forColor){
                countsOfSameColor = 0
            } else {
                countsOfSameColor++;
            }

            if(countsOfSameColor >= 4){
                return true;
            }

            z++;
            y++;
        }

        // let c = 0;
        // let d = 0;
        // while(c < boardGrid.length && c < boardGrid[0].length){
        //     let countsOfSameColor = 0; // counts of same color

        //     if(boardGrid[c][d] != forColor){
        //         let countsOfSameColor = 0
        //     } else {
        //         countsOfSameColor++;
        //     }

        //     if(countsOfSameColor >= 4){
        //         return true;
        //     }

        //     c++;
        //     d++;
        // }

        return false

    }

    const socket = useContext(socketCtx)

    function addChip(color: 'red' | 'yellow',column: number){
        if(boardGrid[column].length >= 6) return;

        if(!isMyTurn){
            
            return;
        }

        const currBoard = Array.from(boardGrid);

        currBoard[column].unshift(color);

        updateBoard(currBoard)

        socket.emit('play-move',{color, column})
        
        setIsTurn(prev => !prev)

        if(checkForWin(myColor)){
            socket.emit('win',myColor)

            setIsTurn(false)
        }
    }


    useEffect(() => {

        socket.on('opp-won', (color) => {
            setIsTurn(false)

            resultRef.current.textContent = "You Lost!";
        })

        socket.on('opp-move', ({color,column}) => {

            const currBoard = Array.from(boardGrid);

            currBoard[column].unshift(color);

            updateBoard(currBoard)
        })

        socket.on('switch-turns', () => {

            setIsTurn((prev) => !prev) 

        })
    },[])

    const oppColor = useMemo(() => {
        
        return myColor == 'red' ? 'yellow' : 'red'
    },[myColor])
    
    return <>
        <div >

            {isMyTurn ? <Chip color={myColor}/>: <Chip color={oppColor} />} 
            <h1 className='text-white font-medium text-3xl' >
                {isMyTurn ? "Your Turn" : "Your Opponents Turn"}
            </h1>

        </div>
        <h1 ref={resultRef} className="text-yellow-500 font-bold text-4xl" ></h1>
        <div className="relative border-8 border-blue-800 rounded-sm grid grid-cols-7 w-[43%] min-w-[400px] aspect-[5/4] bg-blue-700" >
           <div className="flex flex-col justify-end border border-blue-600">
                {boardGrid[0].map((c,i) => <Chip key={i} color={c} /> )}

           </div>
           <div className="flex flex-col justify-end border border-blue-600">
                {boardGrid[1].map((c,i) => <Chip key={i} color={c} /> )}
           </div>
           <div className="flex flex-col justify-end border border-blue-600">
                {boardGrid[2].map((c,i) => <Chip key={i} color={c} /> )}
           </div>
           <div className="flex flex-col justify-end border border-blue-600">
                {boardGrid[3].map((c,i) => <Chip key={i} color={c} /> )}
           </div>
           <div className="flex flex-col justify-end border border-blue-600">
                {boardGrid[4].map((c,i) => <Chip key={i} color={c} /> )}
           </div>
           <div className="flex flex-col justify-end border border-blue-600">
                {boardGrid[5].map((c,i) => <Chip key={i} color={c} /> )}
           </div>
           <div className="flex flex-col justify-end border border-blue-600">
                {boardGrid[6].map((c,i) => <Chip key={i} color={c} /> )}
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