import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MdOutlineMyLocation, MdOutlineSearch } from "react-icons/md";

// Fix Leaflet's default marker icon paths (breaks under Vite/webpack bundling otherwise)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const DHAKA_CENTER = [23.8103, 90.4125];

// Recenters the map whenever the marker position changes externally (search/current-location)
const RecenterMap = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        if (position) map.setView(position, 15);
    }, [position, map]);
    return null;
};

// Lets the user click anywhere on the map to drop the pin there
const ClickHandler = ({ onPick }) => {
    useMapEvents({
        click(e) {
            onPick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
};

/**
 * Props:
 *  - value: { address, lat, lng } | null
 *  - onChange: ({ address, lat, lng }) => void
 */
const LocationPicker = ({ value, onChange }) => {
    const [query, setQuery] = useState(value?.address || "");
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [position, setPosition] = useState(
        value?.lat && value?.lng ? [value.lat, value.lng] : null
    );
    const debounceRef = useRef(null);

    // Debounced search against Nominatim (OpenStreetMap's free geocoding service).
    // As soon as results come back, the map auto-jumps to the TOP match —
    // no click needed. The dropdown stays open so the user can still pick a
    // more precise result if the top one isn't quite right.
    useEffect(() => {
        if (!showSuggestions) return;
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }

        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&countrycodes=bd&limit=6&q=${encodeURIComponent(
                        query
                    )}`
                );
                const data = await res.json();
                setSuggestions(data);

                // Auto-jump the map to the best match
                if (data.length > 0) {
                    const top = data[0];
                    const lat = parseFloat(top.lat);
                    const lng = parseFloat(top.lon);
                    setPosition([lat, lng]);
                    onChange({ address: top.display_name, lat, lng });
                }
            } catch (err) {
                setSuggestions([]);
            } finally {
                setIsSearching(false);
            }
        }, 600);

        return () => clearTimeout(debounceRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, showSuggestions]);

    const selectSuggestion = (place) => {
        const lat = parseFloat(place.lat);
        const lng = parseFloat(place.lon);
        setPosition([lat, lng]);
        setQuery(place.display_name);
        setShowSuggestions(false);
        onChange({ address: place.display_name, lat, lng });
    };

    // Reverse geocode — turns raw lat/lng (from map click or GPS) into a readable address
    const reverseGeocode = async (lat, lng) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await res.json();
            const address = data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
            setQuery(address);
            onChange({ address, lat, lng });
        } catch (err) {
            const address = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
            setQuery(address);
            onChange({ address, lat, lng });
        }
    };

    const handleMapClick = (lat, lng) => {
        setPosition([lat, lng]);
        reverseGeocode(lat, lng);
    };

    const useCurrentLocation = () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setPosition([latitude, longitude]);
                reverseGeocode(latitude, longitude);
            },
            () => {
                // user denied permission or GPS unavailable — silently ignore,
                // they can still search or click the map manually
            }
        );
    };

    return (
        <div className="flex flex-col gap-2">
            {/* Search box */}
            <div className="relative">
                <MdOutlineSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
                <input
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    type="text"
                    placeholder="হাসপাতালের নাম লিখে সার্চ করুন (যেমন: Rangpur Medical College Hospital)"
                    className="w-full rounded-md border border-gray-200 bg-[#F7F8F9] py-2.5 pl-10 pr-24 text-sm outline-none transition-colors focus:border-red-300 focus:bg-white focus:ring-2 focus:ring-red-100"
                />
                <button
                    type="button"
                    onClick={useCurrentLocation}
                    className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-full bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
                >
                    <MdOutlineMyLocation className="text-sm" />
                    Current
                </button>

                {/* Suggestions dropdown */}
                {showSuggestions && query.trim() && (
                    <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
                        {isSearching ? (
                            <p className="px-4 py-3 text-sm text-gray-400">খোঁজা হচ্ছে...</p>
                        ) : suggestions.length === 0 ? (
                            <p className="px-4 py-3 text-sm text-gray-400">
                                কিছু পাওয়া যায়নি — নিচের ম্যাপে ক্লিক করে সরাসরি লোকেশন বসাতে পারো
                            </p>
                        ) : (
                            suggestions.map((place) => (
                                <button
                                    key={place.place_id}
                                    type="button"
                                    onMouseDown={() => selectSuggestion(place)}
                                    className="block w-full truncate px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-red-50"
                                >
                                    {place.display_name}
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Map */}
            <div className="z-10 h-56 w-full overflow-hidden rounded-md border border-gray-200">
                <MapContainer
                    center={position || DHAKA_CENTER}
                    zoom={position ? 15 : 7}
                    scrollWheelZoom={true}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <ClickHandler onPick={handleMapClick} />
                    {position && (
                        <>
                            <Marker position={position} />
                            <RecenterMap position={position} />
                        </>
                    )}
                </MapContainer>
            </div>

            <p className="text-xs text-gray-400">
                সার্চ করে হাসপাতাল বেছে নাও, "Current" চেপে তোমার লোকেশন ব্যবহার করো, অথবা ম্যাপে সরাসরি ক্লিক করে পিন বসাও।
            </p>
        </div>
    );
};

export default LocationPicker;

// import { useState } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   useMap,
// } from "react-leaflet";
// import L from "leaflet";
// import {
//   MdLocationOn,
//   MdSearch,
//   MdCheck,
// } from "react-icons/md";

// // Leaflet marker icon fix
// delete L.Icon.Default.prototype._getIconUrl;

// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
// });

// const DEFAULT_LOCATION = [25.7439, 89.2752];

// function MapMover({ position }) {
//   const map = useMap();

//   if (position) {
//     map.flyTo(position, 16, {
//       duration: 1.2,
//     });
//   }

//   return null;
// }

// function LocationPicker({ position, setPosition }) {
//   const [dragging, setDragging] = useState(false);

//   return (
//     <Marker
//       position={position}
//       draggable={true}
//       eventHandlers={{
//         dragstart: () => setDragging(true),

//         dragend: (event) => {
//           setDragging(false);

//           const marker = event.target;
//           const newPosition = marker.getLatLng();

//           setPosition([
//             newPosition.lat,
//             newPosition.lng,
//           ]);
//         },
//       }}
//     />
//   );
// }

// export default function HospitalLocationPicker({
//   value,
//   onChange,
// }) {
//   const [searchText, setSearchText] = useState(
//     value?.hospitalName || ""
//   );

//   const [position, setPosition] = useState(
//     value?.latitude && value?.longitude
//       ? [value.latitude, value.longitude]
//       : DEFAULT_LOCATION
//   );

//   const [locationName, setLocationName] = useState(
//     value?.address || ""
//   );

//   const [searching, setSearching] = useState(false);

//   // Search hospital using OpenStreetMap Nominatim
//   const handleSearch = async () => {
//     if (!searchText.trim()) return;

//     try {
//       setSearching(true);

//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=bd&q=${encodeURIComponent(
//           searchText
//         )}`
//       );

//       const data = await response.json();

//       if (!data.length) {
//         alert("Hospital location not found.");
//         return;
//       }

//       const result = data[0];

//       const newPosition = [
//         Number(result.lat),
//         Number(result.lon),
//       ];

//       setPosition(newPosition);
//       setLocationName(result.display_name);

//       onChange({
//         hospitalName: searchText,
//         address: result.display_name,
//         latitude: Number(result.lat),
//         longitude: Number(result.lon),
//       });
//     } catch (error) {
//       console.error(error);
//       alert("Unable to search location.");
//     } finally {
//       setSearching(false);
//     }
//   };

//   const handleConfirm = () => {
//     onChange({
//       hospitalName: searchText,
//       address: locationName,
//       latitude: position[0],
//       longitude: position[1],
//     });

//     alert("Hospital location selected successfully.");
//   };

//   return (
//     <div className="space-y-4">

//       {/* Hospital Name */}
//       <div>
//         <label className="mb-2 block text-sm font-medium text-gray-800">
//           Hospital / Clinic Name
//           <span className="text-red-600"> *</span>
//         </label>

//         <input
//           type="text"
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//           placeholder="e.g. Rangpur Medical College Hospital"
//           className="w-full rounded-md border border-gray-200 bg-[#F7F8F9] px-3 py-2.5 text-sm outline-none transition focus:border-red-300 focus:bg-white focus:ring-2 focus:ring-red-100"
//         />
//       </div>

//       {/* Search Button */}
//       <button
//         type="button"
//         onClick={handleSearch}
//         disabled={searching || !searchText.trim()}
//         className="flex w-full items-center justify-center gap-2 rounded-md bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
//       >
//         <MdSearch className="text-lg" />

//         {searching
//           ? "Searching..."
//           : "Search Hospital Location"}
//       </button>

//       {/* Map */}
//       <div className="overflow-hidden rounded-xl border border-gray-200">
//         <MapContainer
//           center={position}
//           zoom={13}
//           scrollWheelZoom={true}
//           className="h-[380px] w-full"
//         >
//           <TileLayer
//             attribution='&copy; OpenStreetMap contributors'
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />

//           <MapMover position={position} />

//           <LocationPicker
//             position={position}
//             setPosition={(newPosition) => {
//               setPosition(newPosition);

//               onChange({
//                 hospitalName: searchText,
//                 address: locationName,
//                 latitude: newPosition[0],
//                 longitude: newPosition[1],
//               });
//             }}
//           />
//         </MapContainer>
//       </div>

//       {/* Selected Location */}
//       <div className="rounded-xl border border-red-100 bg-red-50 p-4">

//         <div className="flex gap-3">

//           <MdLocationOn className="mt-0.5 shrink-0 text-2xl text-red-600" />

//           <div className="min-w-0">

//             <p className="text-sm font-semibold text-gray-900">
//               Selected Hospital Location
//             </p>

//             {locationName && (
//               <p className="mt-1 text-xs leading-5 text-gray-600">
//                 {locationName}
//               </p>
//             )}

//             <div className="mt-3 grid grid-cols-2 gap-3">

//               <div className="rounded-lg bg-white p-2">
//                 <p className="text-[11px] text-gray-400">
//                   Latitude
//                 </p>

//                 <p className="mt-1 text-xs font-medium text-gray-700">
//                   {position[0].toFixed(6)}
//                 </p>
//               </div>

//               <div className="rounded-lg bg-white p-2">
//                 <p className="text-[11px] text-gray-400">
//                   Longitude
//                 </p>

//                 <p className="mt-1 text-xs font-medium text-gray-700">
//                   {position[1].toFixed(6)}
//                 </p>
//               </div>

//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Confirm */}
//       <button
//         type="button"
//         onClick={handleConfirm}
//         className="flex w-full items-center justify-center gap-2 rounded-md border border-red-600 bg-white py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
//       >
//         <MdCheck className="text-lg" />

//         Confirm Hospital Location
//       </button>

//     </div>
//   );
// }