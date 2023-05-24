import { useEffect, useState, useContext } from "react"

import { socketCtx } from "../App";

interface Props {
    name: string,
    board: string[][],
    setBoard: React.Dispatch<React.SetStateAction<string[][]>>
    showPowerUpName: (name: string) => void
}

export default function PowerUp({name,board, setBoard, showPowerUpName}: Props){

    const socket = useContext(socketCtx)

    function use(){


        
        switch(name){
            case 'Randomize':

                let newBoard = [
                    new Array(6).fill('empty'),
                    new Array(6).fill('empty'),
                    new Array(6).fill('empty'),
                    new Array(6).fill('empty'),
                    new Array(6).fill('empty'),
                    new Array(6).fill('empty'),
                    new Array(6).fill('empty')
                ]

                const boardFlat = board.flat().filter((c) => c != 'empty');

                for(let i = 0; i < boardFlat.length; i++){
                    const col = Math.round(Math.random()*6);

                    for(let j = 0; j < newBoard[col].length; j++){
                        if(newBoard[col][j] == 'empty'){
                            newBoard[col][j] = boardFlat[i];
                            break;
                        }
                    }
                }

                setBoard(newBoard);
                socket.emit('update',newBoard)

            break;
        }

        showPowerUpName(name)

    }

    return <>
    
        <div onClick={use} className="flex justify-center items-center h-20 w-20 transition-all hover:cursor-pointer border-1 hover:border-[4px] border-blue-300 mt-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-md " >
            <p className="text-white font-medium " >{name}</p>
        </div>
    
    </>
}