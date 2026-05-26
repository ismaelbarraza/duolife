import React from 'react'

export default function CoinBalance({ user, size = 'md' }) {
  const sizes = {
    sm: { amount: 'text-sm', name: 'text-xs', avatar: 'w-7 h-7 text-sm' },
    md: { amount: 'text-base', name: 'text-xs', avatar: 'w-9 h-9 text-lg' },
    lg: { amount: 'text-2xl', name: 'text-sm', avatar: 'w-12 h-12 text-2xl' },
  }

  const s = sizes[size] || sizes.md

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
      <div
        className={`${s.avatar} rounded-full flex items-center justify-center shrink-0`}
        style={{ background: `${user.color}18`, border: `1.5px solid ${user.color}35` }}
      >
        <span>{user.emoji}</span>
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-slate-500 font-body ${s.name} leading-none mb-0.5`}>{user.name}</p>
        <div className="flex items-center gap-1">
          <span className={`${s.amount} font-body font-semibold`} style={{ color: user.color }}>
            {user.coins.toLocaleString()}
          </span>
          <span className="text-slate-400 text-xs font-body">pts</span>
        </div>
      </div>
    </div>
  )
}
