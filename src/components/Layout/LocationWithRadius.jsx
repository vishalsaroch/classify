'use client';
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { settingsData } from '@/redux/reuducer/settingSlice';
import { useSelector } from 'react-redux';
import { getCityData } from '@/redux/reuducer/locationSlice';

const LocationWithRadius = ({ setPosition, position, setKmRange, getLocationWithMap, KmRange, appliedKilometer }) => {

    const systemSettingsData = useSelector(settingsData)
    const globalPos = useSelector(getCityData)

    const placeHolderPos = {
        lat: globalPos?.lat,
        lng: globalPos?.long
    }

    const settings = systemSettingsData?.data
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const circleRef = useRef(null);
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
        setKmRange(appliedKilometer)
    }, [])


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

        const currentPos = position?.lat ? position : placeHolderPos;

        if (currentPos.lat) {
            if (markerRef.current) {
                markerRef.current.setLatLng([currentPos.lat, currentPos.lng]);
            } else {
                markerRef.current = L.marker([currentPos.lat, currentPos.lng])
                    .addTo(mapInstanceRef.current);
            }

            if (circleRef.current) {
                circleRef.current.setLatLng([currentPos.lat, currentPos.lng]);
                circleRef.current.setRadius(KmRange * 1000);
            } else {
                const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
                circleRef.current = L.circle([currentPos.lat, currentPos.lng], {
                    radius: KmRange * 1000,
                    color: primaryColor,
                    fillColor: primaryColor,
                    fillOpacity: 0.35,
                    weight: 2
                }).addTo(mapInstanceRef.current);
            }

            mapInstanceRef.current.setView([currentPos.lat, currentPos.lng]);
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                markerRef.current = null;
                circleRef.current = null;
            }
        };
    }, [center, position, KmRange, placeHolderPos]);

    return (
        <div ref={mapRef} style={containerStyle} />
    );
};

export default LocationWithRadius;
