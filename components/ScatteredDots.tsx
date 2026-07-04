import React from 'react'

export default function ScatteredDots({right_left, top_bottom}: {right_left: string, top_bottom: string}) {
  return (
   <div className="pointer-events-none absolute inset-0 hidden sm:block">
        <span className={`absolute ${right_left}-[60%] ${top_bottom}-[20%] h-2 w-2 rounded-full bg-violet-400/70`}/>
        <span className={`absolute ${right_left}-[81%] ${top_bottom}-[18%] h-2 w-2 rounded-full bg-violet-300/60`}/>
        <span className={`absolute ${right_left}-[91%] ${top_bottom}-[17%] h-2.5 w-2.5 rounded-full bg-violet-400/80`}/>
        <span className={`absolute ${right_left}-[51%] ${top_bottom}-[57%] h-1.5 w-1.5 rounded-full bg-violet-400/60`}/>
        <span className={`absolute ${right_left}-[95%] ${top_bottom}-[55%] h-1.5 w-1.5 rounded-full bg-violet-300/50`}/>
        <span className={`absolute ${right_left}-[56%] ${top_bottom}-[67%] h-1.5 w-1.5 rounded-full bg-violet-400/50`}/>
        <span className={`absolute ${right_left}-[88%] ${top_bottom}-[68%] h-2 w-2 rounded-full bg-violet-300/70`}/>
        <span className={`absolute ${right_left}-[84%] ${top_bottom}-[10%] h-1 w-1 rounded-full bg-violet-300/50`}/>
    </div>
  )
}
