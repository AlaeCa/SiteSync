import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../../services/api';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    setLoading(true);
    try {
      // Flux A : email + mot de passe envoyés directement au backend commun
      const response = await authAPI.login({ email: email.trim(), password });
      console.log('LOGIN RESPONSE', JSON.stringify(response.data));

      const data = response.data || {};
      const token = data.token ?? data.accessToken ?? data.jwt;
      const id = data.id ?? data.userId ?? data._id ?? data.user?.id;
      const name = data.name ?? data.user?.name ?? '';
      const role = data.role ?? data.user?.role ?? 'USER';

      if (!token) {
        Alert.alert('Erreur', "Le serveur n'a pas renvoyé de jeton. Regarde le log LOGIN RESPONSE.");
        return;
      }

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userId', String(id ?? ''));
      await AsyncStorage.setItem('userName', String(name ?? ''));
      await AsyncStorage.setItem('userRole', String(role ?? 'USER'));
      await AsyncStorage.setItem('userEmail', email.trim());

      navigation.replace('Main');
    } catch (error: any) {
      const msg = error.response?.data?.message
        || error.response?.data
        || error.message
        || 'Erreur de connexion';
      Alert.alert('Erreur', typeof msg === 'string' ? msg : 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.inner}>
        <Text style={styles.title}>SiteSync</Text>
        <Text style={styles.subtitle}>Connectez-vous à votre compte</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Se connecter</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Pas de compte ? <Text style={styles.linkBold}>S'inscrire</Text></Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.linkText}>Mot de passe oublié ?</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  inner: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 42, fontWeight: 'bold', color: '#ff6b35', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#aaa', textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: '#16213e', color: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 16, borderWidth: 1, borderColor: '#0f3460' },
  button: { backgroundColor: '#ff6b35', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  linkButton: { marginTop: 16, alignItems: 'center' },
  linkText: { color: '#aaa', fontSize: 15 },
  linkBold: { color: '#ff6b35', fontWeight: 'bold' },
});
