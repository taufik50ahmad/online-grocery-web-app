export function PromoSection() {
  return (
    <section className="mx-auto grid max-w-7xl gap-4 px-4 py-5 md:grid-cols-3 lg:px-8">
      <PromoCard label="Voucher Belanja" title="Diskon s/d Rp25.000" description="Gunakan voucher untuk transaksi berikutnya." className="from-yellow-300 to-orange-400 text-slate-900" />
      <PromoCard label="Beli 1 Gratis 1" title="Produk pilihan" description="Promo khusus untuk item tertentu." className="from-red-600 to-red-500 text-white" />
      <PromoCard label="Gratis Ongkir" title="Member setia" description="Reward setelah beberapa transaksi." className="from-cyan-500 to-blue-600 text-white" />
    </section>
  );
}

function PromoCard({ label, title, description, className }: { label: string; title: string; description: string; className: string }) {
  return (
    <article className={`rounded-[2rem] bg-gradient-to-br p-5 shadow-sm ${className}`}>
      <p className="text-xs font-black uppercase tracking-wide opacity-80">{label}</p>
      <h3 className="mt-2 text-2xl font-black">{title}</h3>
      <p className="mt-2 text-sm font-semibold opacity-80">{description}</p>
    </article>
  );
}
