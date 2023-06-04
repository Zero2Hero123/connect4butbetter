import { useEffect, useState, useContext } from "react"

import { socketCtx } from "../App";

interface Props {
    name: string,
    board: string[][],
    canUse: boolean,
    setBoard: React.Dispatch<React.SetStateAction<string[][]>>
    showPowerUpName: (name: string) => void
}

export default function PowerUp({name,board, setBoard, showPowerUpName,canUse}: Props){

    const socket = useContext(socketCtx)


    useEffect(() => {

        socket.on('opp-used',(powerUpName) => {
            showPowerUpName(powerUpName)
            setTimeout(() => {
                showPowerUpName("none")
            },4500)
        })

    },[])

    function use(){

        if(!canUse) return;
        
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
        socket.emit('power-up-used',name)
        setTimeout(() => {
            showPowerUpName("none")
        },4500)

    }

    return <>
    
        {canUse ? <div onClick={use} className="flex justify-center items-center h-20 w-20 transition-all hover:cursor-pointer border-1 hover:border-[4px] border-blue-300 mt-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-md " >
            <p className="text-white font-medium " >{name}</p>
        </div> : 
        <div onClick={use} className="flex justify-center items-center h-20 w-20 transition-all border-blue-300 mt-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-md " >
            <p className="text-white font-medium opacity-50" >{name}</p>
        </div>}
    
    </>
}