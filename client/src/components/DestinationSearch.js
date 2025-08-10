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
        <div style={{ position: 'relative', marginBottom: 'var(--spacing-4)' }} ref={searchRef}>
            <div style={{ position: 'relative' }}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="🔍 Search for destination (e.g., Central Park, Restaurant name...)"
                    className="form-input"
                    style={{
                        paddingRight: '3rem'
                    }}
                    onFocus={() => setShowResults(results.length > 0)}
                />
                {isLoading && (
                    <div style={{
                        position: 'absolute',
                        right: 'var(--spacing-3)',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--neutral-500)',
                        animation: 'spin 1s linear infinite'
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2V6M12 18V22M6 12H2M22 12H18M19.07 19.07L16.24 16.24M19.07 4.93L16.24 7.76M4.93 19.07L7.76 16.24M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </div>
                )}
            </div>

            {showResults && results.length > 0 && (
                <div className="dropdown-menu" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: 'var(--spacing-1)',
                    backgroundColor: 'white',
                    border: '1px solid var(--neutral-200)',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 1000,
                    maxHeight: '300px',
                    overflowY: 'auto',
                    overflow: 'hidden'
                }}>
                    {results.map((result, index) => (
                        <div
                            key={result.id}
                            onClick={() => handleSelectLocation(result)}
                            style={{
                                padding: 'var(--spacing-3) var(--spacing-4)',
                                borderBottom: index < results.length - 1 ? '1px solid var(--neutral-100)' : 'none',
                                cursor: 'pointer',
                                transition: 'all var(--transition-normal)',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 'var(--spacing-2)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = 'var(--primary-50)';
                                e.target.style.borderColor = 'var(--primary-200)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.borderColor = 'transparent';
                            }}
                        >
                            <div style={{ 
                                fontSize: 'var(--font-size-lg)',
                                marginTop: '2px'
                            }}>
                                📍
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ 
                                    fontWeight: 'var(--font-weight-medium)', 
                                    fontSize: 'var(--font-size-sm)',
                                    marginBottom: 'var(--spacing-1)',
                                    color: 'var(--neutral-900)',
                                    lineHeight: 1.4
                                }}>
                                    {result.name.split(',')[0]}
                                </div>
                                <div style={{ 
                                    fontSize: 'var(--font-size-xs)', 
                                    color: 'var(--neutral-600)',
                                    marginBottom: 'var(--spacing-1)',
                                    lineHeight: 1.3,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {result.name}
                                </div>
                                <div className="badge badge-sm" style={{ 
                                    fontSize: 'var(--font-size-xs)', 
                                    backgroundColor: 'var(--success-100)',
                                    color: 'var(--success-700)',
                                    border: '1px solid var(--success-200)',
                                    padding: '2px var(--spacing-2)',
                                    display: 'inline-block'
                                }}>
                                    {calculateDistance(result)}
                                </div>
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
                    marginTop: 'var(--spacing-1)',
                    backgroundColor: 'white',
                    border: '1px solid var(--neutral-200)',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 1000,
                    padding: 'var(--spacing-6)',
                    textAlign: 'center',
                }}>
                    <div style={{ 
                        color: 'var(--neutral-400)',
                        fontSize: 'var(--font-size-2xl)',
                        marginBottom: 'var(--spacing-2)'
                    }}>
                        🔍
                    </div>
                    <div style={{
                        color: 'var(--neutral-600)',
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 'var(--font-weight-medium)'
                    }}>
                        No locations found
                    </div>
                    <div style={{
                        color: 'var(--neutral-500)',
                        fontSize: 'var(--font-size-xs)',
                        marginTop: 'var(--spacing-1)'
                    }}>
                        Try searching for "{query}" with more details
                    </div>
                </div>
            )}
        </div>
    );
};

export default DestinationSearch;
