import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  ActivityIndicator,
  Image,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { searchVehicles } from '../services/vehicleService';

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
}

export default function SearchScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const searchResults = await searchVehicles(searchQuery);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setResults([]);
    setSearched(false);
  };

  const handleSelectVehicle = (vehicle: Vehicle) => {
    navigation.navigate('VehicleDetails', { vehicle });
  };

  const renderVehicleItem = ({ item }: { item: Vehicle }) => (
    <TouchableOpacity
      style={styles.vehicleItem}
      onPress={() => handleSelectVehicle(item)}
    >
      {item.image && (
        <Image
          source={{ uri: item.image }}
          style={styles.vehicleImage}
          defaultSource={require('../../assets/placeholder.png')}
        />
      )}
      {!item.image && (
        <View style={[styles.vehicleImage, styles.imagePlaceholder]}>
          <MaterialCommunityIcons name="car" size={40} color="#ccc" />
        </View>
      )}

      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleTitle}>
          {item.year} {item.make} {item.model}
        </Text>
        <Text style={styles.vehicleCondition}>{item.condition}</Text>
        <Text style={styles.vehicleDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.vehicleSource}>
          <MaterialCommunityIcons name="link" size={12} color="#999" />
          <Text style={styles.sourceText}>{item.source}</Text>
        </View>
      </View>

      <MaterialCommunityIcons
        name="chevron-right"
        size={24}
        color="#2196F3"
        style={styles.chevron}
      />
    </TouchableOpacity>
  );

  const renderEmptyState = () => {
    if (!searched) {
      return (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="magnify" size={64} color="#ccc" />
          <Text style={styles.emptyStateText}>Search for free vehicles</Text>
          <Text style={styles.emptyStateSubtext}>
            Enter make, model, or location to find vehicles
          </Text>
        </View>
      );
    }

    if (loading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.emptyStateText}>Searching for vehicles...</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <MaterialCommunityIcons name="car-off" size={64} color="#ccc" />
        <Text style={styles.emptyStateText}>No vehicles found</Text>
        <Text style={styles.emptyStateSubtext}>Try a different search query</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInput}>
          <MaterialCommunityIcons name="magnify" size={20} color="#999" />
          <TextInput
            style={styles.input}
            placeholder="Make, model, or location..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            placeholderTextColor="#ccc"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <MaterialCommunityIcons name="close" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <MaterialCommunityIcons name="magnify" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      {/* Results or empty state */}
      {results.length > 0 ? (
        <>
          <View style={styles.resultCount}>
            <Text style={styles.resultCountText}>
              {results.length} vehicle{results.length !== 1 ? 's' : ''} found
            </Text>
          </View>
          <FlatList
            data={results}
            renderItem={renderVehicleItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </>
      ) : (
        renderEmptyState()
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: '#333',
  },
  searchButton: {
    width: 40,
    height: 40,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultCount: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  resultCountText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  listContent: {
    paddingVertical: 8,
  },
  vehicleItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    alignItems: 'center',
    paddingRight: 12,
  },
  vehicleImage: {
    width: 100,
    height: 100,
    backgroundColor: '#f0f0f0',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleInfo: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  vehicleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  vehicleCondition: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '500',
    marginBottom: 4,
  },
  vehicleDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  vehicleSource: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sourceText: {
    fontSize: 10,
    color: '#999',
  },
  chevron: {
    marginLeft: 8,
  },
  separator: {
    height: 4,
    backgroundColor: '#f5f5f5',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});
