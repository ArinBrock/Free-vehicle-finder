import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as SecureStore from 'expo-secure-store';

interface UserProfile {
  id?: string;
  name: string;
  email: string;
  phone: string;
  savedVehicles: string[];
  searches: string[];
  joinDate: string;
}

export default function ProfileScreen({ navigation }: any) {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Guest User',
    email: 'Not signed in',
    phone: '',
    savedVehicles: [],
    searches: [],
    joinDate: new Date().toLocaleDateString(),
  });
  const [loading, setLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const storedProfile = await SecureStore.getItemAsync('userProfile');
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
        setIsSignedIn(true);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    navigation.navigate('SignIn');
  };

  const handleViewSavedVehicles = () => {
    navigation.navigate('SavedVehicles', { vehicles: profile.savedVehicles });
  };

  const handleSignOut = async () => {
    try {
      await SecureStore.deleteItemAsync('userProfile');
      setIsSignedIn(false);
      setProfile({
        name: 'Guest User',
        email: 'Not signed in',
        phone: '',
        savedVehicles: [],
        searches: [],
        joinDate: new Date().toLocaleDateString(),
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <MaterialCommunityIcons name="account-circle" size={80} color="#2196F3" />
        </View>
        <Text style={styles.profileName}>{profile.name}</Text>
        <Text style={styles.profileEmail}>{profile.email}</Text>
        {profile.phone && (
          <Text style={styles.profilePhone}>{profile.phone}</Text>
        )}
        {isSignedIn && (
          <Text style={styles.joinDate}>
            Member since {profile.joinDate}
          </Text>
        )}
      </View>

      {/* Authentication Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        {!isSignedIn ? (
          <TouchableOpacity
            style={styles.signInButton}
            onPress={handleSignIn}
          >
            <MaterialCommunityIcons name="login" size={20} color="#fff" />
            <Text style={styles.signInButtonText}>Sign In / Create Account</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.signInButton, styles.signOutButton]}
            onPress={handleSignOut}
          >
            <MaterialCommunityIcons name="logout" size={20} color="#fff" />
            <Text style={styles.signInButtonText}>Sign Out</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Saved Items */}
      {isSignedIn && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Activity</Text>

          <TouchableOpacity
            style={styles.activityItem}
            onPress={handleViewSavedVehicles}
          >
            <View style={styles.activityIcon}>
              <MaterialCommunityIcons name="heart" size={24} color="#FF6B6B" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Saved Vehicles</Text>
              <Text style={styles.activitySubtitle}>
                {profile.savedVehicles.length} saved
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <MaterialCommunityIcons name="history" size={24} color="#FF9800" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Search History</Text>
              <Text style={styles.activitySubtitle}>
                {profile.searches.length} searches
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>
      )}

      {/* App Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>

        <View style={styles.featureItem}>
          <MaterialCommunityIcons name="map" size={24} color="#2196F3" />
          <Text style={styles.featureText}>Find Free Vehicles on Map</Text>
        </View>

        <View style={styles.featureItem}>
          <MaterialCommunityIcons name="magnify" size={24} color="#2196F3" />
          <Text style={styles.featureText}>Search & Filter Results</Text>
        </View>

        <View style={styles.featureItem}>
          <MaterialCommunityIcons name="barcode-scan" size={24} color="#2196F3" />
          <Text style={styles.featureText}>VIN Verification & History</Text>
        </View>

        <View style={styles.featureItem}>
          <MaterialCommunityIcons name="file-document" size={24} color="#2196F3" />
          <Text style={styles.featureText}>Title Verification & Ownership</Text>
        </View>
      </View>

      {/* About & Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>More</Text>

        <TouchableOpacity style={styles.settingItem}>
          <MaterialCommunityIcons name="information" size={20} color="#666" />
          <Text style={styles.settingText}>About This App</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <MaterialCommunityIcons name="lock" size={20} color="#666" />
          <Text style={styles.settingText}>Privacy Policy</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <MaterialCommunityIcons name="file-document-multiple" size={20} color="#666" />
          <Text style={styles.settingText}>Terms of Service</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <MaterialCommunityIcons name="email" size={20} color="#666" />
          <Text style={styles.settingText}>Contact Support</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      {/* Version Info */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Free Vehicle Finder v1.0.0</Text>
        <Text style={styles.versionSubtext}>
          Help people find free vehicles and improve their lives
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
  profileHeader: {
    backgroundColor: '#fff',
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  profilePhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  joinDate: {
    fontSize: 12,
    color: '#999',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 8,
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  signInButton: {
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  signOutButton: {
    backgroundColor: '#FF6B6B',
  },
  signInButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  activityItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  activityIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  activitySubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  featureItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    justifyContent: 'space-between',
  },
  settingText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    marginLeft: 12,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  versionSubtext: {
    fontSize: 11,
    color: '#ccc',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});
