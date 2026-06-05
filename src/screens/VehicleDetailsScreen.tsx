import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  condition: string;
  description: string;
  latitude: number;
  longitude: number;
  source: string;
  link: string;
  image?: string;
  postedBy?: string;
  postedDate?: string;
  mileage?: string;
  color?: string;
  body?: string;
}

export default function VehicleDetailsScreen({ route, navigation }: any) {
  const vehicle: Vehicle = route.params.vehicle;

  const handleViewOriginal = () => {
    if (vehicle.link) {
      Linking.openURL(vehicle.link);
    }
  };

  const handleContact = () => {
    if (vehicle.postedBy) {
      navigation.navigate('Contact', { vehicle });
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Vehicle Image */}
      {vehicle.image && (
        <Image
          source={{ uri: vehicle.image }}
          style={styles.vehicleImage}
          resizeMode="cover"
        />
      )}
      {!vehicle.image && (
        <View style={styles.vehicleImagePlaceholder}>
          <MaterialCommunityIcons name="car" size={80} color="#ccc" />
        </View>
      )}

      {/* Vehicle Title */}
      <View style={styles.titleSection}>
        <Text style={styles.vehicleTitle}>
          {vehicle.year} {vehicle.make} {vehicle.model}
        </Text>
        <View style={styles.conditionBadge}>
          <Text style={styles.conditionText}>{vehicle.condition}</Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        {vehicle.mileage && (
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="speedometer" size={20} color="#2196F3" />
            <Text style={styles.statLabel}>Mileage</Text>
            <Text style={styles.statValue}>{vehicle.mileage}</Text>
          </View>
        )}
        {vehicle.color && (
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="palette" size={20} color="#2196F3" />
            <Text style={styles.statLabel}>Color</Text>
            <Text style={styles.statValue}>{vehicle.color}</Text>
          </View>
        )}
        {vehicle.body && (
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="car-side" size={20} color="#2196F3" />
            <Text style={styles.statLabel}>Body</Text>
            <Text style={styles.statValue}>{vehicle.body}</Text>
          </View>
        )}
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{vehicle.description}</Text>
      </View>

      {/* Source Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Source Information</Text>
        <View style={styles.sourceCard}>
          <MaterialCommunityIcons name="link" size={20} color="#666" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.sourceLabel}>Posted on</Text>
            <Text style={styles.sourceValue}>{vehicle.source}</Text>
          </View>
        </View>
        {vehicle.postedDate && (
          <View style={styles.sourceCard}>
            <MaterialCommunityIcons name="calendar" size={20} color="#666" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.sourceLabel}>Posted Date</Text>
              <Text style={styles.sourceValue}>{vehicle.postedDate}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Location */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.locationCard}>
          <MaterialCommunityIcons name="map-marker" size={20} color="#FF6B6B" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.sourceLabel}>Coordinates</Text>
            <Text style={styles.sourceValue}>
              {vehicle.latitude.toFixed(4)}, {vehicle.longitude.toFixed(4)}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleViewOriginal}
        >
          <MaterialCommunityIcons name="open-in-new" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>View Original Post</Text>
        </TouchableOpacity>

        {vehicle.postedBy && (
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleContact}
          >
            <MaterialCommunityIcons name="message-text" size={20} color="#2196F3" />
            <Text style={styles.secondaryButtonText}>Contact Seller</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Verification Tips */}
      <View style={styles.tipsSection}>
        <Text style={styles.tipsTitle}>Verification Tips</Text>
        <View style={styles.tipItem}>
          <MaterialCommunityIcons name="check-circle" size={16} color="#4CAF50" />
          <Text style={styles.tipText}>Always verify VIN before accepting vehicle</Text>
        </View>
        <View style={styles.tipItem}>
          <MaterialCommunityIcons name="check-circle" size={16} color="#4CAF50" />
          <Text style={styles.tipText}>Check title and legal ownership</Text>
        </View>
        <View style={styles.tipItem}>
          <MaterialCommunityIcons name="check-circle" size={16} color="#4CAF50" />
          <Text style={styles.tipText}>Verify it's not a stolen vehicle</Text>
        </View>
        <View style={styles.tipItem}>
          <MaterialCommunityIcons name="check-circle" size={16} color="#4CAF50" />
          <Text style={styles.tipText}>Meet in public and inspect vehicle thoroughly</Text>
        </View>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  vehicleImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#e0e0e0',
  },
  vehicleImagePlaceholder: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehicleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  conditionBadge: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  conditionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  statsContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 8,
    marginTop: 12,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 8,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  sourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  sourceLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  sourceValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
  },
  actionsContainer: {
    paddingHorizontal: 8,
    marginTop: 16,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  secondaryButtonText: {
    color: '#2196F3',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tipsSection: {
    backgroundColor: '#fff',
    marginHorizontal: 8,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
});
