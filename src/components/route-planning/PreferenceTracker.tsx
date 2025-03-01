
import React, { useEffect, useRef } from 'react';
import { AttractionType, RestaurantType } from './types';

interface PreferenceTrackerProps {
  onPreferencesChanged: () => void;
  setPreferredLodging: (type: string) => void;
  setPreferredRestaurant: (type: RestaurantType) => void;
  setPreferredAttraction: (type: AttractionType) => void;
  preferredLodging: string;
  preferredRestaurant: RestaurantType;
  preferredAttraction: AttractionType;
}

/**
 * Component that tracks user preferences from localStorage
 */
const PreferenceTracker: React.FC<PreferenceTrackerProps> = ({
  onPreferencesChanged,
  setPreferredLodging,
  setPreferredRestaurant,
  setPreferredAttraction,
  preferredLodging,
  preferredRestaurant,
  preferredAttraction
}) => {
  // Store previous preferences to detect changes
  const prevLodgingRef = useRef<string>('any');
  const prevRestaurantRef = useRef<RestaurantType>('any');
  const prevAttractionRef = useRef<AttractionType>('any');

  // Check for preference changes in localStorage
  useEffect(() => {
    const intervalId = setInterval(() => {
      const storedLodging = localStorage.getItem('preferredLodging');
      const storedRestaurant = localStorage.getItem('preferredRestaurant');
      const storedAttraction = localStorage.getItem('preferredAttraction');
      
      let changed = false;
      
      if (storedLodging && storedLodging !== preferredLodging) {
        setPreferredLodging(storedLodging);
        changed = true;
        console.log('Preference changed: lodging from', preferredLodging, 'to', storedLodging);
      }
      
      if (storedRestaurant && storedRestaurant !== preferredRestaurant) {
        setPreferredRestaurant(storedRestaurant as RestaurantType);
        changed = true;
        console.log('Preference changed: restaurant from', preferredRestaurant, 'to', storedRestaurant);
      }
      
      if (storedAttraction && storedAttraction !== preferredAttraction) {
        setPreferredAttraction(storedAttraction as AttractionType);
        changed = true;
        console.log('Preference changed: attraction from', preferredAttraction, 'to', storedAttraction);
      }
      
      if (changed) {
        onPreferencesChanged();
        console.log('Preferences changed, will recalculate stops');
      }
    }, 500);
    
    return () => clearInterval(intervalId);
  }, [preferredLodging, preferredRestaurant, preferredAttraction, setPreferredLodging, setPreferredRestaurant, setPreferredAttraction, onPreferencesChanged]);

  // Load preferences from localStorage on initial render
  useEffect(() => {
    const storedLodging = localStorage.getItem('preferredLodging');
    if (storedLodging) {
      setPreferredLodging(storedLodging);
      prevLodgingRef.current = storedLodging;
      console.log('Loaded stored lodging preference:', storedLodging);
    }
    
    const storedRestaurant = localStorage.getItem('preferredRestaurant');
    if (storedRestaurant) {
      // Cast to RestaurantType for type safety
      setPreferredRestaurant(storedRestaurant as RestaurantType);
      prevRestaurantRef.current = storedRestaurant as RestaurantType;
      console.log('Loaded stored restaurant preference:', storedRestaurant);
    }
    
    const storedAttraction = localStorage.getItem('preferredAttraction');
    if (storedAttraction) {
      console.log('Loaded stored attraction preference:', storedAttraction);
      setPreferredAttraction(storedAttraction as AttractionType);
      prevAttractionRef.current = storedAttraction as AttractionType;
    }
  }, [setPreferredLodging, setPreferredRestaurant, setPreferredAttraction]);

  // Check if preferences have changed
  const havePreferencesChanged = () => {
    const hasLodgingChanged = prevLodgingRef.current !== preferredLodging;
    const hasRestaurantChanged = prevRestaurantRef.current !== preferredRestaurant;
    const hasAttractionChanged = prevAttractionRef.current !== preferredAttraction;
    
    if (hasLodgingChanged || hasRestaurantChanged || hasAttractionChanged) {
      console.log('Preferences have changed:', {
        lodging: { from: prevLodgingRef.current, to: preferredLodging },
        restaurant: { from: prevRestaurantRef.current, to: preferredRestaurant },
        attraction: { from: prevAttractionRef.current, to: preferredAttraction }
      });
      
      // Update the refs to the current values
      prevLodgingRef.current = preferredLodging;
      prevRestaurantRef.current = preferredRestaurant;
      prevAttractionRef.current = preferredAttraction;
      
      return true;
    }
    
    return false;
  };

  return null; // This component doesn't render anything visible
};

export default PreferenceTracker;
