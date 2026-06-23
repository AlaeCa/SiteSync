import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ForgotPasswordScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>SiteSync</Text>
        <Text style={styles.subtitle}>Mot de passe oublié</Text>

        <Text style={styles.info}>
          La réinitialisation du mot de passe par email n'est pas encore disponible
          dans l'application. Contacte un administrateur pour réinitialiser ton mot de passe.
        </Text>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Retour à la connexion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  inner: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 42, fontWeight: 'bold', color: '#ff6b35', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#aaa', textAlign: 'center', marginBottom: 32 },
  info: { fontSize: 15, color: '#ccc', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  button: { backgroundColor: '#ff6b35', borderRadius: 12, padding: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
