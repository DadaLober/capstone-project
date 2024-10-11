'use client'

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { Reservations } from '@/app/dashboard/(hooks)/types';

interface MapComponentProps {
    properties: Reservations[];
    selectedPropertyId: number | null;
}

const MapComponent: React.FC<MapComponentProps> = ({ properties, selectedPropertyId }) => {
    const mapRef = useRef<L.Map | null>(null);
    const markersLayerRef = useRef<L.LayerGroup | null>(null);
    const heatLayerRef = useRef<L.HeatLayer | null>(null);
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
        if (mapRef.current && properties.length > 0) {
            if (markersLayerRef.current) {
                markersLayerRef.current.clearLayers();
            }

            if (heatLayerRef.current) {
                mapRef.current.removeLayer(heatLayerRef.current);
            }

            const heatData: [number, number, number][] = properties.map(property => {
                const { lat, lng } = property.propertyInfo[0].location;
                return [lat, lng, property.fee];
            });

            heatLayerRef.current = L.heatLayer(heatData, { radius: 25 }).addTo(mapRef.current);

            properties.forEach(property => {
                const { lat, lng } = property.propertyInfo[0].location;
                const marker = L.marker([lat, lng]).addTo(markersLayerRef.current!);
                marker.bindPopup(`
          <b>Property ID:</b> ${property.propertyId}<br>
          <b>Address:</b> ${property.propertyInfo[0].address}<br>
          <b>Status:</b> ${property.status}<br>
          <b>Fee:</b> $${property.fee}<br>
          <b>Area:</b> ${property.propertyInfo[0].sqm} sqm
        `);
            });
        }
    }, [properties]);

    useEffect(() => {
        if (mapRef.current && selectedPropertyId) {
            const selectedProperty = properties.find(p => p.id === selectedPropertyId);
            if (selectedProperty) {
                const { lat, lng } = selectedProperty.propertyInfo[0].location;
                mapRef.current.setView([lat, lng], 15);
            }
        }
    }, [selectedPropertyId, properties]);

    return <div id="map" style={{ width: '100%', height: '100%' }} />;
};

export default MapComponent;