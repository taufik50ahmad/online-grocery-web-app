import { useMemo, useState } from "react";
import { Navbar } from "../components/Navbar";
import { LocationStoreCard } from "../components/LocationStoreCard";
import HeroCarousel from "../components/HeroCarousel";
import { CategoryGrid } from "../components/CategoryGrid";
import { PromoSection } from "../components/PromoSection";
import { ProductList } from "../components/ProductList";
import { Footer } from "../components/Footer";
import { defaultStoreId, stores } from "../data/stores";
import { products } from "../data/products";
import { findNearestStore } from "../utils/distance";
import { useNavigate } from "react-router-dom";

export default function HomePages() {
  const defaultStore =
    stores.find((store) => store.id === defaultStoreId) || stores[0];

  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState(defaultStore);
  const [distanceKm, setDistanceKm] = useState<number | undefined>();
  const [isOutOfRange, setIsOutOfRange] = useState(false);
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "loading" | "granted" | "denied" | "error"
  >("idle");

  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      const matchStore = product.storeId === selectedStore.id;
      const keyword = query.toLowerCase();
      const matchSearch =
        product.name.toLowerCase().includes(keyword) ||
        product.category.toLowerCase().includes(keyword);

      return matchStore && matchSearch;
    });
  }, [query, selectedStore.id]);

  function detectLocation() {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      return;
    }
    setLocationStatus("loading");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        const nearest = findNearestStore(userLocation, stores);

        setSelectedStore(nearest.store);
        setDistanceKm(nearest.distanceKm);
        setIsOutOfRange(
          nearest.distanceKm > nearest.store.maxServiceDistanceKm,
        );
        setLocationStatus("granted");
      },
      () => {
        setSelectedStore(defaultStore);
        setDistanceKm(undefined);
        setIsOutOfRange(false);
        setLocationStatus("denied");
      },
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar
        selectedStore={selectedStore}
        query={query}
        setQuery={setQuery}
        onAuthClick={() => navigate("/login")}
        onCartClick={() => navigate("/cart")}
      />
      <LocationStoreCard
        selectedStore={selectedStore}
        distanceKm={distanceKm}
        isOutOfRange={isOutOfRange}
        locationStatus={locationStatus}
        onDetectLocation={detectLocation}
      />
      <HeroCarousel />
      <CategoryGrid />
      <PromoSection />
      <ProductList
        products={visibleProducts}
        selectedStore={selectedStore}
        disabled={isOutOfRange}
      />
      <Footer />
    </main>
  );
}
