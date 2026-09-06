import React, { useState, useEffect } from "react";
import {
  Store,
  MapPin,
  Search,
  Star,
  Navigation,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { PlaceItem } from "../types";

export const PlacesApp: React.FC = () => {
  const { preferences, requestGeolocation } = useAuth();
  const [places, setPlaces] = useState<PlaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<"all" | "mosque" | "restaurant" | "grocery">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (categoryFilter !== "all") params.append("category", categoryFilter);
    if (searchQuery) params.append("query", searchQuery);

    fetch(`/api/places?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setPlaces(data.places || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch places", err);
        setLoading(false);
      });
  }, [categoryFilter, searchQuery]);

  return (
    <div id="places-mini-app" className="space-y-3.5 pb-20">
      {/* iOS Header & Search */}
      <div className="ios-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-[#1C1C1E]">
              Halal & Mosques
            </h2>
            <p className="text-[11px] text-[#8E8E93]">Locate verified Masjids & certified Halal dining</p>
          </div>
          <button
            type="button"
            onClick={requestGeolocation}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#767680]/10 hover:bg-[#767680]/15 active:scale-95 text-xs font-semibold text-[#1C1C1E] transition-all cursor-pointer"
          >
            <MapPin className="w-3 h-3 text-[#007A78]" />
            <span>{preferences.city}</span>
          </button>
        </div>

        {/* iOS Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#8E8E93] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, address, cuisine or facility..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-[#767680]/10 rounded-[12px] border-0 text-[#1C1C1E] placeholder:text-[#8E8E93] focus:outline-none focus:ring-2 focus:ring-[#007A78]/30 transition-all"
          />
        </div>

        {/* iOS Segmented Filter */}
        <div className="ios-segmented-control grid grid-cols-4 gap-0.5">
          {(
            [
              { id: "all", label: "All" },
              { id: "mosque", label: "Mosques" },
              { id: "restaurant", label: "Halal Food" },
              { id: "grocery", label: "Groceries" },
            ] as const
          ).map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setCategoryFilter(filter.id)}
              className={`py-1.5 text-xs ios-segmented-button cursor-pointer ${
                categoryFilter === filter.id ? "ios-segmented-button-active" : "text-[#8E8E93]"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Places List */}
      {loading ? (
        <div className="p-8 text-center ios-card">
          <div className="w-6 h-6 border-2 border-[#007A78] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-[#8E8E93]">Searching nearby places...</p>
        </div>
      ) : places.length === 0 ? (
        <div className="p-8 text-center ios-card">
          <Store className="w-8 h-8 text-[#C7C7CC] mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-[#1C1C1E]">No Places Found</h4>
          <p className="text-xs text-[#8E8E93] mt-1">Try broadening your search query or filters</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {places.map((place) => (
            <div
              key={place.id}
              className="p-3.5 ios-card transition-all space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-semibold text-[#1C1C1E]">{place.name}</h3>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                        place.category === "mosque"
                          ? "bg-[#007A78]/10 text-[#007A78]"
                          : "bg-[#FF9500]/10 text-[#FF9500]"
                      }`}
                    >
                      {place.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8E8E93] mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#8E8E93] shrink-0" />
                    <span>{place.address}, {place.city}</span>
                  </p>
                </div>

                {/* Rating & Distance */}
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 justify-end text-xs font-bold text-[#FF9500]">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{place.rating}</span>
                    <span className="text-[10px] text-[#8E8E93] font-normal">
                      ({place.reviewsCount})
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#8E8E93] font-medium block mt-0.5">
                    {place.distanceKm} km away
                  </span>
                </div>
              </div>

              {/* Halal Certification or Cuisine */}
              {place.halalCertification && (
                <div className="flex items-center gap-1.5 text-[11px] text-[#007A78] bg-[#007A78]/5 px-2 py-0.5 rounded-full w-fit font-medium">
                  <ShieldCheck className="w-3 h-3 text-[#007A78]" />
                  <span>{place.halalCertification}</span>
                </div>
              )}

              {place.cuisine && (
                <p className="text-[11px] text-[#3A3A3C]">
                  Cuisine: <span className="text-[#1C1C1E] font-medium">{place.cuisine}</span>
                </p>
              )}

              {/* Mosque Facilities */}
              {place.facilities && (
                <div className="flex flex-wrap gap-1">
                  {place.facilities.map((fac) => (
                    <span
                      key={fac}
                      className="text-[9px] px-2 py-0.5 rounded-full bg-[#767680]/10 text-[#3A3A3C]"
                    >
                      {fac}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 border-t border-black/[0.06] flex items-center justify-between">
                {place.phone ? (
                  <a
                    href={`tel:${place.phone}`}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#007A78] hover:underline"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{place.phone}</span>
                  </a>
                ) : <span />}

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${place.name} ${place.address}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#007A78] active:scale-95 text-white text-xs font-semibold transition-transform cursor-pointer shadow-xs"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Directions</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
