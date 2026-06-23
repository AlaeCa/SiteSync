import { View, Text, StyleSheet } from 'react-native';
export default function DashboardScreen() {
  return (
    <View style={styles.c}>
      <Text style={styles.t}>Dashboard</Text>
      <Text style={styles.s}>Module à venir</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  c: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 6, padding: 24 },
  t: { fontSize: 20, fontWeight: 'bold' },
  s: { color: '#6b7280' },
});