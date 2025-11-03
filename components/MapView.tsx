import React, { useEffect, useRef } from 'react';
import { University } from '../types';

declare const L: any; // Use Leaflet from the global scope

interface MapViewProps {
  universities: University[];
}

const MapView: React.FC<MapViewProps> = ({ universities }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markers = useRef<any[]>([]);

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([39.8283, -98.5795], 4); // Center of the US
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapInstance.current);
    }
  }, []);

  useEffect(() => {
    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    if (mapInstance.current && universities.length > 0) {
      universities.forEach(uni => {
        if (uni.latitude && uni.longitude) {
          const marker = L.marker([uni.latitude, uni.longitude])
            .addTo(mapInstance.current)
            .bindPopup(`<b>${uni.name}</b><br><a href="//${uni.website}" target="_blank" rel="noopener noreferrer">Visit Website</a>`);
          markers.current.push(marker);
        }
      });
        
      // Fit map to markers with smoother animation
      const group = L.featureGroup(markers.current);
      mapInstance.current.fitBounds(group.getBounds().pad(0.1), {
          maxZoom: 15,
          animate: true,
          duration: 1.0, // in seconds
          easeLinearity: 0.3,
      });
    } else if (mapInstance.current) {
        // Reset view with smoother animation
        mapInstance.current.setView([39.8283, -98.5795], 4, {
            animate: true,
            duration: 1.0,
            easeLinearity: 0.3,
        });
    }

  }, [universities]);

  return <div ref={mapRef} style={{ height: '100%', width: '100%', borderRadius: '1rem' }} />;
};

export default MapView;