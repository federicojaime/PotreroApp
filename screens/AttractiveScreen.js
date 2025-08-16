// screens/AttractiveScreen.js
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { attractivesData } from '../data/attractivesData';

const { width, height } = Dimensions.get('window');

export default function AttractiveScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const [selectedAttractive, setSelectedAttractive] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const filters = [
    { id: 'todos', label: 'Todos', icon: 'grid-outline' },
    { id: 'montaña', label: 'Montaña', icon: 'mountain-outline' },
    { id: 'agua', label: 'Agua', icon: 'water-outline' },
    { id: 'naturaleza', label: 'Naturaleza', icon: 'leaf-outline' },
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

  const AttractionCard = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={[styles.attractionCard, { marginTop: index % 2 === 1 ? 20 : 0 }]}
        onPress={() => openModal(item)}
        activeOpacity={0.9}
      >
        <View style={styles.cardImageContainer}>
          <Image
            source={item.imagen}
            style={styles.cardImage}
            contentFit="cover"
          />
          
          {/* Gradient overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.cardImageOverlay}
          />
          
          {/* Duration badge */}
          <BlurView intensity={30} style={styles.durationBadge}>
            <Ionicons name="time-outline" size={12} color="#fff" />
            <Text style={styles.durationText}>{item.duracion}</Text>
          </BlurView>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle} numberOfLines={2}>{item.titulo}</Text>
            <View style={[styles.difficultyBadge, 
              item.dificultad === 'Alta' && styles.difficultyHigh,
              item.dificultad === 'Media' && styles.difficultyMedium,
              item.dificultad === 'Baja' && styles.difficultyLow
            ]}>
              <Text style={styles.difficultyText}>{item.dificultad}</Text>
            </View>
          </View>

          <Text style={styles.cardDescription} numberOfLines={3}>
            {item.descripcion}
          </Text>

          <View style={styles.cardFooter}>
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={14} color="#64748b" />
              <Text style={styles.locationText} numberOfLines={1}>
                {item.ubicacion}
              </Text>
            </View>
            
            <TouchableOpacity style={styles.viewButton}>
              <Ionicons name="arrow-forward" size={16} color="#3b82f6" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00add5" />
      
      {/* Header con search */}
      <LinearGradient
        colors={['#00add5', '#0ea5e9']}
        style={styles.header}
      >
        <BlurView intensity={20} style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar atractivos..."
            placeholderTextColor="#94a3b8"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={20} color="#64748b" />
            </TouchableOpacity>
          )}
        </BlurView>
      </LinearGradient>

      {/* Filters */}
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
                  color={selectedFilter === filter.id ? '#fff' : '#64748b'} 
                />
                <Text style={[
                  styles.filterText,
                  selectedFilter === filter.id && styles.filterTextActive
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Results count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredAttractions.length} atractivos encontrados
        </Text>
      </View>

      {/* Attractions Grid */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.attractionsContainer}
      >
        <View style={styles.attractionsGrid}>
          {filteredAttractions.map((item, index) => (
            <AttractionCard key={item.id} item={item} index={index} />
          ))}
        </View>
      </ScrollView>

      {/* Modal de detalle */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <BlurView intensity={40} style={styles.modalOverlay}>
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
                        source={selectedAttractive.imagen}
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
                        <BlurView intensity={30} style={styles.closeButtonBlur}>
                          <Ionicons name="close" size={24} color="#fff" />
                        </BlurView>
                      </TouchableOpacity>
                      
                      <View style={styles.modalHeaderContent}>
                        <Text style={styles.modalTitle}>{selectedAttractive.titulo}</Text>
                        <View style={styles.modalBadges}>
                          <BlurView intensity={30} style={styles.modalBadge}>
                            <Ionicons name="time-outline" size={14} color="#fff" />
                            <Text style={styles.modalBadgeText}>{selectedAttractive.duracion}</Text>
                          </BlurView>
                          <BlurView intensity={30} style={styles.modalBadge}>
                            <Ionicons name="location-outline" size={14} color="#fff" />
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
                          <Ionicons name="location-outline" size={20} color="#3b82f6" />
                          <View style={styles.modalInfoText}>
                            <Text style={styles.modalInfoLabel}>Ubicación</Text>
                            <Text style={styles.modalInfoValue}>{selectedAttractive.ubicacion}</Text>
                          </View>
                        </View>
                        
                        <View style={styles.modalInfoItem}>
                          <Ionicons name="map-outline" size={20} color="#10b981" />
                          <View style={styles.modalInfoText}>
                            <Text style={styles.modalInfoLabel}>Cómo llegar</Text>
                            <Text style={styles.modalInfoValue}>{selectedAttractive.comoLlegar}</Text>
                          </View>
                        </View>
                      </View>
                    </ScrollView>
                  </>
                )}
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        </BlurView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  // Header Styles
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },

  // Filters Styles
  filtersContainer: {
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
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
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  filterTextActive: {
    color: '#fff',
  },

  // Results Styles
  resultsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  resultsText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },

  // Attractions Grid Styles
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
    gap: 16,
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
    fontWeight: '600',
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
    fontWeight: '700',
    color: '#1e293b',
    marginRight: 8,
    lineHeight: 20,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
  },
  difficultyHigh: { backgroundColor: '#fee2e2' },
  difficultyMedium: { backgroundColor: '#fef3c7' },
  difficultyLow: { backgroundColor: '#dcfce7' },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
  },
  cardDescription: {
    fontSize: 13,
    color: '#64748b',
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
    color: '#64748b',
    fontWeight: '500',
  },
  viewButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Modal Styles
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
    maxHeight: height * 0.8,
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
    color: '#475569',
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
  modalInfoText: {
    flex: 1,
  },
  modalInfoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 4,
  },
  modalInfoValue: {
    fontSize: 14,
    color: '#1e293b',
    lineHeight: 20,
  },
});