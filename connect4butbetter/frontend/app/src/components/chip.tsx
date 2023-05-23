import YellowChip from '../assets/Ychip.png'

import RedChip from '../assets/Rchip.png'


interface Props {
    color: 'yellow' | 'red' | string
    asNormalImg?: boolean
}

export default function Chip({color, asNormalImg = false}: Props) {

    const colorSrc = color == 'yellow' ? YellowChip : RedChip

    
    const style = asNormalImg ? "w-[100%] h-[90px] flex justify-center items-center" : "w-[100%] aspect-square flex justify-center items-center animate-insertChip"

    return <>
    
        <div className={style} >
            <img className={asNormalImg ? "h-[100px]" : "w-[100%] h-[100%]"} src={colorSrc} alt="A playing chip" />
        </div>
    
    </>
}