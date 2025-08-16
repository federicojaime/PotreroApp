// src/components/home/SectionCard.js
import React from 'react';
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

const { width } = Dimensions.get('window');

const SectionCard = ({ section, onPress, style }) => {
    return (
        <TouchableOpacity
            style={[styles.container, style]}
            onPress={() => onPress(section)}
            activeOpacity={0.85}
        >
            <ImageBackground
                source={section.image}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={section.gradient}
                    style={styles.gradientOverlay}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <BlurView intensity={20} style={styles.content}>
                        {/* Icono con efecto glassmorphism */}
                        <View style={styles.iconContainer}>
                            <View style={styles.iconBackground}>
                                <Text style={styles.emoji}>{section.emoji}</Text>
                            </View>
                        </View>

                        {/* Información */}
                        <View style={styles.textContainer}>
                            <Text style={styles.subtitle}>{section.subtitle}</Text>
                            <Text style={styles.title}>{section.title}</Text>
                            <Text style={styles.description}>{section.description}</Text>

                            {/* Contador/Badge */}
                            {section.count && (
                                <View style={styles.countBadge}>
                                    <Text style={styles.countText}>{section.count}</Text>
                                </View>
                            )}
                        </View>

                        {/* Arrow button */}
                        <View style={styles.arrowContainer}>
                            <View style={styles.arrowBackground}>
                                <Ionicons
                                    name="chevron-forward"
                                    size={20}
                                    color={Colors.text.white}
                                />
                            </View>
                        </View>
                    </BlurView>
                </LinearGradient>
            </ImageBackground>

            {/* Efecto de brillo al tocar */}
            <View style={styles.shimmerOverlay} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 120,
        borderRadius: 24,
        overflow: 'hidden',
        marginVertical: 8,
        shadowColor: Colors.shadows.lg,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 12,
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
    },
    gradientOverlay: {
        flex: 1,
        opacity: 0.9,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    iconContainer: {
        marginRight: 16,
    },
    iconBackground: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    emoji: {
        fontSize: 28,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    subtitle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.text.white,
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    description: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.85)',
        fontWeight: '500',
        lineHeight: 16,
    },
    countBadge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    countText: {
        fontSize: 11,
        color: Colors.text.white,
        fontWeight: '600',
    },
    arrowContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrowBackground: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    shimmerOverlay: {
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
});

export default SectionCard;