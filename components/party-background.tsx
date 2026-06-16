export function PartyBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
      <div
        className="animate-float-blob absolute -left-20 -top-20 size-72 rounded-full opacity-25 blur-3xl"
        style={{ background: 'oklch(0.68 0.23 8)' }}
      />
      <div
        className="animate-float-blob absolute right-0 top-1/4 size-80 rounded-full opacity-20 blur-3xl"
        style={{ background: 'oklch(0.74 0.15 205)', animationDelay: '3s' }}
      />
      <div
        className="animate-float-blob absolute bottom-0 left-1/3 size-96 rounded-full opacity-20 blur-3xl"
        style={{ background: 'oklch(0.83 0.17 88)', animationDelay: '6s' }}
      />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(currentColor 1.5px, transparent 1.5px)',
          backgroundSize: '28px 28px',
        }}
      />
    </div>
  )
}
