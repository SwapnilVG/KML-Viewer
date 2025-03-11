import { kml } from '@tmcw/togeojson';

export const parseKMLFile = async (file) => {
  try {
    const text = await file.text();
    const parser = new DOMParser();
    const kmlDoc = parser.parseFromString(text, 'text/xml');
    const geoJson = kml(kmlDoc);
    
    // Handle MultiGeometry by splitting into separate features
    const processedGeoJson = {
      ...geoJson,
      features: geoJson.features.flatMap(feature => {
        if (feature.geometry.type === 'GeometryCollection') {
          return feature.geometry.geometries.map(geometry => ({
            type: 'Feature',
            properties: feature.properties,
            geometry: geometry
          }));
        }
        return [feature];
      })
    };

    return analyzeKMLContent(processedGeoJson);
  } catch (error) {
    console.error('Error parsing KML file:', error);
    throw error;
  }
};

const calculateLength = (coordinates, type) => {
  let length = 0;

  switch (type) {
    case 'LineString':
      if (coordinates.length < 2) return 0;
      for (let i = 1; i < coordinates.length; i++) {
        const [lon1, lat1] = coordinates[i - 1];
        const [lon2, lat2] = coordinates[i];
        length += getDistance(lat1, lon1, lat2, lon2);
      }
      break;

    case 'MultiLineString':
      coordinates.forEach(line => {
        if (line.length >= 2) {
          for (let i = 1; i < line.length; i++) {
            const [lon1, lat1] = line[i - 1];
            const [lon2, lat2] = line[i];
            length += getDistance(lat1, lon1, lat2, lon2);
          }
        }
      });
      break;

    case 'Polygon':
      if (!coordinates[0] || coordinates[0].length < 3) return 0;
      const outerRing = coordinates[0];
      for (let i = 1; i < outerRing.length; i++) {
        const [lon1, lat1] = outerRing[i - 1];
        const [lon2, lat2] = outerRing[i];
        length += getDistance(lat1, lon1, lat2, lon2);
      }
      break;

    case 'MultiPolygon':
      coordinates.forEach(polygon => {
        if (polygon[0] && polygon[0].length >= 3) {
          const outerRing = polygon[0];
          for (let i = 1; i < outerRing.length; i++) {
            const [lon1, lat1] = outerRing[i - 1];
            const [lon2, lat2] = outerRing[i];
            length += getDistance(lat1, lon1, lat2, lon2);
          }
        }
      });
      break;
  }

  return length;
};

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (value) => (value * Math.PI) / 180;

const analyzeKMLContent = (geoJson) => {
  const summary = {
    elementCounts: {},
    elements: [],
    geoJson
  };

  geoJson.features.forEach(feature => {
    if (!feature.geometry) return;
    
    const type = feature.geometry.type;
    summary.elementCounts[type] = (summary.elementCounts[type] || 0) + 1;

    let length = 0;
    if (['LineString', 'MultiLineString', 'Polygon', 'MultiPolygon'].includes(type)) {
      length = calculateLength(feature.geometry.coordinates, type);
    }

    summary.elements.push({
      type,
      name: feature.properties?.name || 'Unnamed',
      length: length ? length.toFixed(2) : null,
      coordinates: feature.geometry.coordinates
    });
  });

  return summary;
};

export const getBounds = (geoJson) => {
  let bounds = {
    north: -90,
    south: 90,
    east: -180,
    west: 180
  };

  const updateBounds = (lon, lat) => {
    if (typeof lat === 'number' && typeof lon === 'number' && 
        !isNaN(lat) && !isNaN(lon)) {
      bounds.north = Math.max(bounds.north, lat);
      bounds.south = Math.min(bounds.south, lat);
      bounds.east = Math.max(bounds.east, lon);
      bounds.west = Math.min(bounds.west, lon);
    }
  };

  const processCoordinate = (coord) => {
    if (Array.isArray(coord) && coord.length >= 2) {
      const [lon, lat] = coord;
      updateBounds(lon, lat);
    }
  };

  const processCoordinates = (coordinates, type) => {
    if (!coordinates) return;

    switch (type) {
      case 'Point':
        processCoordinate(coordinates);
        break;
      case 'LineString':
        coordinates.forEach(processCoordinate);
        break;
      case 'Polygon':
        coordinates[0]?.forEach(processCoordinate);
        break;
      case 'MultiLineString':
        coordinates.forEach(line => line?.forEach(processCoordinate));
        break;
      case 'MultiPoint':
        coordinates.forEach(processCoordinate);
        break;
      case 'MultiPolygon':
        coordinates.forEach(polygon => polygon[0]?.forEach(processCoordinate));
        break;
    }
  };

  geoJson.features.forEach(feature => {
    if (feature?.geometry?.coordinates) {
      processCoordinates(feature.geometry.coordinates, feature.geometry.type);
    }
  });

  // Add a small buffer to the bounds
  const buffer = 0.01; // Approximately 1km at the equator
  bounds.north += buffer;
  bounds.south -= buffer;
  bounds.east += buffer;
  bounds.west -= buffer;

  // Ensure valid bounds
  if (bounds.north === -90 || bounds.south === 90 || 
      bounds.east === -180 || bounds.west === 180) {
    bounds = {
      north: 37.7749,
      south: 37.7749,
      east: -122.4194,
      west: -122.4194
    };
  }

  return bounds;
}; 