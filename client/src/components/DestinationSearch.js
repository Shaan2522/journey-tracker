import React, { useState, useRef, useEffect } from 'react';

const DestinationSearch = ({ onDestinationSelect, currentLocation }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);
    const timeoutRef = useRef(null);

    // Search for locations using Nominatim (OpenStreetMap's search service)
    const searchLocations = async (searchQuery) => {
        if (searchQuery.length < 3) {
            setResults([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&addressdetails=1`
            );
            const data = await response.json();
            
            const formattedResults = data.map(item => ({
                id: item.place_id,
                name: item.display_name,
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lon),
                type: item.type,
                address: item.address
            }));
            
            setResults(formattedResults);
            setShowResults(true);
        } catch (error) {
            console.error('Error searching locations:', error);
            setResults([]);
        }
        setIsLoading(false);
    };

    // Debounced search
    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
            if (query.trim()) {
                searchLocations(query.trim());
            } else {
                setResults([]);
                setShowResults(false);
            }
        }, 300);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [query]);

    // Close results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectLocation = (location) => {
        setQuery(location.name);
        setShowResults(false);
        onDestinationSelect({ lat: location.lat, lng: location.lng });
    };

    const calculateDistance = (dest) => {
        if (!currentLocation) return '';
        
        const R = 6371; // Earth's radius in km
        const dLat = (dest.lat - currentLocation.lat) * Math.PI / 180;
        const dLng = (dest.lng - currentLocation.lng) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(currentLocation.lat * Math.PI / 180) * Math.cos(dest.lat * Math.PI / 180) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        
        return distance < 1 ? `${(distance * 1000).toFixed(0)}m away` : `${distance.toFixed(1)}km away`;
    };

    return (
        <div style={{ position: 'relative', marginBottom: '15px' }} ref={searchRef}>
            <div style={{ position: 'relative' }}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="🔍 Search for destination (e.g., Central Park, Restaurant name...)"
                    style={{
                        width: '100%',
                        padding: '12px 40px 12px 16px',
                        border: '2px solid #e0e6ed',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        boxSizing: 'border-box'
                    }}
                    onFocus={() => setShowResults(results.length > 0)}
                />
                {isLoading && (
                    <div style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '12px',
                        color: '#6c757d'
                    }}>
                        🔄
                    </div>
                )}
            </div>

            {showResults && results.length > 0 && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    border: '1px solid #e0e6ed',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    maxHeight: '300px',
                    overflowY: 'auto'
                }}>
                    {results.map((result, index) => (
                        <div
                            key={result.id}
                            onClick={() => handleSelectLocation(result)}
                            style={{
                                padding: '12px 16px',
                                borderBottom: index < results.length - 1 ? '1px solid #f0f0f0' : 'none',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                                ':hover': { backgroundColor: '#f8f9fa' }
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                            <div style={{ 
                                fontWeight: '500', 
                                fontSize: '14px',
                                marginBottom: '4px',
                                color: '#333'
                            }}>
                                📍 {result.name.split(',')[0]}
                            </div>
                            <div style={{ 
                                fontSize: '12px', 
                                color: '#6c757d',
                                marginBottom: '2px'
                            }}>
                                {result.name}
                            </div>
                            <div style={{ fontSize: '11px', color: '#28a745' }}>
                                {calculateDistance(result)}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showResults && results.length === 0 && !isLoading && query.length >= 3 && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    border: '1px solid #e0e6ed',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    padding: '16px',
                    textAlign: 'center',
                    color: '#6c757d',
                    fontSize: '14px'
                }}>
                    No locations found for "{query}"
                </div>
            )}
        </div>
    );
};

export default DestinationSearch;
