import { useRef, useEffect } from "react"



interface Props {
    name: string
}

export default function PowerUpLabel({name}: Props){

    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(name === 'none') return;

        divRef.current?.classList.toggle('hidden')
        divRef.current?.classList.toggle('animate-growIn');
        console.log(name)

        setTimeout(() => {
            divRef.current?.classList.toggle('hidden')
            divRef.current?.classList.toggle('animate-growIn')
        },2000);

    },[name])

    return <>

        <div ref={divRef} className="absolute hidden flex flex-col justify-center items-center  z-[12] w-screen h-screen text-blue-300" >

            <p className="text-3xl font-medium " >POWER UP</p>
            <p className="text-5xl font-bold " >{name}</p>

        </div>

    </>

}