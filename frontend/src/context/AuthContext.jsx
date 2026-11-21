import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('travelmatene_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('travelmatene_token') || '');
  const [savedDestinations, setSavedDestinations] = useState(() => {
    const saved = localStorage.getItem('travelmatene_saved_dests');
    return saved ? JSON.parse(saved) : ['kaziranga-national-park', 'cherrapunji-sohra-bridges', 'tawang-monastery-pass'];
  });
  const [savedItineraries, setSavedItineraries] = useState(() => {
    const saved = localStorage.getItem('travelmatene_saved_itineraries');
    return saved ? JSON.parse(saved) : [];
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('travelmatene_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('travelmatene_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('travelmatene_token', token);
    } else {
      localStorage.removeItem('travelmatene_token');
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem('travelmatene_saved_dests', JSON.stringify(savedDestinations));
  }, [savedDestinations]);

  useEffect(() => {
    localStorage.setItem('travelmatene_saved_itineraries', JSON.stringify(savedItineraries));
  }, [savedItineraries]);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res && res.token) {
      setUser(res.user);
      setToken(res.token);
      if (res.user.saved_destinations?.length) {
        setSavedDestinations(res.user.saved_destinations);
      }
      return { success: true };
    }
    // Offline / Demo fallback
    if (email === 'demo@travelmatene.com' || password === 'northeast2026') {
      const demoUser = {
        email: email || 'demo@travelmatene.com',
        full_name: 'Northeast Explorer',
        saved_destinations: savedDestinations,
        saved_itineraries: savedItineraries
      };
      setUser(demoUser);
      setToken('demo-jwt-token-2026');
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials. Use demo@travelmatene.com / northeast2026.' };
  };

  const register = async (email, password, fullName) => {
    const res = await api.register({ email, password, full_name: fullName });
    if (res && res.token) {
      setUser(res.user);
      setToken(res.token);
      return { success: true };
    }
    // Fallback local registration
    const newUser = {
      email,
      full_name: fullName,
      saved_destinations: savedDestinations,
      saved_itineraries: savedItineraries
    };
    setUser(newUser);
    setToken('local-registered-token');
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setToken('');
  };

  const toggleSaveDestination = async (destId) => {
    let nextSaved;
    if (savedDestinations.includes(destId)) {
      nextSaved = savedDestinations.filter(id => id !== destId);
    } else {
      nextSaved = [...savedDestinations, destId];
    }
    setSavedDestinations(nextSaved);

    if (token) {
      api.toggleSaveDestination(destId, token);
    }
  };

  const saveItinerary = async (itinerary) => {
    const nextList = [itinerary, ...savedItineraries];
    setSavedItineraries(nextList);
    if (token) {
      api.saveItinerary(itinerary, token);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      savedDestinations,
      savedItineraries,
      isAuthModalOpen,
      setIsAuthModalOpen,
      login,
      register,
      logout,
      toggleSaveDestination,
      saveItinerary
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
