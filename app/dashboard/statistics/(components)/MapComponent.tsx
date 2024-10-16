'use client'

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PropertyInfo, customIcon } from '@/hooks/types';

// Import the heat plugin
import 'leaflet.heat';

interface MapComponentProps {
    properties: PropertyInfo[];
    selectedPropertyId: number | null;
}

const MapComponent: React.FC<MapComponentProps> = ({ properties, selectedPropertyId }) => {
    const mapRef = useRef<L.Map | null>(null);
    const markersLayerRef = useRef<L.LayerGroup | null>(null);
    const heatLayerRef = useRef<L.Layer | null>(null);
    const markersRef = useRef<{ [key: number]: L.Marker }>({});
    const [mapType, setMapType] = useState<'street' | 'satellite'>('street');

    useEffect(() => {
        if (typeof window !== 'undefined' && !mapRef.current) {
            mapRef.current = L.map('map', { zoomControl: false }).setView([15.45, 120.93], 13);
            L.control.zoom({ position: 'topright' }).addTo(mapRef.current);

            const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            });

            const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            });

            streetLayer.addTo(mapRef.current);

            const layerControl = L.control.layers({
                'Street': streetLayer,
                'Satellite': satelliteLayer
            }, {}, { position: 'topright' }).addTo(mapRef.current);

            mapRef.current.on('baselayerchange', (e: L.LayersControlEvent) => {
                setMapType(e.name.toLowerCase() as 'street' | 'satellite');
            });

            markersLayerRef.current = L.layerGroup().addTo(mapRef.current);
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (mapRef.current) {
            if (markersLayerRef.current) {
                markersLayerRef.current.clearLayers();
            }

            if (heatLayerRef.current) {
                mapRef.current.removeLayer(heatLayerRef.current);
            }

            markersRef.current = {};

            if (properties.length > 0) {
                const heatData: [number, number, number][] = properties.map(property => {
                    const { lat, lng } = property.location;
                    const latestPrice = property.priceHistory && property.priceHistory.length > 0
                        ? property.priceHistory[property.priceHistory.length - 1].price
                        : 0;
                    return [lat, lng, latestPrice];
                });

                const maxPrice = Math.max(...heatData.map(d => d[2]));
                const minPrice = Math.min(...heatData.map(d => d[2]));

                // Normalize the intensity values with a more aggressive scaling
                const normalizedHeatData = heatData.map(([lat, lng, price]) => {
                    const normalizedIntensity = Math.pow((price - minPrice) / (maxPrice - minPrice), 0.5); // Use square root for more aggressive scaling
                    return [lat, lng, normalizedIntensity * 2000];
                });

                // Heat Layer Settings
                heatLayerRef.current = (L as any).heatLayer(normalizedHeatData, {
                    radius: 20,
                    blur: 15,
                    maxZoom: 18,
                    max: 1000,
                    minOpacity: 0.2,
                    gradient: { 0.2: 'blue', 0.4: 'cyan', 0.6: 'lime', 0.8: 'yellow', 1: 'red' }
                }).addTo(mapRef.current);

                properties.forEach(property => {
                    const { lat, lng } = property.location;
                    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(markersLayerRef.current!);
                    const latestPrice = property.priceHistory && property.priceHistory.length > 0
                        ? property.priceHistory[property.priceHistory.length - 1].price
                        : 'N/A';
                    marker.bindPopup(`
                        <b>Property ID:</b> ${property.id}<br>
                        <b>Address:</b> ${property.address}<br>
                        <b>Status:</b> ${property.status || 'Unknown'}<br>
                        <b>Latest Price:</b> $${latestPrice}<br>
                        <b>Area:</b> ${property.sqm} sqm
                    `);
                    markersRef.current[property.id] = marker;
                });

                const bounds = L.latLngBounds(properties.map(p => [p.location.lat, p.location.lng]));
                mapRef.current.fitBounds(bounds);
            } else {
                mapRef.current.setView([15.45, 120.93], 13);
            }
        }
    }, [properties]);

    useEffect(() => {
        if (mapRef.current && selectedPropertyId !== null) {
            const selectedProperty = properties.find(p => p.id === selectedPropertyId);
            if (selectedProperty) {
                const { lat, lng } = selectedProperty.location;
                mapRef.current.setView([lat, lng], 15);
                const marker = markersRef.current[selectedPropertyId];
                if (marker) {
                    marker.openPopup();
                }
            }
        }
    }, [selectedPropertyId, properties]);

    return (
        <div id="map" style={{ width: '100%', height: '100%' }}>
            {properties.length === 0 && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-70 z-[1000]">
                    <p className="text-lg font-semibold text-gray-700">No properties to display on the map</p>
                </div>
            )}
        </div>
    );
};

export default MapComponent;