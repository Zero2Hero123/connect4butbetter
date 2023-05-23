import { useEffect, useState } from "react"

interface Props {
    name: string
}

export default function PowerUp({name}: Props){


    function use(){
        
    }


    return <>
    
        <div onClick={use} className="flex justify-center items-center h-20 w-20 transition-all hover:cursor-pointer border-1 hover:border-[4px] border-blue-300 mt-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-md " >
            <p className="text-white font-medium " >{name}</p>
        </div>
    
    </>
}