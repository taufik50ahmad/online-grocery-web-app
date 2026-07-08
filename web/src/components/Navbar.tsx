type IconProps = {
  size?: number;
  className?: string;
};

function Search({ size = 18, className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function MapPin({ size = 17, className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 21s-6-5.27-6-10a6 6 0 1 1 12 0c0 4.73-6 10-6 10z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ShoppingCart({ size = 19, className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 6h15l-1.5 9h-13z" />
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
    </svg>
  );
}

function UserRound({ size = 19, className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21c1.5-4 5.5-6 7-6s5.5 2 7 6" />
    </svg>
  );
}

function Menu({ size = 19, className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  );
}
type Store = {
  name?: string;
} | null;

type NavbarProps = {
  selectedStore?: Store;
  query: string;
  setQuery: (value: string) => void;
  onAuthClick?: () => void;
  onCartClick?: () => void;
};

export function Navbar({ selectedStore, query, setQuery, onAuthClick, onCartClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-red-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-red-600 text-xl text-white">
            F
          </div>
          <div>
            <p className="text-lg font-black leading-none text-red-600">
              Finpro
            </p>
            <p className="text-[11px] font-semibold text-slate-500">
              Online Marketplace
            </p>
          </div>
        </div>

        <div className="hidden flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 md:flex">
          <Search size={18} className="text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari minyak, beras, susu..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>

        <div className="ml-auto hidden max-w-xs items-center gap-2 rounded-2xl bg-red-50 px-3 py-2 text-red-700 md:flex">
          <MapPin size={17} />
          <span className="truncate text-xs font-bold">
            {selectedStore?.name || "Mencari toko..."}
          </span>
        </div>

        <button className="rounded-2xl bg-slate-100 p-3 text-slate-700 md:hidden">
          <Search size={19} />
        </button>
        <button 
        onClick={onCartClick}
        className="rounded-2xl bg-red-600 p-3 text-white">
          <ShoppingCart size={19} />
        </button>
        <button
          onClick={onAuthClick}
          className="hidden rounded-2xl bg-slate-100 p-3 text-slate-700 hover:bg-slate-200 transition-colors md:block"
        >
          <UserRound size={19} />
        </button>
        <button className="rounded-2xl border border-slate-200 p-3 md:hidden">
          <Menu size={19} />
        </button>
        
        <button
  type="button"
  onClick={onAuthClick}
  className="rounded-2xl border border-slate-200 p-3 md:hidden"
>
  <Menu size={19} />
</button>
      </div>
    </header>
  );
}
