"use client";
import axios from "axios";
import L from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";

type Props = {
  driverLocation: [number, number] | null;
  pickUpLocation: [number, number] | null;
  dropLocation: [number, number] | null;
  mapStatus: string;
  onStats: (data: {
    distanceToPickUp: number;
    distanceToDrop: number;
    etaPickUp: number;
    etaDrop: number;
  }) => void;
};

const pickUpIcon = new L.DivIcon({
  html: `
    <div style="display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.28))">
      <div style="background:#0a0a0a;color:#fff;padding:5px 13px;border-radius:100px;font-size:10px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;white-space:nowrap;font-family:system-ui">
        PICKUP
      </div>
      <div style="width:2px;height:9px;background:#0a0a0a"></div>
      <div style="width:10px;height:10px;background:#0a0a0a;border-radius:50%;border:2.5px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>
    </div>
  `,
  className: "",
  iconSize: [80, 50],
  iconAnchor: [40, 50],
});

const dropIcon = new L.DivIcon({
  html: `
    <div style="display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.28))">
      <div style="background:#0a0a0a;color:#fff;padding:5px 13px;border-radius:100px;font-size:10px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;white-space:nowrap;font-family:system-ui">
        DROP
      </div>
      <div style="width:2px;height:9px;background:#0a0a0a"></div>
      <div style="width:10px;height:10px;background:#0a0a0a;border-radius:50%;border:2.5px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>
    </div>
  `,
  className: "",
  iconSize: [70, 50],
  iconAnchor: [35, 58],
});

const driverIcon = new L.DivIcon({
  html: `
    <div id="car-marker" style="
      width:52px;
      height:52px;
      display:flex;
      align-items:center;
      justify-content:center;
      transform-origin:center;
      transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
      filter: drop-shadow(0 6px 18px rgba(0,0,0,0.5));
    ">
      <div style="
        background:#0a0a0a;
        width:46px;
        height:46px;
        border-radius:50%;
        display:flex;
        align-items:center;
        justify-content:center;
        box-shadow:0 0 0 3px #fff,0 0 0 5px #0a0a0a,0 8px 28px rgba(0,0,0,0.5);
      ">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 11L6.5 6.5H17.5L19 11" stroke="white" stroke-width="1.6" stroke-linecap="round"/>
          <rect x="3" y="11" width="18" height="7" rx="2" stroke="white" stroke-width="1.6"/>
          <circle cx="7.5" cy="18.5" r="1.5" fill="white"/>
          <circle cx="16.5" cy="18.5" r="1.5" fill="white"/>
          <path d="M3 14H21" stroke="white" stroke-width="1" opacity="0.35"/>
        </svg>
      </div>
    </div>
  `,
  className: "",
  iconSize: [52, 52],
  iconAnchor: [26, 26],
});

function LiveRideMap({
  driverLocation,
  pickUpLocation,
  dropLocation,
  mapStatus,
  onStats,
}: Props) {
  const [routeToPickup, setRouteToPickup] = useState<[number, number][]>([]);
  const [routeToDrop, setRouteToDrop] = useState<[number, number][]>([]);
  useEffect(() => {
    if (!driverLocation || !pickUpLocation || !dropLocation) return;
    const [pLat, pLon] = pickUpLocation;
    const [dLat, dLon] = dropLocation;
    const [drLat, drLon] = driverLocation;

    const getRoute = async (
      startLat: number,
      startLon: number,
      endLat: number,
      endLon: number,
    ) => {
      const res = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=full&geometries=geojson`,
      );
      return res.data.routes[0];
    };
    const fetchRoute = async () => {
      try {
        if (mapStatus == "arriving") {
          const pickUpRoute = await getRoute(drLat, drLon, pLat, pLon);
          const dropRoute = await getRoute(drLat, drLon, dLat, dLon);
          if (pickUpRoute) {
            setRouteToPickup(
              pickUpRoute.geometry.coordinates.map(([lon, lat]: number[]) => [
                lat,
                lon,
              ]),
            );
          }
          if (dropRoute) {
            setRouteToDrop(
              dropRoute.geometry.coordinates.map(([lon, lat]: number[]) => [
                lat,
                lon,
              ]),
            );
            onStats?.({
              distanceToPickUp: (pickUpRoute?.distance || 0) / 1000,
              etaPickUp: (pickUpRoute?.duration || 0) / 60,
              distanceToDrop: (dropRoute?.distance || 0) / 1000,
              etaDrop: (dropRoute?.duration || 0) / 60,
            });
          }
        } else {
          setRouteToPickup([]);
          const dropRoute = await getRoute(drLat, drLon, dLat, dLon);

          if (dropRoute) {
            setRouteToDrop(
              dropRoute.geometry.coordinates.map(([lon, lat]: number[]) => [
                lat,
                lon,
              ]),
            );
          }
          onStats?.({
            distanceToPickUp: 0,
            etaPickUp: 0,
            distanceToDrop: (dropRoute?.distance || 0) / 1000,
            etaDrop: (dropRoute?.duration || 0) / 60,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchRoute();
  }, [driverLocation, mapStatus, pickUpLocation, dropLocation]);

  const showPickMarker = mapStatus === "arriving";
  const showPickRoute = mapStatus === "arriving" && routeToPickup.length > 0;
  const showDropRoute = mapStatus !== "completed" && routeToDrop.length > 0;

  if (!pickUpLocation || !dropLocation) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading map...
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-zinc-100">
      <MapContainer
        style={{ width: "100%", height: "100%" }}
        center={pickUpLocation as any}
        zoom={10}
        preferCanvas
        scrollWheelZoom
        zoomControl={false}
      >
        <TileLayer
          attribution="&copy; CARTO contributors"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {showPickMarker && pickUpLocation && (
          <Marker position={pickUpLocation} icon={pickUpIcon} draggable />
        )}
        {dropLocation && (
          <Marker position={dropLocation} icon={dropIcon} draggable />
        )}

        {driverLocation && (
          <Marker position={driverLocation} icon={driverIcon} draggable />
        )}

        {showPickRoute && (
          <Polyline
            positions={routeToPickup}
            pathOptions={{
              color: "#111827",
              opacity: 0.9,
              weight: 7,
              dashArray: "2 10",
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        )}
        {showDropRoute && (
          <Polyline
            positions={routeToDrop}
            pathOptions={{
              color: "#111827",
              opacity: 0.9,
              weight: 7,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        )}
      </MapContainer>
      {/* <AnimatePresence>
        {!ready && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0 bg-white/90 z-999 backdrop-blur-md flex flex-col items-center justify-center gap-4"
          >
            <div className="relative w-14 h-14 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 rounded-full border-t-zinc-900 border-transparent"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 rounded-full border border-transparent border-t-zinc-300"
              />
              <MapPin size={15} className="text-zinc-800" />
            </div>
            <div className="text-center">
              <p className="text-zinc-900 text-xs font-black tracking-[0.22em] uppercase">
                Loading Map
              </p>
              <p className="text-zinc-400 font-medium text-[10px] tracking-wider mt-0.5">
                Plotting your route..
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence> */}
      {/* <AnimatePresence>
        {ready && kM !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-20 left-4 z-500 gap-2 flex items-center border bg-white border-zinc-200 px-3.5 py-2 rounded-xl shadow-lg "
          >
            <Navigation size={13} className="text-zinc-900" />
            <span className="text-zinc-900 text-xs font-bold">{kM} KM</span>
            <span className="w-px h-3 bg-zinc-300" />
            <span>~{Math.max(3, Math.round((kM / 25) * 60))} min</span>
          </motion.div>
        )}
      </AnimatePresence> */}
    </div>
  );
}

export default LiveRideMap;
