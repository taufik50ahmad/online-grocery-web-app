import type { Store } from "../types/store";

type Coordinate = {
  latitude: number;
  longitude: number;
};

export function calculateDistanceKm(from: Coordinate, to: Coordinate) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(to.latitude - from.latitude);
  const dLon = toRadians(to.longitude - from.longitude);

  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function findNearestStore(userLocation: Coordinate, stores: Store[]) {
  return stores
    .map((store) => ({
      store,
      distanceKm: calculateDistanceKm(userLocation, {
        latitude: store.latitude,
        longitude: store.longitude,
      }),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)[0];
}
