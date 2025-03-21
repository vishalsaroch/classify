'use client'
'use client';
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = (props) => {
    const containerStyle = {
        width: "100%",
        height: "200px",
    };

    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);

    const center = {
        lat: parseFloat(props.latitude),
        lng: parseFloat(props.longitude),
    };

    useEffect(() => {
        if (!mapInstanceRef.current) {
            mapInstanceRef.current = L.map(mapRef.current).setView(
                [center.lat, center.lng],
                14
            );

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(mapInstanceRef.current);
        }

        if (center.lat) {
            if (markerRef.current) {
                markerRef.current.setLatLng([center.lat, center.lng]);
            } else {
                markerRef.current = L.marker([center.lat, center.lng])
                    .addTo(mapInstanceRef.current);
            }
            mapInstanceRef.current.setView([center.lat, center.lng]);
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                markerRef.current = null;
            }
        };
    }, [center]);

    return (
        <div ref={mapRef} style={containerStyle} />
    );
};

export default Map;
