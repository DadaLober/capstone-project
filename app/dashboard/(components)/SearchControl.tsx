import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface SearchControlProps {
    onSearchResult: (result: any) => void;
}

interface Suggestion {
    display_name: string;
    lat: string;
    lon: string;
}

const CACHE_EXPIRATION = 1000 * 60 * 60; // 1 hour

export const SearchControl: React.FC<SearchControlProps> = ({ onSearchResult }) => {
    const map = useMap();
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const searchControlRef = useRef<L.Control | null>(null);
    const cacheRef = useRef<{ [key: string]: { data: Suggestion[], timestamp: number } }>({});

    const fetchSuggestions = useCallback(async (query: string) => {
        if (query.length < 3) return;
        setIsLoading(true);

        // Check cache first
        const cachedResult = cacheRef.current[query];
        if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_EXPIRATION) {
            setSuggestions(cachedResult.data);
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
            const data: Suggestion[] = await response.json();
            setSuggestions(data);

            // Update cache
            cacheRef.current[query] = { data, timestamp: Date.now() };
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const debouncedFetchSuggestions = useCallback(
        debounce((query: string) => fetchSuggestions(query), 300),
        [fetchSuggestions]
    );

    useEffect(() => {
        if (!searchControlRef.current) {
            const SearchControl = L.Control.extend({
                onAdd: function () {
                    const container = L.DomUtil.create('div', 'leaflet-control-geosearch');
                    return container;
                }
            });

            searchControlRef.current = new SearchControl({ position: 'topleft' }).addTo(map);
        }

        return () => {
            if (searchControlRef.current) {
                map.removeControl(searchControlRef.current);
            }
        };
    }, [map]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedFetchSuggestions(value);
    };

    const handleSuggestionClick = (suggestion: Suggestion) => {
        onSearchResult({
            x: parseFloat(suggestion.lon),
            y: parseFloat(suggestion.lat),
            label: suggestion.display_name
        });
        setSearchTerm(suggestion.display_name);
        setSuggestions([]);
    };

    useEffect(() => {
        const searchControl = L.Control.extend({
            onAdd: function () {
                const container = L.DomUtil.create('div', 'leaflet-control-geosearch');
                L.DomEvent.disableClickPropagation(container);
                return container;
            }
        });

        const control = new searchControl({ position: 'topleft' }).addTo(map);

        return () => {
            map.removeControl(control);
        };
    }, [map]);

    return (
        <div className="leaflet-control-geosearch">
            <div className={`search-input-container ${isLoading ? 'pulsing' : ''}`}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    placeholder="Search for a location..."
                    className="search-input"
                />
            </div>
            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                            {suggestion.display_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// Simple debounce implementation
function debounce(func: (...args: any[]) => void, wait: number) {
    let timeout: NodeJS.Timeout | null = null;
    return (...args: any[]) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}