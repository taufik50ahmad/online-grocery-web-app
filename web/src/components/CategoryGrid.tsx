import { categories } from "../data/categories";

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 lg:px-8">
      <div className="rounded-[2rem] bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">
            Kategori Pilihan
          </h2>
          <button className="text-sm font-black text-red-600">
            Lihat Semua
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3 md:grid-cols-8">
          {categories.map((category) => (
            <button
              key={category.name}
              className="rounded-2xl p-3 text-center transition hover:bg-red-50"
            >
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-50 text-2xl">
                {category.icon}
              </div>
              <p className="mt-2 text-xs font-bold text-slate-700">
                {category.name}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
