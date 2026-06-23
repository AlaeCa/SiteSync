import React, { useState } from 'react';
import {
  Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../../services/api';

// Récupère le jeton quelle que soit la forme de la réponse
// (au cas où le backend enveloppe dans { data: {...} })
function extractToken(d: any): string | undefined {
  const t = d?.token ?? d?.accessToken ?? d?.jwt ?? d?.data?.token ?? d?.data?.accessToken;
  return typeof t === 'string' && t.length > 0 ? t : undefined;
}
function extractField(d: any, key: string) {
  return d?.[key] ?? d?.data?.[key];
}

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
    if (password.length < 6) {
      Alert.alert('Erreur', 'Mot de passe trop court (min. 6 caractères)');
      return;
    }
    setLoading(true);
    try {
      // 1. Créer le compte
      const reg = await authAPI.register({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
      });
      console.log('REGISTER RESPONSE', JSON.stringify(reg.data));

      // 2. Se connecter pour obtenir un jeton fiable
      const log = await authAPI.login({ email: email.trim(), password });
      console.log('LOGIN RESPONSE', JSON.stringify(log.data));

      const token = extractToken(log.data);
      const id = extractField(log.data, 'id') ?? extractField(log.data, 'userId');
      const role = extractField(log.data, 'role') ?? 'USER';

      if (!token) {
        // Pas de jeton récupérable : on renvoie vers la connexion manuelle
        Alert.alert('Compte créé', 'Connecte-toi avec ton email et ton mot de passe.', [
          { text: 'OK', onPress: () => navigation.replace('Login') },
        ]);
        return;
      }

      // 3. Sauvegarder une session valide
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userId', String(id ?? ''));
      await AsyncStorage.setItem('userName', name.trim());
      await AsyncStorage.setItem('userRole', String(role ?? 'USER'));
      await AsyncStorage.setItem('userEmail', email.trim());

      navigation.replace('Main');
    } catch (error: any) {
      const msg = error.response?.data?.message
        || error.response?.data
        || error.message
        || "Erreur lors de l'inscription";
      Alert.alert('Erreur', typeof msg === 'string' ? msg : "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.inner}
      keyboardShouldPersistTaps="handled"
    >
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
