const GOOGLE_MAPS_SCRIPT_ID = 'google-maps-javascript-api';

let googleMapsPromise;

const getGoogleMapsApiKey = () => import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() || '';

export const hasGoogleMapsApiKey = Boolean(getGoogleMapsApiKey());

const loadGoogleMapsApi = () => {
  if (!hasGoogleMapsApiKey || typeof window === 'undefined') {
    return Promise.resolve(null);
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    const handleLoad = () => {
      if (window.google?.maps) {
        resolve(window.google.maps);
        return;
      }

      googleMapsPromise = null;
      reject(new Error('Google Maps JavaScript API loaded without the google.maps object.'));
    };

    const handleError = () => {
      googleMapsPromise = null;
      reject(new Error('Unable to load the Google Maps JavaScript API.'));
    };

    const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID);

    if (existingScript) {
      existingScript.addEventListener('load', handleLoad, { once: true });
      existingScript.addEventListener('error', handleError, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(getGoogleMapsApiKey())}&loading=async&v=weekly`;
    script.async = true;
    script.defer = true;
    script.addEventListener('load', handleLoad, { once: true });
    script.addEventListener('error', handleError, { once: true });
    document.head.appendChild(script);
  });

  return googleMapsPromise;
};

export const loadGoogleMapsPlaces = async () => {
  const maps = await loadGoogleMapsApi();

  if (!maps) {
    return null;
  }

  if (window.google?.maps?.places?.Autocomplete) {
    return window.google.maps.places;
  }

  await window.google.maps.importLibrary('places');
  return window.google.maps.places;
};
