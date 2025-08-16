// screens/HomeScreen.js - CON COLORES EXQUISITOS 2025
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';

// Nuestros componentes modulares
import HeroBanner from '../components/home/HeroBanner';
import SectionCard from '../components/home/SectionCard';
import InfoCard from '../components/home/InfoCard';

const HomeScreen = ({ navigation }) => {

  // DATOS CON GRADIENTES NUEVOS 🎨
  const mainSections = [
    {
      id: 1,
      title: 'Qué Visitar',
      subtitle: 'Atractivos',
      emoji: '🏔️',
      description: 'Lago, sierras y miradores',
      count: '12 lugares',
      image: require('../assets/images/attractions/atractivos.jpg'),
      gradient: Colors.sections.attractions.gradient, // ← NUEVO
      route: 'Attractives',
    },
    {
      id: 2,
      title: 'Actividades',
      subtitle: 'Aventura',
      emoji: '🚴‍♂️',
      description: 'Kayak, trekking y ciclismo',
      count: '8 deportes',
      image: require('../assets/images/activities/actividades.jpg'),
      gradient: Colors.sections.activities.gradient, // ← NUEVO
      route: 'Activities',
    },
    {
      id: 3,
      title: 'Alojamiento',
      subtitle: 'Dónde Dormir',
      emoji: '🏨',
      description: 'Cabañas, hoteles y apart',
      count: '25+ opciones',
      image: require('../assets/images/accommodation/alojamiento.jpg'),
      gradient: Colors.sections.accommodation.gradient, // ← NUEVO
      route: 'Accommodation',
    },
    {
      id: 4,
      title: 'Gastronomía',
      subtitle: 'Dónde Comer',
      emoji: '🍽️',
      description: 'Sabores de las sierras',
      count: '15 restaurantes',
      image: require('../assets/images/gastronomy/gastronomia.jpg'),
      gradient: Colors.sections.gastronomy.gradient, // ← NUEVO
      route: 'Gastronomy',
    },
  ];

  // INFO CON COLORES SUTILES 📊
  const infoData = [
    {
      icon: 'thermometer-outline',
      title: 'Clima Ideal',
      value: '15°C - 25°C',
      subtitle: 'Todo el año',
      color: Colors.status.info.accent, // ← NUEVO
      gradient: [Colors.status.info.bg, Colors.backgrounds.secondary], // ← NUEVO
    },
    {
      icon: 'car-outline',
      title: 'Distancia',
      value: '20 km',
      subtitle: 'De San Luis capital',
      color: Colors.status.success.accent, // ← NUEVO
      gradient: [Colors.status.success.bg, Colors.backgrounds.secondary], // ← NUEVO
    },
    {
      icon: 'water-outline',
      title: 'Lago',
      value: '91 hectáreas',
      subtitle: 'Deportes acuáticos',
      color: Colors.sections.activities.accent, // ← NUEVO
      gradient: [Colors.sections.activities.bg, Colors.backgrounds.secondary], // ← NUEVO
    },
    {
      icon: 'mountain-outline',
      title: 'Altura',
      value: '750 msnm',
      subtitle: 'Aire puro serrano',
      color: Colors.sections.attractions.accent, // ← NUEVO
      gradient: [Colors.sections.attractions.bg, Colors.backgrounds.secondary], // ← NUEVO
    },
  ];

  // MANEJAR NAVEGACIÓN 🧭
  const handleSectionPress = (section) => {
    if (section.route) {
      navigation.navigate(section.route);
    }
  };

  const handleInfoCardPress = (info) => {
    console.log('Info card pressed:', info.title);
  };

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={Colors.backgrounds.primary} 
        translucent={Platform.OS === 'android'} 
      />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* 🏔️ HERO BANNER */}
        <HeroBanner />

        {/* 🎯 SECCIONES PRINCIPALES */}
        <View style={styles.sectionsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explorá Potrero</Text>
            <Text style={styles.sectionSubtitle}>
              Todo lo que podés hacer en el valle más hermoso de San Luis
            </Text>
          </View>

          {/* Cards principales */}
          <View style={styles.cardsContainer}>
            {mainSections.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                onPress={handleSectionPress}
              />
            ))}
          </View>
        </View>

        {/* 📊 INFORMACIÓN ÚTIL */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Información Útil</Text>
          <Text style={styles.infoSubtitle}>
            Todo lo que necesitás saber sobre Potrero
          </Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.infoScrollContainer}
          >
            {infoData.map((info, index) => (
              <InfoCard
                key={index}
                info={info}
                onPress={handleInfoCardPress}
                style={[
                  styles.infoCard,
                  index === 0 && styles.firstInfoCard,
                  index === infoData.length - 1 && styles.lastInfoCard,
                ]}
              />
            ))}
          </ScrollView>
        </View>

        {/* 🚀 CALL TO ACTION */}
        <View style={styles.ctaSection}>
          <LinearGradient
            colors={Colors.gradients.elegant} // ← NUEVO: Sutil
            style={styles.ctaGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.ctaTitle}>¿Listo para la aventura?</Text>
            <Text style={styles.ctaSubtitle}>
              Descubrí todos los secretos que Potrero de los Funes tiene para vos
            </Text>
            
            <SectionCard
              section={{
                title: 'Empezar Ahora',
                subtitle: 'Ver Todo',
                emoji: '🎯',
                description: 'Explorá todos los atractivos',
                gradient: Colors.sections.attractions.gradient, // ← NUEVO
                route: 'Attractives'
              }}
              onPress={handleSectionPress}
              style={styles.ctaCard}
            />
          </LinearGradient>
        </View>

        {/* 💙 FOOTER CON AMOR */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Hecho con 💙 para los amantes de la naturaleza
          </Text>
          <Text style={styles.footerSubtext}>
            Potrero de los Funes • San Luis • Argentina
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgrounds.primary,
  },
  scrollView: {
    flex: 1,
  },

  // SECTIONS STYLES 🎯
  sectionsContainer: {
    paddingTop: 32,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    marginBottom: 24,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -1,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  cardsContainer: {
    gap: 0,
  },

  // INFO SECTION STYLES 📊
  infoSection: {
    paddingTop: 40,
    paddingBottom: 20,
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  infoSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  infoScrollContainer: {
    paddingHorizontal: 20,
  },
  infoCard: {
    marginRight: 16,
  },
  firstInfoCard: {
    marginLeft: 0,
  },
  lastInfoCard: {
    marginRight: 20,
  },

  // CTA SECTION STYLES 🚀
  ctaSection: {
    margin: 20,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: Colors.shadows.lg,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: Colors.borders.light,
  },
  ctaGradient: {
    padding: 24,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text.primary, // ← Cambió a texto oscuro
    textAlign: 'center',
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: Colors.text.secondary, // ← Cambió a texto oscuro
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  ctaCard: {
    width: '100%',
    height: 100,
  },

  // FOOTER STYLES 💙
  footer: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: Colors.backgrounds.secondary,
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  footerSubtext: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});

export default HomeScreen;