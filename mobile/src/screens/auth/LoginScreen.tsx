import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { auth } from '../../config/firebase';
import { authAPI } from '../../services/api';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
  webClientId: '4878729515-a8mnu17cdu8klhsfo8bp4cebupa24k34.apps.googleusercontent.com',
  androidClientId: '4878729515-4l1p79777i9vcige6dc8pu5640tq8vgk.apps.googleusercontent.com',
});

  React.useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleResponse(response);
    }
  }, [response]);

  const handleGoogleResponse = async (response: any) => {
    setGoogleLoading(true);
    try {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      const userCredential = await signInWithCredential(auth, credential);
      const idToken = await userCredential.user.getIdToken();

      const res = await authAPI.firebaseLogin(idToken);
      const { token, id, name, role } = res.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userId', id);
      await AsyncStorage.setItem('userName', name);
      await AsyncStorage.setItem('userRole', role);
      await AsyncStorage.setItem('userEmail', userCredential.user.email || '');

      navigation.replace('Profile');
    } catch (error: any) {
      Alert.alert('Erreur', 'Connexion Google échouée');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      const response = await authAPI.firebaseLogin(idToken);
      const { token, id, name, role } = response.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userId', id);
      await AsyncStorage.setItem('userName', name);
      await AsyncStorage.setItem('userRole', role);
      await AsyncStorage.setItem('userEmail', email);

      navigation.replace('Profile');
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data || error.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.inner}>
        <Text style={styles.title}>SiteSync</Text>
        <Text style={styles.subtitle}>Connectez-vous à votre compte</Text>

        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#999" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Mot de passe" placeholderTextColor="#999" value={password} onChangeText={setPassword} secureTextEntry />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Se connecter</Text>}
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.orText}>OU</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={() => promptAsync()}
          disabled={!request || googleLoading}
        >
          {googleLoading ? (
            <ActivityIndicator color="#333" />
          ) : (
            <Text style={styles.googleText}>🔵 Se connecter avec Google</Text>
          )}
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
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  line: { flex: 1, height: 1, backgroundColor: '#0f3460' },
  orText: { color: '#aaa', marginHorizontal: 10 },
  googleButton: { backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 8 },
  googleText: { color: '#333', fontSize: 16, fontWeight: 'bold' },
  linkButton: { marginTop: 16, alignItems: 'center' },
  linkText: { color: '#aaa', fontSize: 15 },
  linkBold: { color: '#ff6b35', fontWeight: 'bold' },
});