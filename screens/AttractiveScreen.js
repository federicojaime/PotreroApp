// screens/AttractiveScreen.js - CON FAVORITE TOAST INTEGRADO
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Modal,
  Animated,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { attractivesData } from '../data/attractivesData';
import { useFavorites } from '../contexts/FavoritesContext';
import { useFavoriteToast } from '../components/common/FavoriteToast'; // 👈 IMPORTAR EL TOAST

const { width, height } = Dimensions.get('window');

export default function AttractiveScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const [selectedAttractive, setSelectedAttractive] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const { toggleFavorite, isFavorite } = useFavorites();
  const { showToast, ToastComponent } = useFavoriteToast(); // 👈 USAR EL HOOK DEL TOAST

  const filters = [
    { id: 'todos', label: 'Todos', icon: 'grid-outline', count: attractivesData.length },
    { id: 'montaña', label: 'Sierras', icon: 'triangle-outline', count: attractivesData.filter(item => item.categoria === 'montaña').length },
    { id: 'agua', label: 'Agua', icon: 'water-outline', count: attractivesData.filter(item => item.categoria === 'agua').length },
    { id: 'naturaleza', label: 'Naturaleza', icon: 'leaf-outline', count: attractivesData.filter(item => item.categoria === 'naturaleza').length },
  ];

  const filteredAttractions = attractivesData.filter(item => {
    const matchesSearch = item.titulo.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.descripcion.toLowerCase().includes(searchText.toLowerCase());
    const matchesFilter = selectedFilter === 'todos' || item.categoria === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const openModal = (attractive) => {
    setSelectedAttractive(attractive);
    setModalVisible(true);
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSelectedAttractive(null);
    });
  };

  // 🎯 FUNCIÓN MEJORADA PARA MANEJAR FAVORITOS CON TOAST
  const handleToggleFavorite = async (item) => {
    const wasAdded = !isFavorite(item.id);
    
    // Ejecutar la acción de favorito
    await toggleFavorite(item);
    
    // Mostrar el toast con opción de deshacer
    showToast(
      wasAdded, 
      item.titulo,
      () => {
        // Función de deshacer
        toggleFavorite(item);
      }
    );
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Baja': return '#10b981';
      case 'Media': return '#f59e0b';
      case 'Alta': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getDifficultyBg = (difficulty) => {
    switch (difficulty) {
      case 'Baja': return '#dcfce7';
      case 'Media': return '#fef3c7';
      case 'Alta': return '#fee2e2';
      default: return '#f3f4f6';
    }
  };

  const AttractionCard = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.attractionCard}
        onPress={() => openModal(item)}
        activeOpacity={0.9}
      >
        <View style={styles.cardImageContainer}>
          <Image
            source={{ uri: item.imagen }}
            style={styles.cardImage}
            contentFit="cover"
          />
          
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
            style={styles.cardImageOverlay}
          />
          
          {/* 🎯 BOTÓN DE FAVORITO MEJORADO CON TOAST */}
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={(e) => {
              e.stopPropagation();
              handleToggleFavorite(item); // 👈 USAR LA NUEVA FUNCIÓN
            }}
          >
            <View style={styles.favoriteButtonContainer}>
              <Ionicons 
                name={isFavorite(item.id) ? "heart" : "heart-outline"} 
                size={18} 
                color={isFavorite(item.id) ? "#ef4444" : "#fff"} 
              />
            </View>
          </TouchableOpacity>

          <BlurView intensity={40} style={styles.durationBadge}>
            <Ionicons name="time-outline" size={12} color="#fff" />
            <Text style={styles.durationText}>{item.duracion}</Text>
          </BlurView>

          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.categoria) }]}>
            <Ionicons name={getCategoryIcon(item.categoria)} size={14} color="#fff" />
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle} numberOfLines={2}>{item.titulo}</Text>
            <View style={[
              styles.difficultyBadge, 
              { 
                backgroundColor: getDifficultyBg(item.dificultad),
                borderColor: getDifficultyColor(item.dificultad)
              }
            ]}>
              <Text style={[styles.difficultyText, { color: getDifficultyColor(item.dificultad) }]}>
                {item.dificultad}
              </Text>
            </View>
          </View>

          <Text style={styles.cardDescription} numberOfLines={3}>
            {item.descripcion}
          </Text>

          <View style={styles.cardFooter}>
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={14} color="#6b7280" />
              <Text style={styles.locationText} numberOfLines={1}>
                {item.ubicacion}
              </Text>
            </View>
            
            <TouchableOpacity style={styles.viewButton}>
              <Ionicons name="arrow-forward" size={16} color="#10b981" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'montaña': return '#8b5cf6';
      case 'agua': return '#06b6d4';
      case 'naturaleza': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'montaña': return 'triangle';
      case 'agua': return 'water';
      case 'naturaleza': return 'leaf';
      default: return 'location';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#10b981" />
      
      {/* 🎯 TOAST COMPONENT - SE RENDERIZA PRIMERO PARA QUE ESTÉ ENCIMA */}
      <ToastComponent />
      
      {/* HEADER MODERNO */}
      <LinearGradient
        colors={['#10b981', '#059669']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Atractivos</Text>
          
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="map-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* SEARCH BAR MODERNO */}
        <BlurView intensity={20} style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar atractivos..."
            placeholderTextColor="#9ca3af"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </BlurView>
      </LinearGradient>

      {/* FILTERS MEJORADOS */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filtersRow}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterChip,
                  selectedFilter === filter.id && styles.filterChipActive
                ]}
                onPress={() => setSelectedFilter(filter.id)}
              >
                <Ionicons 
                  name={filter.icon} 
                  size={16} 
                  color={selectedFilter === filter.id ? '#fff' : '#6b7280'} 
                />
                <Text style={[
                  styles.filterText,
                  selectedFilter === filter.id && styles.filterTextActive
                ]}>
                  {filter.label}
                </Text>
                <View style={[
                  styles.filterCount,
                  selectedFilter === filter.id && styles.filterCountActive
                ]}>
                  <Text style={[
                    styles.filterCountText,
                    selectedFilter === filter.id && styles.filterCountTextActive
                  ]}>
                    {filter.count}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* RESULTS COUNT */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredAttractions.length} {filteredAttractions.length === 1 ? 'atractivo encontrado' : 'atractivos encontrados'}
        </Text>
        
        {selectedFilter !== 'todos' && (
          <TouchableOpacity 
            style={styles.clearFilter}
            onPress={() => setSelectedFilter('todos')}
          >
            <Text style={styles.clearFilterText}>Limpiar filtro</Text>
            <Ionicons name="close" size={14} color="#10b981" />
          </TouchableOpacity>
        )}
      </View>

      {/* ATTRACTIONS GRID MEJORADO */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.attractionsContainer}
      >
        {filteredAttractions.length > 0 ? (
          <View style={styles.attractionsGrid}>
            {filteredAttractions.map((item, index) => (
              <AttractionCard key={item.id} item={item} index={index} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No se encontraron atractivos</Text>
            <Text style={styles.emptySubtitle}>
              Prueba con una búsqueda diferente o cambia el filtro
            </Text>
          </View>
        )}
      </ScrollView>

      {/* MODAL MEJORADO */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <BlurView intensity={50} style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackground}
            activeOpacity={1}
            onPress={closeModal}
          >
            <Animated.View
              style={[
                styles.modalContent,
                { transform: [{ scale: scaleAnim }] }
              ]}
            >
              <TouchableOpacity activeOpacity={1}>
                {selectedAttractive && (
                  <>
                    {/* Modal Header */}
                    <View style={styles.modalHeader}>
                      <Image
                        source={{ uri: selectedAttractive.imagen }}
                        style={styles.modalImage}
                        contentFit="cover"
                      />
                      <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                        style={styles.modalImageOverlay}
                      />
                      <TouchableOpacity 
                        style={styles.closeButton}
                        onPress={closeModal}
                      >
                        <BlurView intensity={40} style={styles.closeButtonBlur}>
                          <Ionicons name="close" size={24} color="#fff" />
                        </BlurView>
                      </TouchableOpacity>

                      {/* 🎯 BOTÓN DE FAVORITO EN MODAL CON TOAST */}
                      <TouchableOpacity 
                        style={styles.modalFavoriteButton}
                        onPress={() => handleToggleFavorite(selectedAttractive)} // 👈 USAR LA NUEVA FUNCIÓN
                      >
                        <View style={styles.modalFavoriteButtonContainer}>
                          <Ionicons 
                            name={isFavorite(selectedAttractive.id) ? "heart" : "heart-outline"} 
                            size={24} 
                            color={isFavorite(selectedAttractive.id) ? "#ef4444" : "#fff"} 
                          />
                        </View>
                      </TouchableOpacity>
                      
                      <View style={styles.modalHeaderContent}>
                        <Text style={styles.modalTitle}>{selectedAttractive.titulo}</Text>
                        <View style={styles.modalBadges}>
                          <BlurView intensity={40} style={styles.modalBadge}>
                            <Ionicons name="time-outline" size={14} color="#fff" />
                            <Text style={styles.modalBadgeText}>{selectedAttractive.duracion}</Text>
                          </BlurView>
                          <BlurView intensity={40} style={[styles.modalBadge, { backgroundColor: getDifficultyColor(selectedAttractive.dificultad) + '80' }]}>
                            <Ionicons name="trending-up-outline" size={14} color="#fff" />
                            <Text style={styles.modalBadgeText}>{selectedAttractive.dificultad}</Text>
                          </BlurView>
                        </View>
                      </View>
                    </View>

                    {/* Modal Body */}
                    <ScrollView style={styles.modalBody}>
                      <Text style={styles.modalDescription}>
                        {selectedAttractive.descripcion}
                      </Text>
                      
                      <View style={styles.modalInfoGrid}>
                        <View style={styles.modalInfoItem}>
                          <View style={styles.modalInfoIcon}>
                            <Ionicons name="location-outline" size={20} color="#10b981" />
                          </View>
                          <View style={styles.modalInfoText}>
                            <Text style={styles.modalInfoLabel}>Ubicación</Text>
                            <Text style={styles.modalInfoValue}>{selectedAttractive.ubicacion}</Text>
                          </View>
                        </View>
                        
                        <View style={styles.modalInfoItem}>
                          <View style={styles.modalInfoIcon}>
                            <Ionicons name="map-outline" size={20} color="#3b82f6" />
                          </View>
                          <View style={styles.modalInfoText}>
                            <Text style={styles.modalInfoLabel}>Cómo llegar</Text>
                            <Text style={styles.modalInfoValue}>{selectedAttractive.comoLlegar}</Text>
                          </View>
                        </View>
                      </View>
                    </ScrollView>

                    {/* Modal Footer */}
                    <View style={styles.modalFooter}>
                      <TouchableOpacity style={styles.modalActionButton}>
                        <LinearGradient
                          colors={['#10b981', '#059669']}
                          style={styles.modalActionGradient}
                        >
                          <Ionicons name="navigate-outline" size={20} color="#fff" />
                          <Text style={styles.modalActionText}>Cómo llegar</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        </BlurView>
      </Modal>

      {/* BOTTOM NAVIGATION */}
      <View style={styles.bottomNav}>
        <BlurView intensity={100} style={styles.bottomNavBlur}>
          {[
            { icon: 'home', label: 'Inicio', key: 'home', route: 'Home' },
            { icon: 'compass', label: 'Explorar', key: 'explore' },
            { icon: 'heart', label: 'Favoritos', key: 'favorites', route: 'Favorites' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={styles.bottomNavItem}
              onPress={() => {
                if (tab.route) {
                  navigation.navigate(tab.route);
                }
              }}
            >
              <Ionicons
                name={tab.key === 'explore' ? tab.icon : `${tab.icon}-outline`}
                size={22}
                color={tab.key === 'explore' ? '#10b981' : '#6b7280'}
              />
              <Text
                style={[
                  styles.bottomNavLabel,
                  tab.key === 'explore' && styles.bottomNavLabelActive,
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
}

// Los estilos se mantienen exactamente iguales...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  filtersContainer: {
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  filterTextActive: {
    color: '#fff',
  },
  filterCount: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  filterCountActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  filterCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6b7280',
  },
  filterCountTextActive: {
    color: '#fff',
  },
  resultsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  resultsText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  clearFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearFilterText: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  attractionsContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  attractionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  attractionCard: {
    width: (width - 52) / 2,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  cardImageContainer: {
    height: 140,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  favoriteButtonContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  durationBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    overflow: 'hidden',
  },
  durationText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginRight: 8,
    lineHeight: 20,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
    marginBottom: 12,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  viewButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: height * 0.85,
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
  },
  modalHeader: {
    height: 200,
    position: 'relative',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  closeButtonBlur: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  modalFavoriteButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  modalFavoriteButtonContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  modalHeaderContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  modalBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  modalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    overflow: 'hidden',
  },
  modalBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  modalBody: {
    padding: 24,
    maxHeight: 300,
  },
  modalDescription: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 24,
  },
  modalInfoGrid: {
    gap: 16,
  },
  modalInfoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  modalInfoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalInfoText: {
    flex: 1,
  },
  modalInfoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  modalInfoValue: {
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 20,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  modalActionButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  modalActionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
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
});