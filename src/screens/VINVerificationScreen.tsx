import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ScrollView,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { verifyVIN, decodeVIN } from '../services/vinService';

const { width } = Dimensions.get('window');

interface VINData {
  vin: string;
  year?: number;
  make?: string;
  model?: string;
  engineType?: string;
  transmission?: string;
  status?: string;
  isStolen?: boolean;
  recordsFound?: number;
}

export default function VINVerificationScreen() {
  const [vin, setVin] = useState('');
  const [vinData, setVinData] = useState<VINData | null>(null);
  const [loading, setLoading] = useState(false);
  const [useCamera, setUseCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const handleVerifyVIN = async () => {
    if (!vin.trim() || vin.length !== 17) {
      Alert.alert('Invalid VIN', 'VIN must be 17 characters long');
      return;
    }

    setLoading(true);
    try {
      // Decode VIN structure
      const decoded = decodeVIN(vin);

      // Check against theft database (this would connect to a real service)
      const verified = await verifyVIN(vin);

      setVinData({
        vin: vin.toUpperCase(),
        ...decoded,
        ...verified,
      });
    } catch (error) {
      console.error('VIN verification error:', error);
      Alert.alert('Error', 'Could not verify VIN. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCameraPermission = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Camera Permission', 'Camera access is required to scan VIN');
        return;
      }
    }
    setUseCamera(true);
  };

  const handleScanComplete = (scannedVIN: string) => {
    setVin(scannedVIN.toUpperCase());
    setUseCamera(false);
  };

  const handleClear = () => {
    setVin('');
    setVinData(null);
  };

  if (useCamera && permission?.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.cameraHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setUseCamera(false)}
          >
            <MaterialCommunityIcons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.cameraTitle}>Scan VIN</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.cameraScannerMessage}>
          <Text style={styles.scanMessage}>
            Point camera at VIN number (usually on dashboard or door frame)
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="barcode-scan" size={40} color="#2196F3" />
        <Text style={styles.headerTitle}>VIN Verification</Text>
        <Text style={styles.headerSubtitle}>Check vehicle history and theft status</Text>
      </View>

      {/* VIN Input */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Enter VIN Number</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="17-character VIN"
            value={vin}
            onChangeText={setVin}
            maxLength={17}
            placeholderTextColor="#ccc"
            editable={!loading}
          />
          {vin.length > 0 && (
            <Text style={styles.charCount}>{vin.length}/17</Text>
          )}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.scanButton]}
            onPress={handleCameraPermission}
            disabled={loading}
          >
            <MaterialCommunityIcons name="camera" size={20} color="#fff" />
            <Text style={styles.buttonText}>Scan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.verifyButton]}
            onPress={handleVerifyVIN}
            disabled={loading || vin.length !== 17}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <MaterialCommunityIcons name="check-circle" size={20} color="#fff" />
                <Text style={styles.buttonText}>Verify</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* VIN Results */}
      {vinData && (
        <View style={styles.resultsContainer}>
          {/* Status Card */}
          <View style={[
            styles.statusCard,
            vinData.isStolen ? styles.stolenCard : styles.validCard
          ]}>
            <MaterialCommunityIcons
              name={vinData.isStolen ? 'alert-circle' : 'check-circle'}
              size={32}
              color={vinData.isStolen ? '#FF6B6B' : '#4CAF50'}
            />
            <Text style={[
              styles.statusTitle,
              { color: vinData.isStolen ? '#FF6B6B' : '#4CAF50' }
            ]}>
              {vinData.isStolen ? 'STOLEN VEHICLE' : 'VALID VEHICLE'}
            </Text>
            <Text style={styles.statusSubtitle}>
              {vinData.isStolen
                ? 'This vehicle is reported as stolen'
                : 'No theft records found'}
            </Text>
          </View>

          {/* VIN Details */}
          <View style={styles.detailsCard}>
            <Text style={styles.cardTitle}>Vehicle Information</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>VIN:</Text>
              <Text style={styles.detailValue}>{vinData.vin}</Text>
            </View>

            {vinData.year && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Year:</Text>
                <Text style={styles.detailValue}>{vinData.year}</Text>
              </View>
            )}

            {vinData.make && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Make:</Text>
                <Text style={styles.detailValue}>{vinData.make}</Text>
              </View>
            )}

            {vinData.model && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Model:</Text>
                <Text style={styles.detailValue}>{vinData.model}</Text>
              </View>
            )}

            {vinData.engineType && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Engine:</Text>
                <Text style={styles.detailValue}>{vinData.engineType}</Text>
              </View>
            )}

            {vinData.transmission && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Transmission:</Text>
                <Text style={styles.detailValue}>{vinData.transmission}</Text>
              </View>
            )}

            {vinData.recordsFound !== undefined && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Records Found:</Text>
                <Text style={styles.detailValue}>{vinData.recordsFound}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
          >
            <Text style={styles.clearButtonText}>Check Another VIN</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Info Box */}
      <View style={styles.infoBox}>
        <MaterialCommunityIcons name="information" size={20} color="#2196F3" />
        <Text style={styles.infoText}>
          VIN verification checks vehicle history, theft records, and title information. Always verify through official channels before purchasing.
        </Text>
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
  cameraHeader: {
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cameraScannerMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  scanMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  charCount: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    fontSize: 12,
    color: '#999',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  scanButton: {
    backgroundColor: '#FF9800',
  },
  verifyButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  resultsContainer: {
    marginHorizontal: 12,
    marginTop: 16,
  },
  statusCard: {
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  validCard: {
    backgroundColor: '#E8F5E9',
  },
  stolenCard: {
    backgroundColor: '#FFEBEE',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    marginHorizontal: 12,
    padding: 12,
    borderRadius: 8,
    gap: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#1976D2',
  },
});
