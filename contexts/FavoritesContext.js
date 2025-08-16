import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites debe usarse dentro de FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const STORAGE_KEY = '@potrero_favorites';

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error cargando favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveFavorites = async (newFavorites) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error guardando favoritos:', error);
    }
  };

  const addToFavorites = async (attraction) => {
    const newFavorites = [...favorites, { ...attraction, dateAdded: new Date().toISOString() }];
    setFavorites(newFavorites);
    await saveFavorites(newFavorites);
  };

  const removeFromFavorites = async (attractionId) => {
    const newFavorites = favorites.filter(item => item.id !== attractionId);
    setFavorites(newFavorites);
    await saveFavorites(newFavorites);
  };

  const toggleFavorite = async (attraction) => {
    const isFav = favorites.some(item => item.id === attraction.id);
    if (isFav) {
      await removeFromFavorites(attraction.id);
    } else {
      await addToFavorites(attraction);
    }
  };

  const isFavorite = (attractionId) => {
    return favorites.some(item => item.id === attractionId);
  };

  const clearAllFavorites = async () => {
    setFavorites([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const value = {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearAllFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};