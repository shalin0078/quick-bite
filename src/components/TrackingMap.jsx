import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Compass, 
  Layers, 
  Maximize2, 
  Minimize2, 
  Navigation, 
  Target, 
  Zap, 
  Bike
} from 'lucide-react';

// Tile provider options - completely watermark-free and ultra crisp
const MAP_TILES = {
  osm: {
    name: 'OpenStreetMap (Clean)',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxZoom: 19,
    subdomains: 'abc',
    attribution: '© OpenStreetMap contributors'
  },
  esri: {
    name: 'Esri World Street (Premium)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 19,
    attribution: 'Tiles © Esri'
  },
  hot: {
    name: 'Humanitarian OSM (Vibrant)',
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    maxZoom: 19,
    subdomains: 'abc',
    attribution: '© OpenStreetMap contributors'
  }
};

// Calculate heading angle in degrees between two coordinates
function calculateBearing(startLat, startLng, destLat, destLng) {
  if (!startLat || !destLat || (startLat === destLat && startLng === destLng)) return 45;
  const startLatRad = (startLat * Math.PI) / 180;
  const startLngRad = (startLng * Math.PI) / 180;
  const destLatRad = (destLat * Math.PI) / 180;
  const destLngRad = (destLng * Math.PI) / 180;
  const y = Math.sin(destLngRad - startLngRad) * Math.cos(destLatRad);
  const x = Math.cos(startLatRad) * Math.sin(destLatRad) -
            Math.sin(startLatRad) * Math.cos(destLatRad) * Math.cos(destLngRad - startLngRad);
  return Math.round(((Math.atan2(y, x) * 180) / Math.PI + 360) % 360);
}

// Convert heading degrees to cardinal compass direction
function getCompassDirection(bearing) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
}

export default function TrackingMap({
  restaurantLocation = [22.3175, 73.1680],
  restaurantName = "Domino's Pizza",
  riderLocation = [22.3120, 73.1740],
  riderName = "Ramesh Kumar",
  riderSpeed = 28,
  customerLocation = [22.3072, 73.1812],
  customerAddress = "123, Green Park, Vadodara",
  routeCoordinates = [],
  currentRouteIndex = 0,
  orderStatus = 'Out for Delivery',
  isSimulated = true
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const riderMarkerRef = useRef(null);
  const restaurantMarkerRef = useRef(null);
  const customerMarkerRef = useRef(null);
  const traveledPolylineRef = useRef(null);
  const remainingPolylineRef = useRef(null);
  const prevCoordRef = useRef(riderLocation);

  const [activeTileStyle, setActiveTileStyle] = useState('osm');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentBearing, setCurrentBearing] = useState(45);
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);

  // Calculate bearing when rider location changes
  useEffect(() => {
    if (prevCoordRef.current && riderLocation) {
      const [prevLat, prevLng] = prevCoordRef.current;
      const [curLat, curLng] = riderLocation;
      if (prevLat !== curLat || prevLng !== curLng) {
        const bearing = calculateBearing(prevLat, prevLng, curLat, curLng);
        setCurrentBearing(bearing);
        prevCoordRef.current = riderLocation;
      }
    }
  }, [riderLocation]);

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView(riderLocation || restaurantLocation, 14);

      // Base Watermark-Free Tile Layer
      const tileConfig = MAP_TILES[activeTileStyle];
      tileLayerRef.current = L.tileLayer(tileConfig.url, {
        maxZoom: tileConfig.maxZoom,
        subdomains: tileConfig.subdomains || 'abc',
      }).addTo(map);

      // Add Zoom Control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // 1. RESTAURANT MARKER
      const restaurantIcon = L.divIcon({
        className: 'custom-restaurant-marker',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.25));">
            <div style="background: #1C1C1C; color: #FFFFFF; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 800; white-space: nowrap; margin-bottom: 4px; border: 1px solid rgba(255,255,255,0.2); display: flex; items-center; gap: 4px;">
              <span>🏬</span>
              <span>${restaurantName}</span>
            </div>
            <div style="position: relative; width: 44px; height: 44px; background: #FFFFFF; border: 3px solid #FC8019; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(252,128,25,0.45);">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FC8019" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
                <path d="M7 2v20"/>
                <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [140, 70],
        iconAnchor: [70, 64],
      });

      restaurantMarkerRef.current = L.marker(restaurantLocation, { icon: restaurantIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: system-ui, sans-serif; padding: 4px 2px;">
            <div style="font-weight: 900; color: #1C1C1C; font-size: 14px;">${restaurantName}</div>
            <div style="color: #686B78; font-size: 11px; margin-top: 2px;">QuickBite Verified Kitchen Partner</div>
            <div style="margin-top: 6px; display: inline-block; background: #FFF4EC; color: #FC8019; font-weight: 800; font-size: 10px; padding: 2px 8px; border-radius: 6px;">
              Order Preparation Hub
            </div>
          </div>
        `);

      // 2. CUSTOMER DESTINATION MARKER
      const customerIcon = L.divIcon({
        className: 'custom-customer-marker',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.25));">
            <div style="background: #267E3E; color: #FFFFFF; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 800; white-space: nowrap; margin-bottom: 4px; border: 1px solid rgba(255,255,255,0.2); display: flex; items-center; gap: 4px;">
              <span>📍</span>
              <span>Delivery Address</span>
            </div>
            <div style="position: relative; width: 44px; height: 44px; background: #FFFFFF; border: 3px solid #267E3E; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(38,126,62,0.45);">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#267E3E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [140, 70],
        iconAnchor: [70, 64],
      });

      customerMarkerRef.current = L.marker(customerLocation, { icon: customerIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: system-ui, sans-serif; padding: 4px 2px;">
            <div style="font-weight: 900; color: #1C1C1C; font-size: 14px;">Your Doorstep</div>
            <div style="color: #686B78; font-size: 11px; margin-top: 2px;">${customerAddress}</div>
            <div style="margin-top: 6px; display: inline-block; background: #E8F5E9; color: #267E3E; font-weight: 800; font-size: 10px; padding: 2px 8px; border-radius: 6px;">
              Destination Verified
            </div>
          </div>
        `);

      // 3. RIDER MOVING SCOOTER MARKER WITH DYNAMIC ROTATION
      createOrUpdateRiderMarker(map, riderLocation, currentBearing, riderName, riderSpeed);

      // 4. DRAW DUAL POLYLINES
      drawRouteLines(map, routeCoordinates, currentRouteIndex);

      // Auto fit bounds
      if (routeCoordinates && routeCoordinates.length > 0) {
        const bounds = L.latLngBounds([restaurantLocation, customerLocation, riderLocation, ...routeCoordinates]);
        map.fitBounds(bounds, { padding: [60, 60] });
      }

      mapInstanceRef.current = map;
    } else {
      const map = mapInstanceRef.current;
      // Update moving rider marker
      createOrUpdateRiderMarker(map, riderLocation, currentBearing, riderName, riderSpeed);
      // Update route polylines
      drawRouteLines(map, routeCoordinates, currentRouteIndex);
    }
  }, [riderLocation, currentBearing, activeTileStyle, currentRouteIndex, routeCoordinates, restaurantLocation, customerLocation, restaurantName, customerAddress, riderName, riderSpeed]);

  // Switch Tile Layer when user selects style
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }
    const tileConfig = MAP_TILES[activeTileStyle];
    tileLayerRef.current = L.tileLayer(tileConfig.url, {
      maxZoom: tileConfig.maxZoom,
      subdomains: tileConfig.subdomains || 'abc',
    }).addTo(mapInstanceRef.current);
  }, [activeTileStyle]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Helper to draw / update the dual-color route polylines
  function drawRouteLines(map, coords, curIndex) {
    if (!coords || coords.length === 0) return;

    const safeIndex = Math.min(Math.max(0, curIndex), coords.length - 1);
    const traveledCoords = coords.slice(0, safeIndex + 1);
    const remainingCoords = coords.slice(safeIndex);

    // Traveled line (subtle slate gray, dashed)
    if (traveledCoords.length > 1) {
      if (!traveledPolylineRef.current) {
        traveledPolylineRef.current = L.polyline(traveledCoords, {
          color: '#64748B',
          weight: 4,
          opacity: 0.65,
          dashArray: '6, 8',
          lineCap: 'round',
        }).addTo(map);
      } else {
        traveledPolylineRef.current.setLatLngs(traveledCoords);
      }
    }

    // Remaining line (glowing QuickBite orange, bold solid)
    if (remainingCoords.length > 1) {
      if (!remainingPolylineRef.current) {
        remainingPolylineRef.current = L.polyline(remainingCoords, {
          color: '#FC8019',
          weight: 6,
          opacity: 0.95,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(map);
      } else {
        remainingPolylineRef.current.setLatLngs(remainingCoords);
      }
    }
  }

  // Helper to create or update rider marker with dynamic rotation
  function createOrUpdateRiderMarker(map, location, bearing, name, speed) {
    const isStationary = speed === 0 || orderStatus === 'Delivered';
    const riderHtml = `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; filter: drop-shadow(0 6px 14px rgba(252,128,25,0.45));">
        <!-- Multi-tier Pulsing Radar Ring -->
        <div style="position: absolute; top: 18px; left: 50%; transform: translate(-50%, -50%); width: 56px; height: 56px; background: rgba(252, 128, 25, 0.22); border: 2px solid rgba(252,128,25,0.6); border-radius: 50%; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        
        <!-- Live Telemetry Tag -->
        <div style="background: #1C1C1C; color: #FFFFFF; padding: 3px 9px; border-radius: 7px; font-size: 10px; font-weight: 900; white-space: nowrap; margin-bottom: 4px; z-index: 10; border: 1px solid rgba(255,255,255,0.25); display: flex; align-items: center; gap: 5px;">
          <span>🛵 ${name}</span>
          <span style="color: #FC8019;">•</span>
          <span style="color: #FFB370;">${isStationary ? 'Doorstep / Halt' : `${speed} km/h`}</span>
        </div>

        <!-- Rotating Scooter Avatar -->
        <div style="width: 46px; height: 46px; background: #FC8019; border: 3px solid #FFFFFF; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(252,128,25,0.65); z-index: 9; transform: rotate(${bearing}deg); transition: transform 0.6s ease-out;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="18.5" cy="17.5" r="3.5"/>
            <circle cx="5.5" cy="17.5" r="3.5"/>
            <circle cx="15" cy="5" r="1"/>
            <path d="M12 17.5V14l-3-3 4-3 2 3h2"/>
          </svg>
        </div>
      </div>
    `;

    const riderIcon = L.divIcon({
      className: 'custom-rider-marker',
      html: riderHtml,
      iconSize: [140, 80],
      iconAnchor: [70, 68],
    });

    if (!riderMarkerRef.current) {
      riderMarkerRef.current = L.marker(location, { icon: riderIcon, zIndexOffset: 2000 }).addTo(map);
      riderMarkerRef.current.bindPopup(`
        <div style="font-family: system-ui, sans-serif; padding: 4px;">
          <div style="font-weight: 900; color: #1C1C1C; font-size: 14px;">${name}</div>
          <div style="color: #686B78; font-size: 11px; margin-top: 2px;">QuickBite Star Delivery Partner</div>
          <div style="margin-top: 6px; display: flex; gap: 6px;">
            <span style="background: #E8F5E9; color: #267E3E; font-weight: 800; font-size: 10px; padding: 2px 6px; border-radius: 4px;">★ 4.9 Rating</span>
            <span style="background: #FFF4EC; color: #FC8019; font-weight: 800; font-size: 10px; padding: 2px 6px; border-radius: 4px;">GJ-06-BQ-4912</span>
          </div>
        </div>
      `);
    } else {
      riderMarkerRef.current.setLatLng(location);
      riderMarkerRef.current.setIcon(riderIcon);
    }
  }

  // Recenter Map on Rider
  const handleRecenter = () => {
    if (mapInstanceRef.current && riderLocation) {
      mapInstanceRef.current.flyTo(riderLocation, 16, { duration: 1.2 });
    }
  };

  // Fit Entire Route Bounds
  const handleFitRoute = () => {
    if (mapInstanceRef.current && routeCoordinates.length > 0) {
      const bounds = L.latLngBounds([restaurantLocation, customerLocation, riderLocation, ...routeCoordinates]);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], animate: true });
    }
  };

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden border border-gray-200 shadow-md transition-all ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen min-h-screen' : 'h-full min-h-[460px]'
    }`}>
      {/* Map Target DOM */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[460px] z-10" />

      {/* TOP LEFT: GPS Broadcast / Telemetry HUD */}
      <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2">
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-gray-200/80 text-xs font-bold flex items-center space-x-2.5">
          <span className={`w-2.5 h-2.5 rounded-full ${isSimulated ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
          <span className="text-gray-900 font-extrabold">
            {isSimulated ? 'Simulated Road GPS' : 'Real-Time Hardware GPS'}
          </span>
          <span className="text-[10px] text-gray-400 font-mono">
            ±2m RTK Fix
          </span>
        </div>

        {/* Live Heading & Speed Telemetry Capsule */}
        <div className="bg-black/85 backdrop-blur-md text-white px-3 py-1.5 rounded-xl shadow-md text-[11px] font-semibold flex items-center space-x-3 w-fit">
          <div className="flex items-center space-x-1">
            <Compass className="w-3.5 h-3.5 text-[#FC8019]" />
            <span className="font-mono">{currentBearing}° {getCompassDirection(currentBearing)}</span>
          </div>
          <span className="text-gray-500">|</span>
          <div className="flex items-center space-x-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{riderSpeed} km/h</span>
          </div>
        </div>
      </div>

      {/* TOP RIGHT: Map Interactive Action Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
        {/* Recenter Rider */}
        <button
          onClick={handleRecenter}
          className="bg-white/95 backdrop-blur-md text-gray-800 hover:text-[#FC8019] hover:bg-orange-50 px-3 py-2 rounded-xl shadow-lg border border-gray-200 text-xs font-extrabold transition flex items-center space-x-1.5"
          title="Recenter on Delivery Rider"
        >
          <Target className="w-4 h-4 text-[#FC8019]" />
          <span className="hidden sm:inline">Recenter Rider</span>
        </button>

        {/* Fit Entire Route */}
        <button
          onClick={handleFitRoute}
          className="bg-white/95 backdrop-blur-md text-gray-800 hover:text-[#FC8019] hover:bg-orange-50 px-3 py-2 rounded-xl shadow-lg border border-gray-200 text-xs font-extrabold transition flex items-center space-x-1.5"
          title="Fit entire route bounds"
        >
          <Navigation className="w-4 h-4 text-[#267E3E]" />
          <span className="hidden sm:inline">Fit Route</span>
        </button>

        {/* Map Layers Dropdown Toggle */}
        <div className="relative">
          <button
            onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
            className="bg-white/95 backdrop-blur-md text-gray-800 hover:text-[#FC8019] p-2 rounded-xl shadow-lg border border-gray-200 transition"
            title="Switch Map Tiles"
          >
            <Layers className="w-4 h-4" />
          </button>

          {isLayerMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-30">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1 block">
                Map Styling
              </span>
              {Object.entries(MAP_TILES).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => {
                    setActiveTileStyle(key);
                    setIsLayerMenuOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                    activeTileStyle === key
                      ? 'bg-orange-50 text-[#FC8019]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{item.name}</span>
                  {activeTileStyle === key && <span className="text-[#FC8019] text-xs">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Fullscreen Expand / Exit */}
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="bg-white/95 backdrop-blur-md text-gray-800 hover:text-[#FC8019] p-2 rounded-xl shadow-lg border border-gray-200 transition"
          title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* BOTTOM LEFT: Route Legend Bar */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-lg border border-gray-200 text-xs font-semibold flex items-center space-x-4">
        <div className="flex items-center space-x-1.5">
          <span className="w-3.5 h-1.5 bg-[#FC8019] rounded-full inline-block shadow-sm" />
          <span className="text-gray-800 text-[11px] font-bold">Active Route</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3.5 h-1 bg-gray-500 rounded-full inline-block border-t border-dashed border-gray-600" />
          <span className="text-gray-500 text-[11px]">Traveled Path</span>
        </div>
      </div>
    </div>
  );
}
