

interface Props {
    author: string,
    color: 'red' | 'yellow',
    content: string
}

export default function ChatMessage({author,color,content}: Props){


    return <>
    
        <div className="bg-blue-800" >
            <span className={color} >{author}</span> <span>{content}</span>
        </div>
    
    </>
}