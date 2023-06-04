import { useMemo } from "react"


interface Props {
    author: string,
    color: 'red' | 'yellow',
    content: string
}

export default function ChatMessage({author,color,content}: Props){


    let authorColor = useMemo(() => {
        return color == 'yellow' ? 'text-yellow-500' : 'text-red-500';
    },[color])

    return <>
    
        <div className=" text-white" >
            <span className={`font-medium ${authorColor}`} >{author}</span> <span>{content}</span>
        </div>
    
    </>
}