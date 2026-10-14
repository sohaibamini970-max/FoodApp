export default function Footer() {
  const cols = [
    { title: "Company", links: ["About", "Careers", "Press", "Blog"] },
    { title: "Support", links: ["Help Center", "Contact", "Privacy", "Terms"] },
    { title: "Partners", links: ["Restaurants", "Riders", "Affiliates", "Developers"] },
  ];

  return (
    <footer className="border-t border-white/10 pt-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl">🍔</span>
              <span className="text-2xl font-black">
                Foodie
                <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  Hub
                </span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-gray-400">
              Delivering happiness, one meal at a time. Your favorite food, fast
              and fresh.
            </p>
            <div className="mt-6 flex gap-3">
              {["𝕏", "f", "in", "ig"].map((s) => (
                <button
                  key={s}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-orange-500"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="font-bold">{col.title}</h4>
              <ul className="mt-4 space-y-3 text-sm text-gray-400">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="transition hover:text-orange-400">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 text-sm text-gray-500 sm:flex-row">
          <div>© 2025 FoodieHub. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="transition hover:text-white">Privacy</a>
            <a href="#" className="transition hover:text-white">Terms</a>
            <a href="#" className="transition hover:text-white">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}