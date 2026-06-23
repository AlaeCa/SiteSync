import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Alert, ActivityIndicator, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../../services/api';

export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const userName = await AsyncStorage.getItem('userName');
      const userRole = await AsyncStorage.getItem('userRole');
      const userEmail = await AsyncStorage.getItem('userEmail');

      if (userId) {
        try {
          const response = await authAPI.getUserById(userId);
          setUser(response.data);
        } catch {
          // Fallback sur les données locales
          setUser({
            id: userId,
            name: userName,
            role: userRole,
            email: userEmail,
            phone: null,
            status: 'ACTIVE',
            createdAt: new Date().toISOString(),
          });
        }
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger le profil');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['token', 'userId', 'userName', 'userRole']);
    navigation.replace('Login');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return '#e74c3c';
      case 'CHEF': return '#f39c12';
      default: return '#2ecc71';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6b35" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user?.role) }]}>
          <Text style={styles.roleText}>{user?.role}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Informations</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user?.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Téléphone</Text>
          <Text style={styles.infoValue}>{user?.phone || 'Non renseigné'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Statut</Text>
          <Text style={[styles.infoValue, { color: '#2ecc71' }]}>{user?.status}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Membre depuis</Text>
          <Text style={styles.infoValue}>
            {new Date(user?.createdAt).toLocaleDateString('fr-FR')}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' },
  header: { alignItems: 'center', padding: 40, paddingTop: 60 },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#ff6b35', justifyContent: 'center', alignItems: 'center', marginBottom: 16
  },
  avatarText: { fontSize: 36, fontWeight: 'bold', color: '#fff' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  roleBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  roleText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  card: {
    backgroundColor: '#16213e', margin: 16,
    borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#0f3460'
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#ff6b35', marginBottom: 16 },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#0f3460'
  },
  infoLabel: { color: '#aaa', fontSize: 15 },
  infoValue: { color: '#fff', fontSize: 15, fontWeight: '500' },
  logoutButton: {
    backgroundColor: '#e74c3c', margin: 16,
    borderRadius: 12, padding: 16, alignItems: 'center'
  },
  logoutText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});