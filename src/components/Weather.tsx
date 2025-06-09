import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { AutoComplete } from 'primereact/autocomplete';
import type { AutoCompleteChangeEvent } from 'primereact/autocomplete';
import axios from 'axios';

interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    weather_code: number;
  };
}

interface GeoLocation {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string; // State/Province
  country_code?: string;
}

// Weather codes mapping based on WMO standards
const weatherIcons: Record<number, { icon: string; description: string }> = {
  0: { icon: 'sun', description: 'Clear sky' },
  1: { icon: 'cloud', description: 'Partly cloudy' },
  2: { icon: 'cloud', description: 'Cloudy' },
  3: { icon: 'cloud', description: 'Overcast' },
  45: { icon: 'cloud', description: 'Foggy' },
  48: { icon: 'cloud', description: 'Depositing rime fog' },
  51: { icon: 'cloud', description: 'Light drizzle' },
  53: { icon: 'cloud', description: 'Moderate drizzle' },
  55: { icon: 'cloud', description: 'Dense drizzle' },
  61: { icon: 'cloud', description: 'Slight rain' },
  63: { icon: 'cloud', description: 'Moderate rain' },
  65: { icon: 'cloud', description: 'Heavy rain' },
  71: { icon: 'cloud', description: 'Slight snow fall' },
  73: { icon: 'cloud', description: 'Moderate snow fall' },
  75: { icon: 'cloud', description: 'Heavy snow fall' },
  77: { icon: 'cloud', description: 'Snow grains' },
  80: { icon: 'cloud', description: 'Slight rain showers' },
  81: { icon: 'cloud', description: 'Moderate rain showers' },
  82: { icon: 'cloud', description: 'Violent rain showers' },
  85: { icon: 'cloud', description: 'Slight snow showers' },
  86: { icon: 'cloud', description: 'Heavy snow showers' },
  95: { icon: 'cloud', description: 'Thunderstorm' },
  96: { icon: 'cloud', description: 'Thunderstorm with slight hail' },
  99: { icon: 'cloud', description: 'Thunderstorm with heavy hail' },
};

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<GeoLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<GeoLocation | null>(null);

  const searchLocations = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
      );
      setSuggestions(response.data.results || []);
    } catch (err) {
      console.error('Error fetching locations:', err);
      setSuggestions([]);
    }
  };

  const getWeather = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code`
      );
      setWeather(response.data);
    } catch (err) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await axios.get(
              `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&language=en&format=json`
            );
            if (response.data.results?.length > 0) {
              setSelectedLocation(response.data.results[0]);
              await getWeather(position.coords.latitude, position.coords.longitude);
            }
          } catch (err) {
            setError('Failed to get location details');
            setLoading(false);
          }
        },
        () => {
          setError('Unable to get location');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported');
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleLocationSelect = (location: GeoLocation) => {
    setSelectedLocation(location);
    getWeather(location.latitude, location.longitude);
  };

  const itemTemplate = (location: GeoLocation) => {
    return (
      <div className="location-item">
        <span>{location.name}</span>
        <span className="location-detail">
          {location.admin1 ? `${location.admin1}, ` : ''}{location.country}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="weather-card loading">
        <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
        <p>Loading weather data...</p>
      </div>
    );
  }

  return (
    <div className="weather-container">
      <div className="weather-search">
        <AutoComplete
          value={searchQuery}
          suggestions={suggestions}
          completeMethod={(e) => searchLocations(e.query)}
          onChange={(e: AutoCompleteChangeEvent) => setSearchQuery(e.value)}
          onSelect={(e) => handleLocationSelect(e.value)}
          field="name"
          itemTemplate={itemTemplate}
          placeholder="Search location..."
          className="w-full themed-input"
        />
        <Button
          icon="pi pi-compass"
          className="p-button-rounded p-button-text"
          onClick={getCurrentLocation}
          tooltip="Use current location"
        />
      </div>

      {error ? (
        <div className="weather-card error">
          <i className="pi pi-exclamation-triangle" style={{ fontSize: '2rem' }}></i>
          <p>{error}</p>
          <Button 
            label="Try Again" 
            className="p-button-sm" 
            onClick={() => selectedLocation ? 
              getWeather(selectedLocation.latitude, selectedLocation.longitude) : 
              getCurrentLocation()
            }
          />
        </div>
      ) : weather ? (
        <div className="weather-card">
          <div className="weather-header">
            <div className="weather-location">
              <h3>{selectedLocation?.name}</h3>
              {selectedLocation && (
                <span className="location-detail">
                  {selectedLocation.admin1 ? `${selectedLocation.admin1}, ` : ''}
                  {selectedLocation.country}
                </span>
              )}
            </div>
            <i className={`pi pi-${weatherIcons[weather.current.weather_code]?.icon || 'cloud'}`} 
               style={{ fontSize: '2.5rem', color: 'var(--bright-red)' }}
            />
          </div>
          <div className="weather-info">
            <div className="temp">
              <i className="pi pi-thermometer"></i>
              <span>{Math.round(weather.current.temperature_2m)}°C</span>
            </div>
            <div className="feels-like">
              <i className="pi pi-info-circle"></i>
              <span>Feels like: {Math.round(weather.current.apparent_temperature)}°C</span>
            </div>
            <div className="humidity">
              <i className="pi pi-cloud"></i>
              <span>Humidity: {weather.current.relative_humidity_2m}%</span>
            </div>
            <div className="description">
              <i className="pi pi-sun"></i>
              <span>{weatherIcons[weather.current.weather_code]?.description || 'Unknown'}</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
} 