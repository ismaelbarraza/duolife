import React from 'react'

export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h1 className="font-display text-2xl text-white leading-none">{title}</h1>
        {subtitle && (
          <p className="text-white/40 font-body text-sm mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
