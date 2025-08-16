// screens/HomeScreen.js - HOME REAL CON CLIMA INTEGRADO
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('home');
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


    useEffect(() => {
        fetchWeather();
    }, []);


    // DATOS DE SECCIONES PRINCIPALES
    const mainSections = [
        {
            id: 'attractions',
            title: 'Atractivos',
            subtitle: 'Lugares únicos',
            description: 'Lago, sierras y miradores',
            count: '12 lugares',
            image: require('../assets/images/attractions/atractivos.jpg'), // 👈 Imagen real
            gradient: ['rgba(16,185,129,0.7)', 'rgba(5,150,105,0.8)'], // 👈 Más transparente
            icon: 'compass-outline',
            route: 'Attractives',
        },
        {
            id: 'accommodation',
            title: 'Alojamiento',
            subtitle: 'Dónde dormir',
            description: 'Cabañas, hoteles y apart',
            count: '25+ opciones',
            image: require('../assets/images/accommodation/alojamiento.jpg'), // 👈 Imagen real
            gradient: ['rgba(59,130,246,0.7)', 'rgba(30,64,175,0.8)'], // 👈 Más transparente
            icon: 'home-outline',
            route: 'Accommodation',
        },
        {
            id: 'gastronomy',
            title: 'Gastronomía',
            subtitle: 'Dónde comer',
            description: 'Sabores de las sierras',
            count: '15 restaurantes',
            image: require('../assets/images/gastronomy/gastronomia.jpg'), // 👈 Imagen real
            gradient: ['rgba(139,92,246,0.7)', 'rgba(124,58,237,0.8)'], // 👈 Más transparente
            icon: 'restaurant-outline',
            route: 'Gastronomy',
        },
        {
            id: 'activities',
            title: 'Actividades',
            subtitle: 'Aventura',
            description: 'Kayak, trekking y ciclismo',
            count: '8 deportes',
            image: require('../assets/images/activities/actividades.jpg'), // 👈 Imagen real
            gradient: ['rgba(245,158,11,0.7)', 'rgba(217,119,6,0.8)'], // 👈 Más transparente
            icon: 'bicycle-outline',
            route: 'Activities',
        },
    ];

    // DATOS RÁPIDOS/INFO
    const quickInfo = [
        {
            icon: 'thermometer-outline',
            title: 'Clima',
            value: '22°C',
            subtitle: 'Perfecto',
            color: '#fbbf24',
        },
        {
            icon: 'car-outline',
            title: 'Distancia',
            value: '20 km',
            subtitle: 'De San Luis',
            color: '#10b981',
        },
        {
            icon: 'water-outline',
            title: 'Lago',
            value: '91 ha',
            subtitle: 'Deportes acuáticos',
            color: '#06b6d4',
        },
        {
            icon: 'people-outline',
            title: 'Visitantes',
            value: '50k+',
            subtitle: 'Por año',
            color: '#8b5cf6',
        },
    ];

    const handleSectionPress = (section) => {
        if (section.route) {
            navigation.navigate(section.route);
        }
    };

    const SectionCard = ({ section }) => (
        <TouchableOpacity
            style={styles.sectionCard}
            onPress={() => handleSectionPress(section)}
            activeOpacity={0.85}
        >
            <Image
                source={section.image}
                style={styles.sectionImage}
                contentFit="cover"
            />

            {/* Overlay MUY sutil solo para legibilidad */}
            <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.6)']} // 👈 Solo gradiente negro sutil
                style={styles.sectionOverlay}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            />

            {/* Content en la parte inferior */}
            <View style={styles.sectionContent}>
                {/* Badge flotante con glassmorphism */}
                <View style={styles.sectionBadgeContainer}>
                    <BlurView intensity={40} style={styles.sectionBadge}>
                        <Ionicons name={section.icon} size={16} color="#fff" />
                        <Text style={styles.sectionCount}>{section.count}</Text>
                    </BlurView>
                </View>

                <View style={styles.sectionTextContainer}>
                    <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    <Text style={styles.sectionDescription}>{section.description}</Text>
                </View>

                <TouchableOpacity style={styles.sectionArrow}>
                    <BlurView intensity={30} style={styles.sectionArrowBlur}>
                        <Ionicons name="chevron-forward" size={18} color="#fff" />
                    </BlurView>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    const QuickInfoCard = ({ info }) => (
        <View style={styles.infoCard}>
            <View style={[styles.infoIcon, { backgroundColor: info.color }]}>
                {info.loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Ionicons name={info.icon} size={20} color="#fff" />
                )}
            </View>
            <Text style={styles.infoTitle}>{info.title}</Text>
            <Text style={[styles.infoValue, { color: info.color }]}>{info.value}</Text>
            <Text style={styles.infoSubtitle}>{info.subtitle}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* HEADER */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View style={styles.locationContainer}>
                        <Ionicons name="location" size={16} color="#10b981" />
                        <Text style={styles.locationText}>Potrero de los Funes</Text>
                    </View>

                    <View style={styles.headerActions}>
                        <TouchableOpacity style={styles.headerButton}>
                            <Ionicons name="search-outline" size={22} color="#1f2937" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.headerButton}>
                            <Ionicons name="notifications-outline" size={22} color="#1f2937" />
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.welcomeText}>¡Hola! 👋</Text>
                <Text style={styles.headerTitle}>¿Qué querés explorar hoy?</Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* QUICK INFO CARDS CON CLIMA REAL */}
                <View style={styles.quickInfoSection}>
                    <View style={styles.infoSectionHeader}>
                        <Text style={styles.sectionHeaderTitle}>Información útil</Text>
                        {weather.error && (
                            <TouchableOpacity
                                style={styles.refreshButton}
                                onPress={fetchWeather}
                            >
                                <Ionicons name="refresh" size={16} color="#6b7280" />
                            </TouchableOpacity>
                        )}
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.quickInfoScroll}
                    >
                        {quickInfo.map((info, index) => (
                            <QuickInfoCard key={index} info={info} />
                        ))}
                    </ScrollView>
                </View>

                {/* MAIN SECTIONS */}
                <View style={styles.mainSectionsContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionHeaderTitle}>Explorá Potrero</Text>
                        <Text style={styles.sectionHeaderSubtitle}>
                            Descubrí todo lo que este lugar mágico tiene para ofrecerte
                        </Text>
                    </View>

                    <View style={styles.sectionsGrid}>
                        {mainSections.map((section) => (
                            <SectionCard key={section.id} section={section} />
                        ))}
                    </View>
                </View>

                {/* FEATURED SECTION */}
                <View style={styles.featuredSection}>
                    <Text style={styles.sectionHeaderTitle}>Destacado</Text>
                    <TouchableOpacity style={styles.featuredCard} activeOpacity={0.9}>
                        <Image
                            source={require('../assets/images/attractions/salto-moneda.jpg')} // 👈 Imagen real
                            style={styles.featuredImage}
                            contentFit="cover"
                        />
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.8)']}
                            style={styles.featuredOverlay}
                        />
                        <View style={styles.featuredContent}>
                            <View style={styles.featuredBadge}>
                                <Text style={styles.featuredBadgeText}>Recomendado</Text>
                            </View>
                            <Text style={styles.featuredTitle}>Salto de la Moneda</Text>
                            <Text style={styles.featuredSubtitle}>
                                Cascada de 10 metros con piscina natural perfecta para refrescarse
                            </Text>
                            <View style={styles.featuredMeta}>
                                <View style={styles.featuredMetaItem}>
                                    <Ionicons name="time-outline" size={14} color="#fff" />
                                    <Text style={styles.featuredMetaText}>2-3 horas</Text>
                                </View>
                                <View style={styles.featuredMetaItem}>
                                    <Ionicons name="star" size={14} color="#fbbf24" />
                                    <Text style={styles.featuredMetaText}>4.8</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* BOTTOM PADDING */}
                <View style={styles.bottomPadding} />
            </ScrollView>

            {/* BOTTOM NAVIGATION */}
            <View style={styles.bottomNav}>
                <BlurView intensity={100} style={styles.bottomNavBlur}>
                    {[
                        { icon: 'home', label: 'Inicio', key: 'home' },
                        { icon: 'compass', label: 'Explorar', key: 'explore' },
                        { icon: 'heart', label: 'Favoritos', key: 'favorites' },
                        { icon: 'person', label: 'Perfil', key: 'profile' },
                    ].map((tab) => (
                        <TouchableOpacity
                            key={tab.key}
                            style={styles.bottomNavItem}
                            onPress={() => setActiveTab(tab.key)}
                        >
                            <Ionicons
                                name={activeTab === tab.key ? tab.icon : `${tab.icon}-outline`}
                                size={22}
                                color={activeTab === tab.key ? '#10b981' : '#6b7280'}
                            />
                            <Text
                                style={[
                                    styles.bottomNavLabel,
                                    activeTab === tab.key && styles.bottomNavLabelActive,
                                ]}
                            >
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </BlurView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    // HEADER STYLES
    header: {
        paddingTop: Platform.OS === 'ios' ? 50 : 30,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#fff',
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0fdf4',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    locationText: {
        color: '#16a34a',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 12,
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 16,
        color: '#6b7280',
        marginBottom: 4,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1f2937',
    },

    // SCROLL STYLES
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },

    // QUICK INFO STYLES - CON SOPORTE PARA CLIMA
    quickInfoSection: {
        paddingVertical: 20,
    },
    infoSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    refreshButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionHeaderTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 16,
        paddingHorizontal: 20,
    },
    sectionHeaderSubtitle: {
        fontSize: 14,
        color: '#6b7280',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    quickInfoScroll: {
        paddingHorizontal: 20,
    },
    infoCard: {
        width: 120,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginRight: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    infoIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoTitle: {
        fontSize: 11,
        fontWeight: '600',
        color: '#6b7280',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 2,
    },
    infoSubtitle: {
        fontSize: 10,
        color: '#9ca3af',
    },

    // MAIN SECTIONS STYLES - DISEÑO MINIMALISTA
    mainSectionsContainer: {
        paddingVertical: 20,
    },
    sectionHeader: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sectionsGrid: {
        paddingHorizontal: 20,
        gap: 20, // 👈 Más espacio entre cards
    },
    sectionCard: {
        height: 160, // 👈 Más alto para mostrar mejor las imágenes
        borderRadius: 24, // 👈 Bordes más redondeados
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 12,
        marginBottom: 0,
    },
    sectionImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    sectionOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    sectionContent: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 20,
        position: 'relative',
    },

    // NUEVO DISEÑO DE BADGES
    sectionBadgeContainer: {
        alignSelf: 'flex-start',
    },
    sectionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        overflow: 'hidden',
        gap: 6,
    },
    sectionCount: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '600',
    },

    // TEXTO EN LA PARTE INFERIOR
    sectionTextContainer: {
        marginTop: 'auto', // 👈 Empuja el texto hacia abajo
    },
    sectionSubtitle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 4,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    sectionTitle: {
        fontSize: 22, // 👈 Más grande
        fontWeight: '800',
        color: '#fff',
        marginBottom: 4,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    sectionDescription: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '500',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },

    // FLECHA CON GLASSMORPHISM
    sectionArrow: {
        position: 'absolute',
        top: 20,
        right: 20,
        borderRadius: 20,
        overflow: 'hidden',
    },
    sectionArrowBlur: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },

    // FEATURED SECTION STYLES
    featuredSection: {
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    featuredCard: {
        height: 200,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 12,
    },
    featuredImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    featuredOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    featuredContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
    },
    featuredBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#10b981',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginBottom: 12,
    },
    featuredBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    featuredTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 8,
    },
    featuredSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        lineHeight: 20,
        marginBottom: 12,
    },
    featuredMeta: {
        flexDirection: 'row',
        gap: 16,
    },
    featuredMetaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    featuredMetaText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },

    // BOTTOM NAVIGATION STYLES
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    bottomNavBlur: {
        flexDirection: 'row',
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 28 : 16,
        paddingHorizontal: 20,
    },
    bottomNavItem: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    bottomNavLabel: {
        fontSize: 11,
        fontWeight: '500',
        color: '#6b7280',
    },
    bottomNavLabelActive: {
        color: '#10b981',
    },

    // UTILS
    bottomPadding: {
        height: 40,
    },
});

export default HomeScreen;