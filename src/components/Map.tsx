import { IAddTourType } from "@/utils/apis/pengelola/type";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FieldErrors, UseFormSetValue } from "react-hook-form";
import { Marker } from "react-leaflet";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import markerBaru from "@/assets/marker.gif";
import L from "leaflet";
import { useLocation } from "react-router-dom";

interface MapProps {
  draggable: boolean;
  width?: number;
  setValue?: UseFormSetValue<IAddTourType>;
  error?: FieldErrors<IAddTourType>;
  posisi?: { lat: number; lng: number };
  id?: number;
}

const EditMap = (props: MapProps) => {
  const location = useLocation();
  const { draggable, width, setValue, error, posisi, id } = props;
  const [dragged, setDragged] = useState<{ lat: number; lng: number }>({
    lat: posisi?.lat || -6.330995309852224,
    lng: posisi?.lng || 106.70471191406251,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const mapRef = useRef<any>();
  const marker = useRef<any>();
  const icon = new L.Icon({
    iconUrl: markerBaru,
    iconSize: [40, 40],
  });

  const handleMarkerDragEnd = (event: any) => {
    const { lat, lng } = event.target.getLatLng();
    setDragged({ lat, lng });
    mapRef.current.panTo({ lat, lng });
    if (setValue) {
      setValue("latitude", lat);
      setValue("longitude", lng);
    }
    console.log("Marker dragged to:", event.target.getLatLng());
  };

  const handleSearch = async () => {
    if (searchTerm.trim() === "") return;

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?addressdetails=1&q=${searchTerm}&format=jsonv2&limit=1`
      );

      const { lat, lon } = response.data[0];
      setDragged({ lat: Number(lat), lng: Number(lon) });
      if (setValue) {
        setValue("latitude", Number(lat));
        setValue("longitude", Number(lon));
      }
    } catch (error) {
      console.error("Error fetching geocoding data:", error);
    }
  };

  useEffect(() => {
    if (posisi) {
      setDragged(posisi);
    }
  }, [posisi]);

  useEffect(() => {
    mapRef.current?.panTo(marker.current.getLatLng());

    // Update form values when the component mounts
    if (setValue) {
      setValue("latitude", Number(dragged?.lat));
      setValue("longitude", Number(dragged?.lng));
    }
  }, [dragged]);
  return (
    <div>
      <MapContainer
        ref={mapRef}
        style={{ height: 400, width: width }}
        center={dragged}
        zoom={15}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          icon={icon}
          ref={marker}
          position={dragged}
          draggable={draggable}
          eventHandlers={{ dragend: handleMarkerDragEnd }}
        />
      </MapContainer>
      <p className="text-sm text-red-500 ">
        {error?.latitude && error.latitude.message}
      </p>
      <p className="text-sm text-red-500 ">
        {error?.longitude && error.longitude.message}
      </p>
      {location.pathname === "/addtour" ||
      location.pathname === `/edit-tour/${id}` ? (
        <div className="flex border-slate-300 border-2">
          <input
            className="p-2 w-full outline-none"
            type="text"
            placeholder="Search location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
          />
          <button
            type="button"
            onClick={handleSearch}
            className="p-2 bg-slate-500 text-white"
          >
            Search
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default EditMap;
