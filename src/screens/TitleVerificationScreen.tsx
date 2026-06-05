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
  FlatList,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { verifyTitle, searchTitleRecords } from '../services/titleService';

interface TitleRecord {
  id: string;
  ownerName: string;
  ownerAddress: string;
  ownerPhone?: string;
  registrationDate: string;
  expirationDate: string;
  status: 'Active' | 'Expired' | 'Suspended' | 'Unknown';
  state: string;
  plateNumber?: string;
  lienHolder?: string;
  notes?: string;
}

export default function TitleVerificationScreen() {
  const [vin, setVin] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [searchMethod, setSearchMethod] = useState<'vin' | 'plate'>('vin');
  const [titleRecords, setTitleRecords] = useState<TitleRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleVerifyTitle = async () => {
    const searchValue = searchMethod === 'vin' ? vin : plateNumber;

    if (!searchValue.trim()) {
      Alert.alert('Required', `Please enter a ${searchMethod === 'vin' ? 'VIN' : 'plate number'}`);
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      let results: TitleRecord[] = [];

      if (searchMethod === 'vin') {
        if (vin.length !== 17) {
          Alert.alert('Invalid VIN', 'VIN must be 17 characters');
          setLoading(false);
          return;
        }
        results = await searchTitleRecords('vin', vin);
      } else {
        results = await searchTitleRecords('plate', plateNumber);
      }

      setTitleRecords(results);

      if (results.length === 0) {
        Alert.alert('No Records', 'No title records found for this vehicle');
      }
    } catch (error) {
      console.error('Title verification error:', error);
      Alert.alert('Error', 'Could not verify title. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setVin('');
    setPlateNumber('');
    setTitleRecords([]);
    setSearched(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return '#4CAF50';
      case 'Expired':
        return '#FF9800';
      case 'Suspended':
        return '#FF6B6B';
      default:
        return '#999';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return 'check-circle';
      case 'Expired':
        return 'alert-circle';
      case 'Suspended':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const renderTitleRecord = ({ item }: { item: TitleRecord }) => (
    <View style={styles.recordCard}>
      <View style={styles.recordHeader}>
        <View style={styles.recordHeaderLeft}>
          <Text style={styles.recordTitle}>Legal Owner</Text>
          <Text style={styles.ownerName}>{item.ownerName}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(item.status) + '20' }
        ]}>
          <MaterialCommunityIcons
            name={getStatusIcon(item.status)}
            size={16}
            color={getStatusColor(item.status)}
          />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.recordDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Address</Text>
          <Text style={styles.detailValue}>{item.ownerAddress}</Text>
        </View>

        {item.ownerPhone && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Phone</Text>
            <View style={styles.phoneRow}>
              <Text style={styles.detailValue}>{item.ownerPhone}</Text>
              <TouchableOpacity style={styles.callButton}>
                <MaterialCommunityIcons name="phone" size={16} color="#2196F3" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Registration Date</Text>
          <Text style={styles.detailValue}>{item.registrationDate}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Expiration Date</Text>
          <Text style={styles.detailValue}>{item.expirationDate}</Text>
        </View>

        {item.plateNumber && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Plate Number</Text>
            <Text style={styles.plateValue}>{item.plateNumber}</Text>
          </View>
        )}

        {item.lienHolder && (
          <View style={[styles.detailItem, styles.lienWarning]}>
            <MaterialCommunityIcons name="alert" size={16} color="#FF9800" />
            <View style={{ flex: 1 }}>
              <Text style={styles.detailLabel}>Lien Holder</Text>
              <Text style={styles.detailValue}>{item.lienHolder}</Text>
            </View>
          </View>
        )}

        {item.notes && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Notes</Text>
            <Text style={styles.detailValue}>{item.notes}</Text>
          </View>
        )}
      </View>

      <View style={styles.recordState}>
        <Text style={styles.stateText}>State: {item.state}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="file-document" size={40} color="#2196F3" />
        <Text style={styles.headerTitle}>Title Verification</Text>
        <Text style={styles.headerSubtitle}>Check legal vehicle ownership</Text>
      </View>

      {/* Search Method Selector */}
      <View style={styles.methodSelector}>
        <TouchableOpacity
          style={[
            styles.methodButton,
            searchMethod === 'vin' && styles.methodButtonActive
          ]}
          onPress={() => setSearchMethod('vin')}
        >
          <Text style={[
            styles.methodButtonText,
            searchMethod === 'vin' && styles.methodButtonTextActive
          ]}>
            Search by VIN
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.methodButton,
            searchMethod === 'plate' && styles.methodButtonActive
          ]}
          onPress={() => setSearchMethod('plate')}
        >
          <Text style={[
            styles.methodButtonText,
            searchMethod === 'plate' && styles.methodButtonTextActive
          ]}>
            Search by Plate
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.section}>
        {searchMethod === 'vin' ? (
          <>
            <Text style={styles.sectionTitle}>Enter VIN Number</Text>
            <TextInput
              style={styles.input}
              placeholder="17-character VIN"
              value={vin}
              onChangeText={setVin}
              maxLength={17}
              placeholderTextColor="#ccc"
              editable={!loading}
            />
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Enter License Plate</Text>
            <TextInput
              style={styles.input}
              placeholder="License plate number"
              value={plateNumber}
              onChangeText={setPlateNumber}
              placeholderTextColor="#ccc"
              editable={!loading}
            />
          </>
        )}

        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleVerifyTitle}
          disabled={loading || (!vin && !plateNumber)}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <MaterialCommunityIcons name="magnify" size={20} color="#fff" />
              <Text style={styles.verifyButtonText}>Search Records</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Title Records */}
      {titleRecords.length > 0 && (
        <View style={styles.resultsContainer}>
          <View style={styles.recordsHeader}>
            <Text style={styles.recordsTitle}>
              {titleRecords.length} Record{titleRecords.length !== 1 ? 's' : ''} Found
            </Text>
          </View>
          <FlatList
            data={titleRecords}
            renderItem={renderTitleRecord}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
          >
            <Text style={styles.clearButtonText}>New Search</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Empty State */}
      {searched && titleRecords.length === 0 && !loading && (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="file-document-outline" size={64} color="#ccc" />
          <Text style={styles.emptyStateText}>No records found</Text>
          <Text style={styles.emptyStateSubtext}>
            Try verifying through your state's DMV office
          </Text>
        </View>
      )}

      {/* Info Box */}
      <View style={styles.infoBox}>
        <MaterialCommunityIcons name="information" size={20} color="#2196F3" />
        <Text style={styles.infoText}>
          Title records show the legal owner and registration status. Always verify ownership before accepting a vehicle.
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
  methodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginTop: 12,
    gap: 8,
  },
  methodButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  methodButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  methodButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  methodButtonTextActive: {
    color: '#fff',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 12,
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
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  verifyButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  verifyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  resultsContainer: {
    marginHorizontal: 12,
    marginTop: 16,
    marginBottom: 16,
  },
  recordsHeader: {
    marginBottom: 12,
  },
  recordsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  recordCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  recordHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  recordHeaderLeft: {
    flex: 1,
  },
  recordTitle: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  ownerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  recordDetails: {
    padding: 12,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
    gap: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
    minWidth: 80,
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  phoneRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  callButton: {
    padding: 4,
  },
  plateValue: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    letterSpacing: 2,
  },
  lienWarning: {
    backgroundColor: '#FFF3E0',
    padding: 8,
    borderRadius: 6,
    marginHorizontal: -4,
    paddingHorizontal: 12,
  },
  recordState: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  stateText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  separator: {
    height: 8,
    backgroundColor: '#f5f5f5',
  },
  clearButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
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
