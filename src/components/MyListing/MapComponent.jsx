'use client';
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { settingsData } from '@/redux/reuducer/settingSlice';
import { useSelector } from 'react-redux';

const MapComponent = ({ setPosition, position, getLocationWithMap }) => {

    const systemSettingsData = useSelector(settingsData)
    const settings = systemSettingsData?.data
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const containerStyle = {
        marginTop: "30px",
        width: '100%',
        height: '400px'
    };

    const latitude = Number(settings?.default_latitude)
    const longitude = Number(settings?.default_longitude)

    const center = {
        lat: position?.lat ? position.lat : latitude,
        lng: position?.lng ? position?.lng : longitude
    };
    const handleMapClick = (event) => {
        const newPosition = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        };
        setPosition(newPosition);
        getLocationWithMap(newPosition);
    };

    useEffect(() => {
        if (!mapInstanceRef.current) {
            mapInstanceRef.current = L.map(mapRef.current).setView(
                [center.lat, center.lng],
                8
            );

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(mapInstanceRef.current);

            mapInstanceRef.current.on('click', (e) => {
                const newPosition = {
                    lat: e.latlng.lat,
                    lng: e.latlng.lng
                };
                setPosition(newPosition);
                getLocationWithMap(newPosition);
            });
        }

        if (position?.lat) {
            if (markerRef.current) {
                markerRef.current.setLatLng([position.lat, position.lng]);
            } else {
                markerRef.current = L.marker([position.lat, position.lng])
                    .addTo(mapInstanceRef.current);
            }
            mapInstanceRef.current.setView([position.lat, position.lng]);
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                markerRef.current = null;
            }
        };
    }, [center, position]);

    return (
        <div ref={mapRef} style={containerStyle} />
    );
};

export default MapComponent;
