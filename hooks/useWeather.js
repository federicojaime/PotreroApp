// hooks/useWeather.js - HOOK PARA CLIMA REAL DE POTRERO
import { useState, useEffect } from 'react';

const useWeather = () => {
  const [weatherData, setWeatherData] = useState({
    temperature: null,
    windSpeed: null,
    loading: true,
    error: null,
    lastUpdated: null,
  });

  // Coordenadas de Potrero de los Funes
  const LATITUDE = -32.5948;
  const LONGITUDE = -65.1486;
  const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&current=temperature_2m,wind_speed_10m,relative_humidity_2m&timezone=America/Argentina/Buenos_Aires`;

  const fetchWeather = async () => {
    try {
      setWeatherData(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      setWeatherData({
        temperature: Math.round(data.current.temperature_2m),
        windSpeed: Math.round(data.current.wind_speed_10m * 10) / 10, // 1 decimal
        humidity: data.current.relative_humidity_2m || 65, // fallback
        loading: false,
        error: null,
        lastUpdated: new Date().toISOString(),
        rawData: data, // para debug
      });
      
    } catch (error) {
      console.error('Error fetching weather:', error);
      
      // Fallback data si falla la API
      setWeatherData({
        temperature: 22, // fallback
        windSpeed: 8.0, // fallback
        humidity: 65, // fallback
        loading: false,
        error: error.message,
        lastUpdated: null,
      });
    }
  };

  useEffect(() => {
    fetchWeather();
    
    // Actualizar cada 10 minutos
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Función para refrescar manualmente
  const refreshWeather = () => {
    fetchWeather();
  };

  // Función para obtener el icono del clima basado en temperatura
  const getWeatherIcon = () => {
    if (weatherData.temperature === null) return 'cloud-outline';
    
    if (weatherData.temperature >= 25) return 'sunny';
    if (weatherData.temperature >= 15) return 'partly-sunny';
    if (weatherData.temperature >= 5) return 'cloudy';
    return 'snow';
  };

  // Función para obtener descripción del clima
  const getWeatherDescription = () => {
    if (weatherData.temperature === null) return 'Cargando...';
    
    if (weatherData.temperature >= 25) return 'Caluroso';
    if (weatherData.temperature >= 20) return 'Agradable';
    if (weatherData.temperature >= 15) return 'Templado';
    if (weatherData.temperature >= 10) return 'Fresco';
    return 'Frío';
  };

  return {
    ...weatherData,
    refreshWeather,
    getWeatherIcon,
    getWeatherDescription,
  };
};

export default useWeather;