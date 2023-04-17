import { useEffect, useState } from "react"



export default function PowerUp({name}: {name: string}){

    const [cooldown,setCD] = useState(5)
    const [using,setUsing] = useState(false)

    function use(){
        setUsing(true)
    }

    useEffect(() => {
        if(!using) return;

        if(cooldown <= 0){
            setUsing(false)
        }
    
        setTimeout(() => {
            setCD((prev) => prev - 1)
        },1000)


        

        
    },[using,cooldown])

    return <>
    
        <div onClick={use} className="flex justify-center items-center h-20 w-20 transition-all hover:cursor-pointer border-1 hover:border-[4px] border-blue-300 mt-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-md " >
            {using ? <p className="text-white font-medium " >{cooldown}</p> : <p className="text-white font-medium " >{name}</p>}
        </div>
    
    </>
}