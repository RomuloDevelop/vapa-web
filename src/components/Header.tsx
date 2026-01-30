"use client";

export function Header() {
  const navItems = [
    { label: "Home", active: true },
    { label: "About", active: false },
    { label: "Events", active: false },
    { label: "Membership", active: false },
    { label: "Donations", active: false },
    { label: "Digital Library", active: false },
    { label: "Contact", active: false },
  ];

  return (
    <header className="flex items-center justify-between px-20 py-6 bg-[var(--color-bg-dark)]">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-lg"
          style={{
            background: "linear-gradient(135deg, #D4A853 0%, #B8923D 100%)",
          }}
        />
        <span className="text-[28px] font-bold text-white">VAPA</span>
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-10">
        {navItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={`text-[15px] font-medium transition-colors hover:text-[var(--color-primary)] ${
              item.active
                ? "text-[var(--color-primary)]"
                : "text-[var(--color-text-muted)]"
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* CTA Button */}
      <button className="px-7 py-3.5 bg-[var(--color-primary)] text-[var(--color-bg-dark)] text-sm font-semibold rounded hover:opacity-90 transition-opacity">
        Join VAPA
      </button>
    </header>
  );
}
