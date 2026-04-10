import { useEffect, useId, useRef, useState } from 'react';
import { hasGoogleMapsApiKey, loadGoogleMapsPlaces } from '../utils/googleMaps.js';

const GooglePlacesInput = ({
  id,
  name,
  value = '',
  onChange,
  onPlaceSelect,
  placeholder,
  className = 'medical-input',
  disabled = false,
  autoComplete = 'off',
}) => {
  const generatedId = useId();
  const inputRef = useRef(null);
  const listenerRef = useRef(null);
  const onChangeRef = useRef(onChange);
  const onPlaceSelectRef = useRef(onPlaceSelect);
  const inputId = id || `google-places-${generatedId}`;
  const [status, setStatus] = useState(hasGoogleMapsApiKey ? 'loading' : 'idle');

  useEffect(() => {
    onChangeRef.current = onChange;
    onPlaceSelectRef.current = onPlaceSelect;
  }, [onChange, onPlaceSelect]);

  useEffect(() => {
    let isCancelled = false;

    if (!hasGoogleMapsApiKey || disabled || !inputRef.current) {
      return undefined;
    }

    const initializeAutocomplete = async () => {
      try {
        setStatus('loading');
        const places = await loadGoogleMapsPlaces();

        if (!places || isCancelled || !inputRef.current) {
          return;
        }

        const autocomplete = new places.Autocomplete(inputRef.current, {
          fields: ['formatted_address', 'name'],
          types: ['geocode'],
        });

        listenerRef.current = autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          const nextValue = place.formatted_address || place.name || inputRef.current?.value || '';

          onChangeRef.current?.({
            target: {
              name,
              value: nextValue,
            },
          });

          onPlaceSelectRef.current?.(place);
        });

        setStatus('ready');
      } catch (error) {
        if (!isCancelled) {
          setStatus('error');
          console.error('Google Maps Places autocomplete failed to load.', error);
        }
      }
    };

    initializeAutocomplete();

    return () => {
      isCancelled = true;
      listenerRef.current?.remove();
      listenerRef.current = null;
    };
  }, [disabled, name]);

  return (
    <div>
      <input
        ref={inputRef}
        id={inputId}
        name={name}
        type="text"
        className={className}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />

      {import.meta.env.DEV && !hasGoogleMapsApiKey && (
        <p className="mt-2 text-xs text-slate-500">
          Add <code>VITE_GOOGLE_MAPS_API_KEY</code> to enable Google Maps suggestions.
        </p>
      )}

      {status === 'error' && (
        <p className="mt-2 text-xs text-amber-700">
          Google Maps suggestions are unavailable right now. You can still type the location manually.
        </p>
      )}
    </div>
  );
};

export default GooglePlacesInput;
