// src/components/home/HeroBanner.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

const { width, height } = Dimensions.get('window');

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: 'Lago Potrero',
      subtitle: '🌊 Deportes acuáticos únicos',
      image: require('../../assets/images/lago-potrero.jpg'),
      gradient: ['#4facfe', '#00f2fe'],
    },
    {
      id: 2,
      title: 'Sierras Puntanas',
      subtitle: '🏔️ Trekking y aventura',
      image: require('../../assets/images/sierras.jpg'),
      gradient: ['#667eea', '#764ba2'],
    },
    {
      id: 3,
      title: 'Naturaleza Pura',
      subtitle: '🌲 Aire puro y tranquilidad',
      image: require('../../assets/images/valle.jpg'),
      gradient: ['#43e97b', '#38f9d7'],
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const currentSlideData = slides[currentSlide];

  return (
    <View style={styles.container}>
      <ImageBackground
        source={currentSlideData.image}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
          style={styles.overlay}
        >
          {/* Header con ubicación */}
          <View style={styles.header}>
            <BlurView intensity={30} style={styles.locationBadge}>
              <Ionicons name="location" size={16} color={Colors.text.white} />
              <Text style={styles.locationText}>San Luis, Argentina</Text>
            </BlurView>
          </View>

          {/* Contenido principal */}
          <View style={styles.content}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Potrero de los</Text>
              <LinearGradient
                colors={currentSlideData.gradient}
                style={styles.titleAccentContainer}
              >
                <Text style={styles.titleAccent}>Funes</Text>
              </LinearGradient>
            </View>

            <View style={styles.slideInfo}>
              <Text style={styles.slideTitle}>{currentSlideData.title}</Text>
              <Text style={styles.slideSubtitle}>{currentSlideData.subtitle}</Text>
            </View>

            {/* Indicadores */}
            <View style={styles.indicators}>
              {slides.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.indicator,
                    currentSlide === index && styles.indicatorActive,
                  ]}
                  onPress={() => setCurrentSlide(index)}
                />
              ))}
            </View>
          </View>

          {/* Botón de scroll */}
          <TouchableOpacity style={styles.scrollButton}>
            <BlurView intensity={40} style={styles.scrollButtonBlur}>
              <Ionicons name="chevron-down" size={24} color={Colors.text.white} />
            </BlurView>
          </TouchableOpacity>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height * 0.7,
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
  },
  locationText: {
    color: Colors.text.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.text.white,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    marginBottom: 8,
  },
  titleAccentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 25,
  },
  titleAccent: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.text.white,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  slideInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  slideSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  indicators: {
    flexDirection: 'row',
    gap: 12,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  indicatorActive: {
    backgroundColor: Colors.text.white,
    width: 32,
  },
  scrollButton: {
    alignSelf: 'center',
    borderRadius: 25,
    overflow: 'hidden',
  },
  scrollButtonBlur: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
});

export default HeroBanner;