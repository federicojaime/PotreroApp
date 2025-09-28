// screens/WelcomeScreen.js - PANTALLA DE BIENVENIDA CON CLIMA REAL
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    Animated,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import lagoPotrero from '../assets/images/lago-potrero.jpg';
import sierras from '../assets/images/sierras.jpg';
import valle from '../assets/images/valle.jpg';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    // ESTADO DEL CLIMA
    const [weather, setWeather] = useState({
        temperature: 22,
        windSpeed: 8.0,
        humidity: 65,
        loading: true,
    });

    // FUNCIÓN PARA OBTENER CLIMA REAL
    const fetchWeather = async () => {
        try {
            const response = await fetch(
                'https://api.open-meteo.com/v1/forecast?latitude=-32.5948&longitude=-65.1486&current=temperature_2m,wind_speed_10m,relative_humidity_2m&timezone=America/Argentina/Buenos_Aires'
            );

            if (response.ok) {
                const data = await response.json();
                setWeather({
                    temperature: Math.round(data.current.temperature_2m),
                    windSpeed: Math.round(data.current.wind_speed_10m * 10) / 10,
                    humidity: data.current.relative_humidity_2m || 65,
                    loading: false,
                });
            }
        } catch (error) {
            console.log('Error clima Welcome:', error);
            setWeather(prev => ({ ...prev, loading: false }));
        }
    };

    // Hero images que van rotando - IMÁGENES REALES DE POTRERO
    const heroImages = [lagoPotrero, sierras, valle];


    // Rotación automática de imágenes cada 5 segundos
    useEffect(() => {
        // Cargar clima al iniciar
        fetchWeather();

        const interval = setInterval(() => {
            Animated.timing(fadeAnim, {
                toValue: 0.8,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }).start();
            });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const goToHome = () => {
        navigation.replace('Home'); // replace para que no pueda volver atrás
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* HERO SECTION FULLSCREEN */}
            <View style={styles.heroSection}>
                <Animated.View style={[styles.heroImageContainer, { opacity: fadeAnim }]}>
                    <Image
                        source={heroImages[currentImageIndex]} // 👈 Ahora usa require() directamente
                        style={styles.heroImage}
                        contentFit="cover"
                    />
                    {/* Gradient overlay para texto legible */}
                    <LinearGradient
                        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
                        style={styles.heroOverlay}
                    />
                </Animated.View>

                {/* HEADER CON GLASSMORPHISM */}
                <View style={styles.header}>
                    <BlurView intensity={30} style={styles.locationBadge}>
                        <Ionicons name="location" size={16} color="#fff" />
                        <Text style={styles.locationText}>San Luis, Argentina</Text>
                    </BlurView>

                    <TouchableOpacity
                        style={styles.skipButton}
                        onPress={goToHome}
                    >
                        <View style={styles.skipButtonContainer}>
                            <Text style={styles.skipText}>Saltar</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* CONTENIDO PRINCIPAL DEL HERO */}
                <View style={styles.heroContent}>
                    <Text style={styles.heroTitle}>Bienvenido a</Text>
                    <LinearGradient
                        colors={['#10b981', '#06b6d4']}
                        style={styles.heroTitleGradient}
                    >
                        <Text style={styles.heroTitleAccent}>Potrero de los Funes</Text>
                    </LinearGradient>

                    <Text style={styles.heroSubtitle}>
                        Descubrí paisajes increíbles, aguas cristalinas y aventuras inolvidables en la joya escondida de Argentina.
                    </Text>

                    {/* WEATHER WIDGET CON DATOS REALES */}
                    <View style={styles.weatherContainer}>
                        <BlurView intensity={20} style={styles.weatherWidget}>
                            {weather.loading ? (
                                <ActivityIndicator size="small" color="#fbbf24" />
                            ) : (
                                <Ionicons name="sunny" size={20} color="#fbbf24" />
                            )}
                            <Text style={styles.weatherText}>
                                {weather.loading ? '...' : `${weather.temperature}°C`}
                            </Text>
                        </BlurView>

                        <BlurView intensity={20} style={styles.weatherWidget}>
                            {weather.loading ? (
                                <ActivityIndicator size="small" color="#10b981" />
                            ) : (
                                <Ionicons name="leaf" size={20} color="#10b981" />
                            )}
                            <Text style={styles.weatherText}>
                                {weather.loading ? '...' : `${weather.windSpeed} km/h`}
                            </Text>
                        </BlurView>

                        <BlurView intensity={20} style={styles.weatherWidget}>
                            {weather.loading ? (
                                <ActivityIndicator size="small" color="#06b6d4" />
                            ) : (
                                <Ionicons name="water" size={20} color="#06b6d4" />
                            )}
                            <Text style={styles.weatherText}>
                                {weather.loading ? '...' : `${weather.humidity}%`}
                            </Text>
                        </BlurView>
                    </View>

                    {/* CTA BUTTON */}
                    <TouchableOpacity
                        style={styles.ctaButton}
                        onPress={goToHome}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#10b981', '#059669']}
                            style={styles.ctaGradient}
                        >
                            <Text style={styles.ctaText}>Comenzar Exploración</Text>
                            <Ionicons name="arrow-forward" size={20} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* INDICADORES DE IMAGEN */}
                <View style={styles.imageIndicators}>
                    {heroImages.map((_, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.indicator,
                                currentImageIndex === index && styles.indicatorActive
                            ]}
                            onPress={() => setCurrentImageIndex(index)}
                        />
                    ))}
                </View>

                {/* BOTTOM HINT */}
                <View style={styles.bottomHint}>
                    <BlurView intensity={20} style={styles.hintContainer}>
                        <Ionicons name="chevron-up" size={16} color="#fff" />
                        <Text style={styles.hintText}>Deslizá hacia arriba para continuar</Text>
                    </BlurView>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },

    // HERO SECTION STYLES
    heroSection: {
        height: height,
        position: 'relative',
    },
    heroImageContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },

    // HEADER STYLES
    header: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 30,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    locationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        overflow: 'hidden',
    },
    locationText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
    skipButton: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    skipButtonContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        borderRadius: 20,
    },

    skipText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },

    // HERO CONTENT STYLES
    heroContent: {
        position: 'absolute',
        bottom: 120,
        left: 20,
        right: 20,
        zIndex: 10,
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    heroTitleGradient: {
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
        marginBottom: 20,
    },
    heroTitleAccent: {
        fontSize: 28,
        fontWeight: '800',
        color: '#fff',
    },
    heroSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        lineHeight: 24,
        marginBottom: 24,
        maxWidth: width * 0.85,
    },

    // WEATHER WIDGET STYLES
    weatherContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 32,
    },
    weatherWidget: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        overflow: 'hidden',
    },
    weatherText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 6,
    },

    // CTA BUTTON STYLES
    ctaButton: {
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    ctaGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingVertical: 16,
        gap: 8,
    },
    ctaText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },

    // IMAGE INDICATORS STYLES
    imageIndicators: {
        position: 'absolute',
        bottom: 80,
        left: 20,
        flexDirection: 'row',
        gap: 8,
        zIndex: 10,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    indicatorActive: {
        backgroundColor: '#fff',
        width: 24,
    },

    // BOTTOM HINT STYLES
    bottomHint: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 10,
    },
    hintContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        overflow: 'hidden',
    },
    hintText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
        marginLeft: 6,
    },
});

export default WelcomeScreen;