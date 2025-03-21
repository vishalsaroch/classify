'use client';
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const OpenStreetMap = ({ position, setPosition, zoom = 13, height = '400px', onClick, showMarker = true }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        if (!mapInstanceRef.current) {
            // Initialize the map
            mapInstanceRef.current = L.map(mapRef.current).setView(
                [position?.lat || 0, position?.lng || 0],
                zoom
            );

            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(mapInstanceRef.current);

            // Add click handler
            if (onClick) {
                mapInstanceRef.current.on('click', (e) => {
                    const newPosition = {
                        lat: e.latlng.lat,
                        lng: e.latlng.lng
                    };
                    if (setPosition) setPosition(newPosition);
                    onClick(e);
                });
            }
        }

        // Update marker position
        if (showMarker && position?.lat && position?.lng) {
            if (markerRef.current) {
                markerRef.current.setLatLng([position.lat, position.lng]);
            } else {
                markerRef.current = L.marker([position.lat, position.lng])
                    .addTo(mapInstanceRef.current);
            }
        }

        // Cleanup
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [position, zoom, onClick]);

    return (
        <div ref={mapRef} style={{ width: '100%', height: height }} />
    );
};

export default OpenStreetMap;