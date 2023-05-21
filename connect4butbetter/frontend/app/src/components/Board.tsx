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
        const boardHeight: number = 6;

        // up-down 4s
        for(let i = 0; i < boardGrid.length; i++){
            let countsOfSameColor = 0; // counts of same color
            for(let j = 0; j < boardHeight; j++){
                if(boardGrid[i][j] !== forColor){
                    countsOfSameColor = 0
                } else {
                    countsOfSameColor++;
                }

                if(countsOfSameColor >= 4){
                    console.log('up-down win')
                    return true;
                }
            }
        }

        // right-left 4s broken issue

        for(let a = 0; a < boardHeight; a++){
            let countsOfSameColor = 0;
            for(let b = 0; b < boardGrid.length; b++){

                if(boardGrid[b][a] !== forColor || boardGrid[b][a] === undefined){
                    countsOfSameColor = 0;
                } else {
                    countsOfSameColor++;
                }

                if(countsOfSameColor >= 4){
                    console.log('right-left win')
                    return true;
                }

            }

        }

        // diagonal 4s
        for(let x = 0; x < boardGrid.length; x++){
            for(let y = 0; y < boardHeight; y++){

                let diagonalIndicesRight: string[] = [''];
                let diagonalIndicesLeft: string[] = [''];
                
                if(x >= 3){
                    diagonalIndicesLeft = [boardGrid[x][y],boardGrid[x-1][y-1],boardGrid[x-2][y-2],boardGrid[x-3][y-3]]
                }

                if(x <= 3){
                    diagonalIndicesRight = [boardGrid[x][y],boardGrid[x+1][y+1],boardGrid[x+2][y+2],boardGrid[x+3][y+3]]
                }

                let check1 = diagonalIndicesLeft.every((v) => v === forColor);
                let check2 = diagonalIndicesRight.every((v) => v === forColor);



                if(check1 || check2){
                    console.log('diagonal win')
                    return true;
                }

            }
        }


        return false

    }

    const socket = useContext(socketCtx)

    function addChip(color: 'red' | 'yellow',column: number){
        if(boardGrid[column].length >= 6) return;

        if(!isMyTurn){
            // alert("It's not your turn!")
            
            return;
        }

        const currBoard = Array.from(boardGrid);

        currBoard[column].unshift(color);

        socket.emit('play-move',{color, column})

        console.log(checkForWin(myColor))

        if(checkForWin(myColor)){
            socket.emit('win',myColor)

            setIsTurn(false)
        }

        console.log(currBoard)

        updateBoard(currBoard)
        setIsTurn(prev => !prev)
        console.log('done')
    }


    useEffect(() => {

        socket.on('opp-won', (color) => {
            setIsTurn(false)

            if(resultRef.current){
                resultRef.current.textContent = "You Lost!";
            }
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

            {isMyTurn ? <Chip asNormalImg={true} color={myColor}/>: <Chip asNormalImg={true} color={oppColor} />} 
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