// components/common/FavoriteToast.js - TOAST REUTILIZABLE PARA FAVORITOS
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const FavoriteToast = ({ 
  visible, 
  isAdded, 
  attractionName, 
  onHide,
  onUndo,
  duration = 3000 
}) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Mostrar el toast
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-hide después del tiempo especificado
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide && onHide();
    });
  };

  const handleUndo = () => {
    onUndo && onUndo();
    hideToast();
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <BlurView intensity={80} style={styles.blurContainer}>
        <LinearGradient
          colors={isAdded ? ['#ef4444', '#dc2626'] : ['#6b7280', '#4b5563']}
          style={styles.gradient}
        >
          {/* Icono y contenido principal */}
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Ionicons
                name={isAdded ? 'heart' : 'heart-dislike-outline'}
                size={20}
                color="#fff"
              />
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.mainText}>
                {isAdded ? '¡Agregado a favoritos!' : 'Quitado de favoritos'}
              </Text>
              {attractionName && (
                <Text style={styles.subText} numberOfLines={1}>
                  {attractionName}
                </Text>
              )}
            </View>

            {/* Botón de deshacer */}
            {onUndo && (
              <TouchableOpacity 
                style={styles.undoButton}
                onPress={handleUndo}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.undoText}>Deshacer</Text>
              </TouchableOpacity>
            )}

            {/* Botón de cerrar */}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={hideToast}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={18} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          </View>

          {/* Barra de progreso */}
          <Animated.View
            style={[
              styles.progressBar,
              {
                transform: [{
                  scaleX: opacityAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0],
                  })
                }]
              }
            ]}
          />
        </LinearGradient>
      </BlurView>
    </Animated.View>
  );
};

// Hook personalizado para manejar el toast más fácilmente
export const useFavoriteToast = () => {
  const [toastState, setToastState] = React.useState({
    visible: false,
    isAdded: false,
    attractionName: '',
    onUndo: null,
  });

  const showToast = (isAdded, attractionName, onUndo) => {
    setToastState({
      visible: true,
      isAdded,
      attractionName,
      onUndo,
    });
  };

  const hideToast = () => {
    setToastState(prev => ({ ...prev, visible: false }));
  };

  const ToastComponent = () => (
    <FavoriteToast
      visible={toastState.visible}
      isAdded={toastState.isAdded}
      attractionName={toastState.attractionName}
      onHide={hideToast}
      onUndo={toastState.onUndo}
    />
  );

  return {
    showToast,
    hideToast,
    ToastComponent,
  };
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60, // Debajo del header
    left: 20,
    right: 20,
    zIndex: 9999,
  },
  blurContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  gradient: {
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  mainText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  subText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  undoButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  undoText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
    transformOrigin: 'right',
  },
});

export default FavoriteToast;