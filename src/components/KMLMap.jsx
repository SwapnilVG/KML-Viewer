import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { getBounds } from '../utils/kmlParser';
import 'leaflet/dist/leaflet.css';
import { FiAlertCircle } from 'react-icons/fi';
import L from 'leaflet';

// Fix Leaflet's default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map updates
const MapUpdater = ({ bounds, updateKey }) => {
  const map = useMap();
  
  useEffect(() => {
    if (bounds && map) {
      try {
        const { north, south, east, west } = bounds;
        const corner1 = L.latLng(south, west);
        const corner2 = L.latLng(north, east);
        const bounds = L.latLngBounds(corner1, corner2);
        
        // Add padding to ensure features are visible
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 16,
          animate: true,
          duration: 0.5
        });
      } catch (error) {
        console.error('Error updating map bounds:', error);
        map.setView([37.7749, -122.4194], 12);
      }
    }
  }, [bounds, map, updateKey]);

  return null;
};

const getFeatureStyle = (feature) => {
  const type = feature.geometry.type;
  const baseStyle = {
    weight: 2,
    opacity: 0.8,
    fillOpacity: 0.4
  };

  switch (type) {
    case 'LineString':
    case 'MultiLineString':
      return {
        ...baseStyle,
        color: '#3388ff',
        dashArray: null
      };
    case 'Polygon':
    case 'MultiPolygon':
      return {
        ...baseStyle,
        color: '#33aa33',
        fillColor: '#33aa33'
      };
    default:
      return baseStyle;
  }
};

const KMLMap = ({ kmlData, filePath }) => {
  const [error, setError] = useState(null);
  const [updateKey, setUpdateKey] = useState(Date.now());
  const geoJsonRef = useRef();
  const lastModified = useRef(null);

  // Function to check for file changes
  const checkFileChanges = async () => {
    try {
      const response = await fetch(filePath, { method: 'HEAD' });
      const currentModified = response.headers.get('last-modified');
      
      if (lastModified.current && lastModified.current !== currentModified) {
        // File has changed, trigger update
        setUpdateKey(Date.now());
      }
      
      lastModified.current = currentModified;
    } catch (err) {
      console.error('Error checking file changes:', err);
    }
  };

  // Set up file change monitoring
  useEffect(() => {
    if (!filePath) return;

    // Check for changes every 2 seconds
    const interval = setInterval(checkFileChanges, 2000);

    // Initial check
    checkFileChanges();

    return () => clearInterval(interval);
  }, [filePath]);

  // Update when kmlData changes
  useEffect(() => {
    setUpdateKey(Date.now());
  }, [kmlData]);

  if (!kmlData?.geoJson) return null;

  let bounds;
  try {
    bounds = getBounds(kmlData.geoJson);
  } catch (err) {
    console.error('Error getting bounds:', err);
    return (
      <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg bg-base-200 flex items-center justify-center">
        <div className="text-error flex items-center gap-2">
          <FiAlertCircle className="w-6 h-6" />
          <span>Error loading map data</span>
        </div>
      </div>
    );
  }

  const center = [
    (bounds.north + bounds.south) / 2,
    (bounds.east + bounds.west) / 2
  ];

  const onEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.name) {
      layer.bindPopup(feature.properties.name);
    }
  };

  const pointToLayer = (feature, latlng) => {
    return L.circleMarker(latlng, {
      radius: 8,
      fillColor: "#ff7800",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    });
  };

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        key={`map-${updateKey}`}
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          key={`geojson-${updateKey}`}
          data={kmlData.geoJson}
          style={getFeatureStyle}
          onEachFeature={onEachFeature}
          pointToLayer={pointToLayer}
          ref={geoJsonRef}
        />
        <MapUpdater bounds={bounds} updateKey={updateKey} />
      </MapContainer>
    </div>
  );
};

export default KMLMap; 