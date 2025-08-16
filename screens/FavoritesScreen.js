// screens/FavoritesScreen.js - MEJORADO COMPLETO
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
  Alert,
  TextInput,
  Modal,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useFavorites } from '../contexts/FavoritesContext';

const { width, height } = Dimensions.get('window');

export default function FavoritesScreen({ navigation }) {
  const { favorites, toggleFavorite, clearAllFavorites } = useFavorites();
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const [searchText, setSearchText] = useState(''); // 👈 NUEVO: Estado del buscador
  const [selectedFavorite, setSelectedFavorite] = useState(null); // 👈 NUEVO: Estado del modal
  const [modalVisible, setModalVisible] = useState(false); // 👈 NUEVO: Estado del modal
  const scaleAnim = useRef(new Animated.Value(0)).current; // 👈 NUEVO: Animación del modal
  
  const stats = {
    total: favorites.length,
    categorias: favorites.reduce((acc, item) => {
      acc[item.categoria] = (acc[item.categoria] || 0) + 1;
      return acc;
    }, {}),
    recientes: favorites.filter(item => {
      const daysDiff = (new Date() - new Date(item.dateAdded)) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    }).length,
  };

  const filters = [
    { id: 'todos', label: 'Todos', count: stats.total },
    { id: 'montaña', label: 'Sierras', count: stats.categorias.montaña || 0 },
    { id: 'agua', label: 'Agua', count: stats.categorias.agua || 0 },
    { id: 'naturaleza', label: 'Naturaleza', count: stats.categorias.naturaleza || 0 },
  ];

  // 👈 NUEVO: Filtrado con búsqueda Y categoría
  const filteredFavorites = favorites.filter(item => {
    const matchesSearch = item.titulo.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.descripcion.toLowerCase().includes(searchText.toLowerCase());
    const matchesFilter = selectedFilter === 'todos' || item.categoria === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // 👈 NUEVO: Funciones para el modal
  const openModal = (favorite) => {
    setSelectedFavorite(favorite);
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
      setSelectedFavorite(null);
    });
  };

  const handleClearAll = () => {
    Alert.alert(
      'Limpiar favoritos',
      '¿Estás seguro de que querés eliminar todos tus favoritos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar todo', 
          style: 'destructive',
          onPress: () => clearAllFavorites()
        },
      ]
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

  const FavoriteCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.favoriteCard} 
      activeOpacity={0.9}
      onPress={() => openModal(item)} // 👈 NUEVO: Abre el modal al tocar
    >
      <View style={styles.cardImageContainer}>
        <Image
          source={{ uri: item.imagen }}
          style={styles.cardImage}
          contentFit="cover"
        />
        
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
          style={styles.cardImageOverlay}
        />
        
        {/* 👈 MEJORADO: Botón de favorito que NO abre el modal */}
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={(e) => {
            e.stopPropagation(); // 👈 Evita que se abra el modal
            toggleFavorite(item);
          }}
        >
          <BlurView intensity={40} style={styles.favoriteButtonBlur}>
            <Ionicons name="heart" size={18} color="#ef4444" />
          </BlurView>
        </TouchableOpacity>

        <BlurView intensity={40} style={styles.durationBadge}>
          <Ionicons name="time-outline" size={12} color="#fff" />
          <Text style={styles.durationText}>{item.duracion}</Text>
        </BlurView>
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
          
          <Text style={styles.dateAdded}>
            {new Date(item.dateAdded).toLocaleDateString('es-AR')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="heart-outline" size={80} color="#d1d5db" />
      </View>
      <Text style={styles.emptyTitle}>No tenés favoritos aún</Text>
      <Text style={styles.emptySubtitle}>
        Explorá los atractivos y tocá el ❤️ para guardar tus lugares preferidos
      </Text>
      <TouchableOpacity 
        style={styles.exploreButton}
        onPress={() => navigation.navigate('Attractives')}
      >
        <LinearGradient
          colors={['#10b981', '#059669']}
          style={styles.exploreButtonGradient}
        >
          <Ionicons name="compass-outline" size={20} color="#fff" />
          <Text style={styles.exploreButtonText}>Explorar atractivos</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#ef4444" />
      
      {/* HEADER */}
      <LinearGradient colors={['#ef4444', '#dc2626']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Favoritos</Text>
          
          {favorites.length > 0 && (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleClearAll}
            >
              <Ionicons name="trash-outline" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* 👈 NUEVO: BUSCADOR */}
        {favorites.length > 0 && (
          <BlurView intensity={20} style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#6b7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar en favoritos..."
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
        )}

        {/* STATS */}
        {favorites.length > 0 && (
          <View style={styles.statsContainer}>
            <BlurView intensity={20} style={styles.statsCard}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.total}</Text>
                <Text style={styles.statLabel}>Favoritos</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.recientes}</Text>
                <Text style={styles.statLabel}>Esta semana</Text>
              </View>
            </BlurView>
          </View>
        )}
      </LinearGradient>

      {/* FILTERS */}
      {favorites.length > 0 && (
        <>
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

          <View style={styles.resultsContainer}>
            <Text style={styles.resultsText}>
              {filteredFavorites.length} {filteredFavorites.length === 1 ? 'favorito' : 'favoritos'}
              {searchText.length > 0 && ' encontrados'}
            </Text>
            
            {/* 👈 NUEVO: Limpiar filtros */}
            {(selectedFilter !== 'todos' || searchText.length > 0) && (
              <TouchableOpacity 
                style={styles.clearFilter}
                onPress={() => {
                  setSelectedFilter('todos');
                  setSearchText('');
                }}
              >
                <Text style={styles.clearFilterText}>Limpiar</Text>
                <Ionicons name="close" size={14} color="#ef4444" />
              </TouchableOpacity>
            )}
          </View>
        </>
      )}

      {/* CONTENT */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.favoritesContainer}
      >
        {favorites.length === 0 ? (
          <EmptyState />
        ) : filteredFavorites.length > 0 ? (
          <View style={styles.favoritesGrid}>
            {filteredFavorites.map((item) => (
              <FavoriteCard key={item.id} item={item} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyFilter}>
            <Ionicons name="search-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyFilterTitle}>
              {searchText.length > 0 ? 'No se encontraron favoritos' : 'No hay favoritos en esta categoría'}
            </Text>
            <TouchableOpacity onPress={() => {
              setSelectedFilter('todos');
              setSearchText('');
            }}>
              <Text style={styles.emptyFilterButton}>
                {searchText.length > 0 ? 'Limpiar búsqueda' : 'Ver todos'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* 👈 NUEVO: MODAL COMPLETO */}
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
                {selectedFavorite && (
                  <>
                    {/* Modal Header */}
                    <View style={styles.modalHeader}>
                      <Image
                        source={{ uri: selectedFavorite.imagen }}
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

                      <TouchableOpacity 
                        style={styles.modalFavoriteButton}
                        onPress={() => toggleFavorite(selectedFavorite)}
                      >
                        <BlurView intensity={40} style={styles.modalFavoriteButtonBlur}>
                          <Ionicons name="heart" size={24} color="#ef4444" />
                        </BlurView>
                      </TouchableOpacity>
                      
                      <View style={styles.modalHeaderContent}>
                        <Text style={styles.modalTitle}>{selectedFavorite.titulo}</Text>
                        <View style={styles.modalBadges}>
                          <BlurView intensity={40} style={styles.modalBadge}>
                            <Ionicons name="time-outline" size={14} color="#fff" />
                            <Text style={styles.modalBadgeText}>{selectedFavorite.duracion}</Text>
                          </BlurView>
                          <BlurView intensity={40} style={[styles.modalBadge, { backgroundColor: getDifficultyColor(selectedFavorite.dificultad) + '80' }]}>
                            <Ionicons name="trending-up-outline" size={14} color="#fff" />
                            <Text style={styles.modalBadgeText}>{selectedFavorite.dificultad}</Text>
                          </BlurView>
                        </View>
                      </View>
                    </View>

                    {/* Modal Body */}
                    <ScrollView style={styles.modalBody}>
                      <Text style={styles.modalDescription}>
                        {selectedFavorite.descripcion}
                      </Text>
                      
                      <View style={styles.modalInfoGrid}>
                        <View style={styles.modalInfoItem}>
                          <View style={styles.modalInfoIcon}>
                            <Ionicons name="location-outline" size={20} color="#ef4444" />
                          </View>
                          <View style={styles.modalInfoText}>
                            <Text style={styles.modalInfoLabel}>Ubicación</Text>
                            <Text style={styles.modalInfoValue}>{selectedFavorite.ubicacion}</Text>
                          </View>
                        </View>
                        
                        <View style={styles.modalInfoItem}>
                          <View style={styles.modalInfoIcon}>
                            <Ionicons name="map-outline" size={20} color="#3b82f6" />
                          </View>
                          <View style={styles.modalInfoText}>
                            <Text style={styles.modalInfoLabel}>Cómo llegar</Text>
                            <Text style={styles.modalInfoValue}>{selectedFavorite.comoLlegar}</Text>
                          </View>
                        </View>

                        <View style={styles.modalInfoItem}>
                          <View style={styles.modalInfoIcon}>
                            <Ionicons name="heart-outline" size={20} color="#ef4444" />
                          </View>
                          <View style={styles.modalInfoText}>
                            <Text style={styles.modalInfoLabel}>Agregado a favoritos</Text>
                            <Text style={styles.modalInfoValue}>
                              {new Date(selectedFavorite.dateAdded).toLocaleDateString('es-AR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </ScrollView>

                    {/* Modal Footer */}
                    <View style={styles.modalFooter}>
                      <TouchableOpacity style={styles.modalActionButton}>
                        <LinearGradient
                          colors={['#ef4444', '#dc2626']}
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

      {/* 👈 NUEVO: BOTTOM NAVIGATION */}
      <View style={styles.bottomNav}>
        <BlurView intensity={100} style={styles.bottomNavBlur}>
          {[
            { icon: 'home', label: 'Inicio', key: 'home', route: 'Home' },
            { icon: 'compass', label: 'Explorar', key: 'explore', route: 'Attractives' },
            { icon: 'heart', label: 'Favoritos', key: 'favorites' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={styles.bottomNavItem}
              onPress={() => {
                if (tab.route) {
                  navigation.navigate(tab.route);
                } else {
                  // Esta es la pantalla actual (Favoritos)
                }
              }}
            >
              <Ionicons
                name={tab.key === 'favorites' ? tab.icon : `${tab.icon}-outline`}
                size={22}
                color={tab.key === 'favorites' ? '#ef4444' : '#6b7280'}
              />
              <Text
                style={[
                  styles.bottomNavLabel,
                  tab.key === 'favorites' && styles.bottomNavLabelActive,
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
  // 👈 NUEVO: Estilos del buscador
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
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  statsContainer: {
    alignItems: 'center',
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
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
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
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
    color: '#ef4444',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  favoritesContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  favoritesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  favoriteCard: {
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
    borderRadius: 16,
    overflow: 'hidden',
  },
  favoriteButtonBlur: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
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
  dateAdded: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
    marginBottom: 32,
  },
  exploreButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  exploreButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyFilter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyFilterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyFilterButton: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '600',
  },

  // 👈 NUEVO: Estilos del modal
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
    borderRadius: 20,
    overflow: 'hidden',
  },
  closeButtonBlur: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalFavoriteButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalFavoriteButtonBlur: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
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

  // 👈 NUEVO: BOTTOM NAVIGATION STYLES PARA FAVORITOS
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
    color: '#ef4444', // 👈 Color rojo para Favoritos
  },
});