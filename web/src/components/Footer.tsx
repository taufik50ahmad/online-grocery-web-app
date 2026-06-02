import { Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 px-4 py-10 text-white lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-red-600 font-black">
              F
            </div>
            <p className="text-xl font-black">FreshMart</p>
          </div>

          <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">
            Web grocery online dengan rekomendasi toko terdekat, stok cabang,
            promo, dan pengalaman belanja mobile-first.
          </p>
        </div>

        <div>
          <h3 className="font-black">Menu</h3>

          <div className="mt-4 grid gap-2 text-sm text-slate-400">
            <a href="#">Home</a>
            <a href="#">Kategori</a>
            <a href="#">Promo</a>
            <a href="#">Produk</a>
          </div>
        </div>

        <div>
          <h3 className="font-black">Kontak</h3>

          <div className="mt-4 grid gap-3 text-sm text-slate-400">
            <p className="flex items-center gap-2">
              <Phone size={16} />
              1500-000
            </p>

            <p className="flex items-center gap-2">
              <Mail size={16} />
              support@freshmart.test
            </p>

            <div className="flex gap-3 pt-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-xs font-black">
                FB
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-xs font-black">
                IG
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-xs font-black">
                X
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}