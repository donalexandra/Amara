import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Phone, MapPin, XCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon for user
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const CrisisGuide = () => {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } }
  };

  const userLocation = [40.7128, -74.0060]; // Mock user location
  const hospitals = [
    { id: 1, name: "City SANE Program", lat: 40.7158, lng: -74.0110, distance: "2.4 miles" },
    { id: 2, name: "Mercy General Hospital", lat: 40.7098, lng: -74.0020, distance: "3.1 miles" },
    { id: 3, name: "Hope Women's Clinic", lat: 40.7188, lng: -73.9980, distance: "4.5 miles" }
  ];

  return (
    <motion.div
      className="view-content"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="crisis-container">
        <div className="crisis-header">
          <h2><ShieldAlert size={32} /> Immediate Actions</h2>
          <p style={{ fontSize: '16px', color: '#4B5563', lineHeight: '1.6' }}>
            If you are in immediate danger, call emergency services. The following steps help preserve evidence and ensure your safety.
          </p>
        </div>

        <div className="crisis-content">
          <div className="action-steps">
            <div className="step-card danger">
              <XCircle className="step-icon" size={24} />
              <div>
                <h3>1. Do Not Bathe</h3>
                <p>Avoid showering, bathing, washing your hands, or brushing your teeth to preserve crucial physical evidence.</p>
              </div>
            </div>

            <div className="step-card">
              <div className="step-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 11-2-2-2 2"></path><path d="m11 7 2-2 2 2"></path><path d="M12 14v5"></path><path d="M16 19h-8"></path><path d="M21 11c0-4-3-8-9-8s-9 4-9 8c0 3.33 2.67 6 6 6h6c3.33 0 6-2.67 6-6Z"></path></svg>
              </div>
              <div>
                <h3>2. Preservation Steps</h3>
                <p>Place the clothes you were wearing in a paper bag (not plastic). Do not wash them or any bedding involved.</p>
              </div>
            </div>

            <div className="step-card">
              <div className="step-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect><path d="M12 18h.01"></path></svg>
              </div>
              <div>
                <h3>3. Digital Evidence</h3>
                <p>Take screenshots of any relevant texts, calls, or social media interactions. Do not delete anything.</p>
              </div>
            </div>
          </div>

          <div className="emergency-help">
            <h3>Emergency Help</h3>

            <div className="map-container">
              <MapContainer center={userLocation} zoom={13} style={{ height: '100%', width: '100%', zIndex: 1 }}>
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={userLocation} icon={userIcon}>
                  <Popup>Your Location</Popup>
                </Marker>
                {hospitals.map(h => (
                  <Marker key={h.id} position={[h.lat, h.lng]}>
                    <Popup>{h.name}</Popup>
                  </Marker>
                ))}
              </MapContainer>
              <div className="map-overlay">
                <MapPin size={12} color="#6B46C1" /> Nearest SANE Program: {hospitals[0].distance}
              </div>
            </div>

            <div className="emergency-buttons">
              <a href="tel:800-656-4673" className="btn-hotline">
                <Phone size={20} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontSize: '14px', lineHeight: '1.2' }}>
                  <span>National Hotline</span>
                  <span style={{ fontSize: '12px', fontWeight: '400' }}>(+234 901-2345678)</span>
                </div>
              </a>
              <a href="tel:911" className="btn-911">
                <ShieldAlert size={20} />
                Call 122
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CrisisGuide;
