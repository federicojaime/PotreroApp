// src/components/home/InfoCard.js
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

const { width } = Dimensions.get('window');

const InfoCard = ({ info, onPress, style }) => {
    return (
        <TouchableOpacity
            style={[styles.container, style]}
            onPress={() => onPress && onPress(info)}
            activeOpacity={0.8}
        >
            {/* Fondo con gradiente suave */}
            <LinearGradient
                colors={info.gradient || ['#ffffff', '#f8fafc']}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {/* Icono principal */}
                <View style={[styles.iconContainer, { backgroundColor: info.color }]}>
                    <Ionicons
                        name={info.icon}
                        size={24}
                        color={Colors.text.white}
                    />
                </View>

                {/* Contenido */}
                <View style={styles.content}>
                    <Text style={styles.title}>{info.title}</Text>
                    <Text style={[styles.value, { color: info.color }]}>{info.value}</Text>
                    <Text style={styles.subtitle}>{info.subtitle}</Text>
                </View>

                {/* Decoración de fondo */}
                <View style={[styles.decoration, { backgroundColor: info.color }]} />
            </LinearGradient>
        </TouchableOpacity>
    );
};

// Componente para mostrar múltiples InfoCards en scroll horizontal
export const InfoCardScroll = ({ infoData, onCardPress }) => {
    return (
        <View style={styles.scrollContainer}>
            {infoData.map((info, index) => (
                <InfoCard
                    key={index}
                    info={info}
                    onPress={onCardPress}
                    style={[
                        styles.scrollCard,
                        index === 0 && styles.firstCard,
                        index === infoData.length - 1 && styles.lastCard,
                    ]}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 150,
        height: 140,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: Colors.shadows.md,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    gradient: {
        flex: 1,
        padding: 16,
        position: 'relative',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: Colors.shadows.sm,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    content: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    title: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.text.secondary,
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    value: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 2,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 11,
        color: Colors.text.light,
        fontWeight: '500',
    },
    decoration: {
        position: 'absolute',
        top: -20,
        right: -20,
        width: 60,
        height: 60,
        borderRadius: 30,
        opacity: 0.1,
    },

    // Estilos para scroll horizontal
    scrollContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
    },
    scrollCard: {
        marginRight: 16,
    },
    firstCard: {
        marginLeft: 0,
    },
    lastCard: {
        marginRight: 20,
    },
});

export default InfoCard;