import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert,
  KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { authAPI } from '../../services/api';

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires');
      return;
    }
    setLoading(true);
    try {
      // 1. Créer le compte Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Mettre à jour le nom dans Firebase
      await updateProfile(userCredential.user, { displayName: name });
      
      // 3. Récupérer le token Firebase
      const idToken = await userCredential.user.getIdToken();

      // 4. Envoyer au backend pour créer dans MongoDB
      const response = await authAPI.firebaseLogin(idToken);
      const { token, id, role } = response.data;

      // 5. Sauvegarder localement
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userId', id);
      await AsyncStorage.setItem('userName', name);
      await AsyncStorage.setItem('userRole', role);
      await AsyncStorage.setItem('userEmail', email);

      Alert.alert('Succès', 'Compte créé avec succès !', [
        { text: 'OK', onPress: () => navigation.replace('Profile') }
      ]);
    } catch (error: any) {
      let message = 'Erreur lors de l\'inscription';
      if (error.code === 'auth/email-already-in-use') {
        message = 'Cet email est déjà utilisé';
      } else if (error.code === 'auth/weak-password') {
        message = 'Mot de passe trop faible (min. 6 caractères)';
      }
      Alert.alert('Erreur', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.title}>SiteSync</Text>
        <Text style={styles.subtitle}>Créer un nouveau compte</Text>

        <TextInput style={styles.input} placeholder="Nom complet *" placeholderTextColor="#999" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Email *" placeholderTextColor="#999" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Mot de passe * (min. 6 caractères)" placeholderTextColor="#999" value={password} onChangeText={setPassword} secureTextEntry />
        <TextInput style={styles.input} placeholder="Téléphone (optionnel)" placeholderTextColor="#999" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>S'inscrire</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>
            Déjà un compte ? <Text style={styles.linkBold}>Se connecter</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  inner: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 42, fontWeight: 'bold', color: '#ff6b35', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#aaa', textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: '#16213e', color: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 16, borderWidth: 1, borderColor: '#0f3460' },
  button: { backgroundColor: '#ff6b35', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  linkButton: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#aaa', fontSize: 15 },
  linkBold: { color: '#ff6b35', fontWeight: 'bold' },
});