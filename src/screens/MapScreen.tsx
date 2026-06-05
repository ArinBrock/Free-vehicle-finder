import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getVehiclesNearby } from '../services/vehicleService';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function MapScreen({ navigation }: any) {
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [mapRef, setMapRef] = useState<any>(null);

  useEffect(() => {
    getLocationAndVehicles();
  }, []);

  const getLocationAndVehicles = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is needed to find vehicles near you');
        setLoading(false);
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = userLocation.coords;

      setLocation({
        latitude,
        longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });

      // Fetch vehicles near this location
      const nearbyVehicles = await getVehiclesNearby(latitude, longitude);
      setVehicles(nearbyVehicles);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Could not get your location');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerPress = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    if (mapRef) {
      mapRef.animateToRegion({
        latitude: vehicle.latitude,
        longitude: vehicle.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }, 500);
    }
  };

  const handleViewDetails = () => {
    if (selectedVehicle) {
      navigation.navigate('VehicleDetails', { vehicle: selectedVehicle });
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    getLocationAndVehicles();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Finding free vehicles near you...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {location && (
        <>
          <MapView
            ref={setMapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={location}
            showsUserLocation
            showsMyLocationButton={false}
          >
            {/* User location marker */}
            <Marker
              coordinate={{ latitude: location.latitude, longitude: location.longitude }}
              title="Your Location"
              pinColor="#2196F3"
            />

            {/* Vehicle markers */}
            {vehicles.map((vehicle) => (
              <Marker
                key={vehicle.id}
                coordinate={{
                  latitude: vehicle.latitude,
                  longitude: vehicle.longitude,
                }}
                title={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                description={vehicle.description}
                onPress={() => handleMarkerPress(vehicle)}
                pinColor={selectedVehicle?.id === vehicle.id ? '#FF6B6B' : '#4CAF50'}
              />
            ))}
          </MapView>

          {/* Floating action buttons */}
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
          >
            <MaterialCommunityIcons name="refresh" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Selected vehicle card */}
          {selectedVehicle && (
            <View style={styles.vehicleCard}>
              <Text style={styles.vehicleTitle}>
                {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
              </Text>
              <Text style={styles.vehicleInfo}>{selectedVehicle.condition}</Text>
              <Text style={styles.vehicleDescription} numberOfLines={2}>
                {selectedVehicle.description}
              </Text>
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={handleViewDetails}
              >
                <Text style={styles.detailsButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Vehicle count */}
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{vehicles.length} vehicles found</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#2196F3',
  },
  refreshButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#2196F3',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  vehicleCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  vehicleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  vehicleInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  vehicleDescription: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  detailsButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  countBadge: {
    position: 'absolute',
    top: 80,
    right: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  countText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2196F3',
  },
});
