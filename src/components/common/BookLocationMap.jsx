'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { MapPin, Navigation, ExternalLink, ShieldCheck, Compass, AlertCircle } from 'lucide-react';

// Known coordinates for Indian cities and localities in BookLoop
const LOCATION_COORDINATES = {
  'Sector 62, Noida, UP': { lat: 28.6280, lng: 77.3649 },
  'Indirapuram, Ghaziabad, UP': { lat: 28.6415, lng: 77.3714 },
  'Kalu Sarai, South Delhi': { lat: 28.5445, lng: 77.1989 },
  'Alpha 1, Greater Noida, UP': { lat: 28.4720, lng: 77.5140 },
  'Cyber City, Gurugram, HR': { lat: 28.4950, lng: 77.0895 },
  'Daryaganj Book Bazaar, Delhi': { lat: 28.6469, lng: 77.2410 },
  'Koramangala, Bangalore, KA': { lat: 12.9352, lng: 77.6245 },
  'Rajendra Nagar, New Delhi': { lat: 28.6415, lng: 77.1855 },
  'Hazratganj, Lucknow, UP': { lat: 26.8500, lng: 80.9499 },
  'Bandra West, Mumbai, MH': { lat: 19.0596, lng: 72.8295 },
  'Civil Lines, Jaipur, RJ': { lat: 26.9069, lng: 75.7878 },
  'Sector 18, Noida, UP': { lat: 28.5708, lng: 77.3271 },
  'Noida, UP': { lat: 28.5355, lng: 77.3910 },
  'Delhi NCR': { lat: 28.6139, lng: 77.2090 },
  'South Delhi': { lat: 28.5445, lng: 77.1989 },
  'Greater Noida, UP': { lat: 28.4744, lng: 77.5040 },
  'Ghaziabad, UP': { lat: 28.6692, lng: 77.4538 },
  'Gurugram, HR': { lat: 28.4595, lng: 77.0266 },
  'Lucknow, UP': { lat: 26.8467, lng: 80.9462 },
  'Kanpur, UP': { lat: 26.4499, lng: 80.3319 },
  'Jaipur, RJ': { lat: 26.9124, lng: 75.7873 },
  'Dehradun, UK': { lat: 30.3165, lng: 78.0322 },
  'Bangalore, KA': { lat: 12.9716, lng: 77.5946 },
  'Mumbai, MH': { lat: 19.0760, lng: 72.8777 },
  'Pune, MH': { lat: 18.5204, lng: 73.8567 },
};

function resolveCoordinates(locationStr, cityStr) {
  if (locationStr && LOCATION_COORDINATES[locationStr]) {
    return LOCATION_COORDINATES[locationStr];
  }
  // Search partial matches
  if (locationStr) {
    const matchedKey = Object.keys(LOCATION_COORDINATES).find(key => 
      locationStr.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(locationStr.toLowerCase())
    );
    if (matchedKey) return LOCATION_COORDINATES[matchedKey];
  }
  if (cityStr && LOCATION_COORDINATES[cityStr]) {
    return LOCATION_COORDINATES[cityStr];
  }
  // Default to central Delhi NCR
  return { lat: 28.6139, lng: 77.2090 };
}

export function BookLocationMap({ 
  location = 'Sector 62, Noida, UP', 
  city = 'Noida, UP', 
  distance = 'Near you',
  bookTitle = 'Book'
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  const coords = useMemo(() => resolveCoordinates(location, city), [location, city]);
  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location || city}, India`)}`;

  useEffect(() => {
    let isCancelled = false;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyDFnwXfCGrFGcdRPTU4RpxKUc8QU2vWL0Y';

    if (!apiKey) {
      setLoadError('Google Maps API Key not configured');
      setLoading(false);
      return;
    }

    setOptions({
      key: apiKey,
      v: 'weekly',
    });

    importLibrary('maps')
      .then(async ({ Map, Circle }) => {
        if (isCancelled || !mapContainerRef.current) return;

        try {
          const map = new Map(mapContainerRef.current, {
            center: coords,
            zoom: 14,
            mapId: 'DEMO_MAP_ID',
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: true,
            fullscreenControl: true,
            gestureHandling: 'cooperative',
          });

          mapInstanceRef.current = map;

          // Add approximate privacy safe pickup radius circle (450 meters)
          new Circle({
            strokeColor: '#2563EB',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#3B82F6',
            fillOpacity: 0.15,
            map,
            center: coords,
            radius: 450,
          });

          // Try advanced marker or standard marker
          try {
            const { AdvancedMarkerElement, PinElement } = await importLibrary('marker');
            if (!isCancelled) {
              const pin = new PinElement({
                background: '#2563EB',
                borderColor: '#1D4ED8',
                glyphColor: '#FFFFFF',
                scale: 1.15,
              });

              const marker = new AdvancedMarkerElement({
                map,
                position: coords,
                title: `${location || city} (Meetup Area)`,
                content: pin.element
              });

              // Info window on marker click
              const infoWindow = new window.google.maps.InfoWindow({
                content: `
                  <div style="font-family: system-ui, sans-serif; padding: 6px; max-width: 220px;">
                    <div style="font-size: 13px; font-weight: bold; color: #1e293b; margin-bottom: 4px;">
                      📍 ${location || city}
                    </div>
                    <div style="font-size: 11px; color: #64748b; line-height: 1.4;">
                      Approximate Meetup Zone for <strong>${bookTitle.replace(/"/g, '&quot;')}</strong>
                    </div>
                    <div style="margin-top: 8px; font-size: 11px; color: #16a34a; font-weight: 600;">
                      ✓ Public Daylight Safe Zone
                    </div>
                  </div>
                `
              });

              marker.addListener('click', () => {
                infoWindow.open({
                  anchor: marker,
                  map,
                });
              });
            }
          } catch (markerErr) {
            // Fallback to legacy marker if AdvancedMarker not active on key
            if (window.google?.maps?.Marker && !isCancelled) {
              new window.google.maps.Marker({
                position: coords,
                map,
                title: location,
                animation: window.google.maps.Animation.DROP,
              });
            }
          }

          setMapReady(true);
          setLoading(false);
        } catch (err) {
          console.error('Google Maps initialization failed:', err);
          if (!isCancelled) {
            setLoadError(err?.message || 'Could not load map');
            setLoading(false);
          }
        }
      })
      .catch((err) => {
        console.error('Google Maps script load failed:', err);
        if (!isCancelled) {
          setLoadError(err?.message || 'Failed to load Google Maps script');
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [coords, location, city, bookTitle]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo(coords);
      mapInstanceRef.current.setZoom(14);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl font-bold text-slate-900">
              Pickup & Handover Location
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <MapPin className="w-3 h-3 text-blue-600" />
              Google Maps
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Approximate 450m privacy circle shown. Meetup landmark: <strong className="text-slate-700">{location || city}</strong>
          </p>
        </div>

        {/* Action Link: Open Directions in Google Maps */}
        <a
          href={googleMapsSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors shrink-0"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Get Directions</span>
          <ExternalLink className="w-3 h-3 text-blue-500 ml-0.5" />
        </a>
      </div>

      {/* Map Display Container */}
      <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner group">
        {/* Actual Google Maps Canvas */}
        <div 
          ref={mapContainerRef} 
          className="w-full h-full"
          style={{ minHeight: '320px' }}
        />

        {/* Loading Spinner / Skeleton */}
        {loading && (
          <div className="absolute inset-0 bg-slate-100/90 backdrop-blur-xs flex flex-col items-center justify-center gap-3 z-10">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <div className="text-xs font-medium text-slate-600">Loading Google Maps...</div>
          </div>
        )}

        {/* Load Error Fallback Card */}
        {loadError && (
          <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center p-6 text-center z-10">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-slate-900 text-sm mb-1">
              Google Maps Preview
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mb-4">
              Showing landmark: <strong>{location || city}</strong>. You can open live Google Maps directly in your navigation app.
            </p>
            <a
              href={googleMapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-xs"
            >
              <Navigation className="w-4 h-4" />
              <span>Open in Google Maps App</span>
            </a>
          </div>
        )}

        {/* Floating Quick Action Overlay on Map */}
        {mapReady && (
          <>
            {/* Top-Left Safe Meetup Banner Badge */}
            <div className="absolute top-3 left-3 z-10 pointer-events-none">
              <div className="px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md text-slate-800 flex items-center gap-2 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Verified Handover Zone</span>
                <span className="text-slate-400 font-normal">· {distance || 'Near reader'}</span>
              </div>
            </div>

            {/* Custom Recenter Button */}
            <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
              <button
                type="button"
                onClick={handleRecenter}
                title="Recenter Location"
                className="p-2 rounded-xl bg-white/95 hover:bg-white text-slate-700 hover:text-blue-600 border border-slate-200/90 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Compass className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Safety & Pickup Guidelines Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-slate-900 text-[11px]">Safe Daylight Meetup</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Pick busy public places like metro gates, cafes, or college gates.</div>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-slate-900 text-[11px]">Privacy Protected</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Exact flat or house number is kept private until seller confirms meetup.</div>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
          <Navigation className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-slate-900 text-[11px]">Instant Navigation</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Tap &quot;Get Directions&quot; to calculate live driving or walking route.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookLocationMap;
