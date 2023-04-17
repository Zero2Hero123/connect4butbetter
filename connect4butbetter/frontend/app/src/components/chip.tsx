import YellowChip from '../assets/Ychip.png'

import RedChip from '../assets/Rchip.png'


interface Props {
    color: 'yellow' | 'red' | string
}

export default function Chip({color}: Props) {

    const colorSrc = color == 'yellow' ? YellowChip : RedChip

    return <>
    
        <div className="w-[100%] h-[90px] flex justify-center items-center" >
            <img className="h-20" src={colorSrc} alt="" />
        </div>
    
    </>
}