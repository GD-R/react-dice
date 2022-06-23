import React from 'react'

export default function Buttons(props) {
  
  const color = {
    bColor: props.freeze? "bg-sky-500" : "bg-transparent",
    tColor: props.freeze? "text-black" : "text-blue-500"
  }

  return (    
    <div>
      <button  disabled={props.click} onClick={props.updateFreeze} className={`p-1 px-3 ${color.bColor} ${color.tColor} border-2 border-blue-500  text-lg rounded-lg hover:bg-sky-500 hover:text-gray-100 active:bg-blue-500 active:text-gray-100 m-2 font-bold`}>{props.num}</button>
    </div>
  )
}
