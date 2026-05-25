import React from 'react'

export default function CoinBalance({ user, size = 'md' }) {
  const sizes = {
    sm: { coin: 'text-base', amount: 'text-sm', name: 'text-xs', avatar: 'w-7 h-7 text-sm' },
    md: { coin: 'text-xl', amount: 'text-base', name: 'text-xs', avatar: 'w-9 h-9 text-lg' },
    lg: { coin: 'text-3xl', amount: 'text-2xl', name: 'text-sm', avatar: 'w-12 h-12 text-2xl' },
  }

  const s = sizes[size] || sizes.md

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl"
      style={{
        background: `${user.color}0d`,
        border: `1px solid ${user.color}25`,
      }}
    >
      <div
        className={`${s.avatar} rounded-full flex items-center justify-center shrink-0`}
        style={{ background: `${user.color}18`, border: `1.5px solid ${user.color}40` }}
      >
        <span>{user.emoji}</span>
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-white/50 font-body ${s.name} leading-none mb-0.5`}>{user.name}</p>
        <div className="flex items-center gap-1">
          <span className={`${s.amount} font-mono font-medium`} style={{ color: user.color }}>
            {user.coins.toLocaleString()}
          </span>
          <span className={s.coin}>🪙</span>
        </div>
      </div>
    </div>
  )
}
