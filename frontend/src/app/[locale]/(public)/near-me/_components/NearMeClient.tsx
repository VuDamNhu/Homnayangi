"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Search, MapPin, Star, Navigation, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("./LeafletMap"), { 
  ssr: false, 
  loading: () => <div className="w-full h-full bg-zen-crepe/30 flex items-center justify-center text-on-surface-variant font-bold">Đang tải bản đồ (Miễn phí)...</div> 
});

// Default center fallback: Ho Chi Minh City
const defaultCenter = {
  lat: 10.762622,
  lng: 106.660172,
};

// Mock data as fallback
const mockPlaces = [
  { 
    id: 1, name: "Phở Bò Phú Gia", lat: 10.763, lng: 106.661, rating: 4.8, distance: 0.2, type: "Món Việt", img: "https://picsum.photos/seed/pho1/200/200",
    address: "146 Lý Chính Thắng, Phường 7, Quận 3, TP.HCM",
    priceRange: "50k - 75k",
    menu: ["Phở Tái", "Phở Nạm gầu", "Quẩy"],
    status: "Đang mở cửa",
    statusColor: "text-green-600"
  },
  { 
    id: 2, name: "Cơm Tấm Sườn Bì", lat: 10.761, lng: 106.658, rating: 4.5, distance: 0.5, type: "Món Việt", img: "https://picsum.photos/seed/com1/200/200",
    address: "241 Nguyễn Trãi, Phường Nguyễn Cư Trinh, Quận 1",
    priceRange: "40k - 80k",
    menu: ["Sườn nướng", "Bì chả", "Canh khổ qua"],
    status: "Đang mở cửa",
    statusColor: "text-green-600"
  },
];

const categories = ["Tất cả", "Món Việt", "Cà phê", "Đồ Âu", "Món Nhật", "Thức ăn nhanh"];

export default function NearMeClient() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [maxDistance, setMaxDistance] = useState(2); // in km
  
  const [placesList, setPlacesList] = useState<any[]>(mockPlaces);
  const [isLoading, setIsLoading] = useState(false);

  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback if denied
          setUserLocation(defaultCenter);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setUserLocation(defaultCenter);
    }
  }, []);

  const filteredPlaces = useMemo(() => {
    return placesList.filter((place) => {
      const matchCat = activeCategory === "Tất cả" || place.type === activeCategory;
      const matchSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDistance = place.distance <= maxDistance;
      return matchCat && matchSearch && matchDistance;
    });
  }, [placesList, activeCategory, searchQuery, maxDistance]);

  const searchRealPlaces = useCallback(async () => {
    if (!userLocation) return;
    setIsLoading(true);
    try {
      // Overpass API Query for OSM (Completely Free, No API Key needed)
      const radius = maxDistance * 1000;
      let amenityQuery = '"amenity"~"restaurant|cafe|fast_food|food_court"';
      if (activeCategory === "Cà phê") amenityQuery = '"amenity"="cafe"';
      if (activeCategory === "Thức ăn nhanh") amenityQuery = '"amenity"="fast_food"';

      const query = `
        [out:json][timeout:15];
        nwr(around:${radius},${userLocation.lat},${userLocation.lng})[${amenityQuery}];
        out center;
      `;
      
      const res = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query
      });
      const data = await res.json();
      
      if (data && data.elements) {
        const formattedPlaces = data.elements.map((p: any, index: number) => {
          let distance = 0;
          const R = 6371; 
          
          // Use p.center.lat/lon if it's a way/relation, otherwise p.lat/lon for node
          const plat = p.lat || p.center?.lat || 0;
          const plng = p.lon || p.center?.lon || 0;
          
          const dLat = (plat - userLocation.lat) * Math.PI / 180;
          const dLon = (plng - userLocation.lng) * Math.PI / 180;
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(plat * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          distance = R * c;

          const name = p.tags?.name || (p.tags?.amenity === "cafe" ? "Quán Cà Phê" : "Quán Ăn Mới");
          
            const house = p.tags?.['addr:housenumber'] ? p.tags['addr:housenumber'] + ' ' : '';
            const street = p.tags?.['addr:street'] ? p.tags['addr:street'] + ', ' : '';
            const district = p.tags?.['addr:district'] ? p.tags['addr:district'] + ', ' : '';
            const city = p.tags?.['addr:city'] || '';
            let fullAddress = `${house}${street}${district}${city}`.trim();
            
            if (fullAddress.endsWith(',')) fullAddress = fullAddress.slice(0, -1);
            if (!fullAddress) {
              fullAddress = `Cách bạn khoảng ${parseFloat(distance.toFixed(1))} km`;
            }

            return {
              id: p.id || String(index),
              name: name,
              lat: plat || 0,
              lng: plng || 0,
              rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1), // Fake rating
              distance: parseFloat(distance.toFixed(1)),
              type: activeCategory !== "Tất cả" ? activeCategory : (p.tags?.amenity === "cafe" ? "Cà phê" : "Quán ăn"),
              img: `https://picsum.photos/seed/${p.id}/200/200`,
              address: fullAddress,
              priceRange: "Vừa phải",
              menu: [],
              status: "Đang mở cửa",
              statusColor: "text-green-600"
            };
        });
        
        if (formattedPlaces.length > 0) {
          setPlacesList(formattedPlaces.sort((a: any,b: any) => a.distance - b.distance));
        } else {
          setPlacesList(mockPlaces);
        }
      }
    } catch (e) {
      console.error(e);
      setPlacesList(mockPlaces);
    }
    setIsLoading(false);
  }, [userLocation, maxDistance, activeCategory]);

  useEffect(() => {
    // Tự động lấy vị trí khi vừa vào trang
    getUserLocation();
  }, [getUserLocation]);

  useEffect(() => {
    searchRealPlaces();
  }, [searchRealPlaces]);

  if (!userLocation) {
    return (
      <div className="flex flex-col h-[calc(100vh-64px)] items-center justify-center bg-[#e5e3df]">
        <div className="w-12 h-12 border-4 border-zen-gold border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-display font-bold text-xl text-zen-gold animate-pulse tracking-wide uppercase italic">
          Đang định vị...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className="w-full md:w-[400px] bg-zen-paper flex flex-col h-full z-10 shadow-xl overflow-hidden shrink-0">
        <div className="p-4 bg-zen-crepe/30 border-b border-zen-crepe">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-black text-2xl uppercase italic text-on-surface">
              Gần Tôi
            </h2>
            <button 
              onClick={getUserLocation}
              className="flex items-center gap-1.5 text-xs font-bold font-body text-zen-gold border border-zen-gold/30 rounded-full px-3 py-1.5 hover:bg-zen-gold hover:text-white transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              Vị trí của tôi
            </button>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/40" />
            <input 
              type="text" 
              placeholder="Tìm quán ăn, món ăn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white rounded-lg border border-zen-crepe text-sm font-body focus:outline-none focus:border-zen-gold focus:ring-1 focus:ring-zen-gold"
            />
          </div>

          <div className="flex items-center gap-2 mb-2 text-xs font-label uppercase text-on-surface-variant tracking-wider">
            <Filter className="w-3 h-3" />
            <span>Bộ lọc</span>
          </div>
          
          <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-bold font-body whitespace-nowrap transition-all border",
                  activeCategory === cat 
                    ? "bg-zen-gold text-white border-zen-gold" 
                    : "bg-white text-on-surface-variant border-zen-crepe hover:border-zen-gold/50"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs font-label uppercase text-on-surface-variant tracking-wider">Bán kính</span>
            <span className="text-xs font-bold font-body text-zen-gold">{maxDistance} km</span>
          </div>
          <input 
            type="range" 
            min="0.5" 
            max="10" 
            step="0.5"
            value={maxDistance}
            onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
            className="w-full mt-1 accent-zen-gold"
          />
        </div>

        <div className="flex-1 overflow-y-auto bg-zen-cream p-3 space-y-3">
          {isLoading ? (
            <div className="text-center py-8 text-sm font-bold text-zen-gold animate-pulse">
              Đang quét các địa điểm thật qua OpenStreetMap...
            </div>
          ) : filteredPlaces.length === 0 ? (
            <div className="text-center py-8 text-sm text-on-surface-variant">
              Không tìm thấy quán nào phù hợp.
            </div>
          ) : (
            filteredPlaces.map((place) => (
              <div 
                key={place.id}
                onClick={() => setSelectedPlace(place)}
                className={cn(
                  "bg-white rounded-xl overflow-hidden border p-3 flex gap-3 cursor-pointer transition-all hover:shadow-md",
                  selectedPlace?.id === place.id ? "border-zen-gold shadow-md" : "border-zen-crepe"
                )}
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 relative bg-zen-crepe/30">
                  <Image src={place.img} alt={place.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-0.5">
                      <h3 className="font-display font-bold text-base text-on-surface truncate pr-2">
                        {place.name}
                      </h3>
                      <span className={cn("text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-green-50 shrink-0", place.statusColor)}>
                        {place.status}
                      </span>
                    </div>
                    <div className="text-xs font-body text-on-surface-variant flex items-center gap-1.5 mb-1.5">
                      <span className="uppercase font-bold tracking-wider">{place.type}</span>
                      <span>•</span>
                      <span>{place.priceRange}</span>
                    </div>
                    <div className="text-xs font-body text-on-surface/60 truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{place.address}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-zen-gold text-zen-gold" />
                      <span className="text-xs font-bold font-body">{place.rating}</span>
                    </div>
                    <div className="text-xs font-bold font-body bg-zen-crepe px-2 py-1 rounded-full text-on-surface">
                      {place.distance} km
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-[#e5e3df]">
        <LeafletMap 
          userLocation={userLocation} 
          setUserLocation={setUserLocation}
          places={filteredPlaces} 
          selectedPlace={selectedPlace} 
          setSelectedPlace={setSelectedPlace} 
        />
      </div>
    </div>
  );
}
