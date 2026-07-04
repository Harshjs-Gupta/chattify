import React from 'react'

export default function ChatBubbleIcon() {
  return (
    <div className="relative">
              <svg
                viewBox="0 0 200 180"
                className="h-56 w-56 drop-shadow-[0_0_40px_rgba(139,92,246,0.5)] sm:h-72 sm:w-72 md:h-80 md:w-80"
              >
                <defs>
                  <linearGradient id="bubbleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
                <path
                  d="M100 10
                     C 150 10, 185 42, 185 85
                     C 185 128, 150 160, 100 160
                     C 88 160, 76 158, 65 154
                     L 35 172
                     C 30 175, 24 171, 26 165
                     L 35 138
                     C 21 122, 15 104, 15 85
                     C 15 42, 50 10, 100 10 Z"
                  fill="#06030f"
                  stroke="url(#bubbleGrad)"
                  strokeWidth="6"
                />
                <circle cx="68" cy="85" r="9" fill="#a78bfa" />
                <circle cx="100" cy="85" r="9" fill="#c4b5fd" />
                <circle cx="132" cy="85" r="9" fill="#a78bfa" />
              </svg>
            </div>
  )
}
