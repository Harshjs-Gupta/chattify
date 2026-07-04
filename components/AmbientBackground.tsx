import React from 'react'

export default function AmbientBackground({right_left, top_bottom}: {right_left: string, top_bottom: string}) {
  return (
    <div className="pointer-events-none absolute inset-0">
        <div className={`absolute ${right_left}-0 ${top_bottom}-1/4 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[120px]`} />
        <div className={`absolute bottom-0 ${right_left}-1/4 h-[300px] w-[600px] rounded-full bg-violet-500/10 blur-[100px]`} />
    </div>
  )
}
