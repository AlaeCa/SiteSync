import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, TextInput, TouchableOpacity,
} from 'react-native';
import * as stockService from './stockService';
import { Material } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StockCharts from './StockCharts';

const CATEGORIES = ['Gros œuvre', 'Construction', 'Plomberie', 'Électricité', 'Menuiserie', 'Peinture', 'Outillage'];
const STATUS: Record<string, { label: string; color: string }> = {
  DISPONIBLE: { label: 'Disponible', color: '#16a34a' },
  FAIBLE: { label: 'Faible', color: '#f58216' },
  EN_RUPTURE: { label: 'En rupture', color: '#dc2626' },
};
const STATUS_FILTERS = [
  { label: 'Tous', value: '' },
  { label: 'Disponible', value: 'DISPONIBLE' },
  { label: 'Faible', value: 'FAIBLE' },
  { label: 'Rupture', value: 'EN_RUPTURE' },
];

export default function StockScreen() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // ✅ les hooks de rôle sont DANS le composant
  const [role, setRole] = useState('');
  useEffect(() => { AsyncStorage.getItem('userRole').then(r => setRole(r || '')); }, []);
  const isAdmin = role === 'ADMIN';

  const loadMaterials = useCallback(async () => {
    try {
      setError('');
      const res = await stockService.getMaterials();
      setMaterials(res.data);
    } catch (e: any) {
      const status = e?.response?.status;
      if (status === 403) setError('Erreur 403 : reconnecte-toi (token manquant/expiré).');
      else if (status) setError(`Erreur ${status} en chargeant les matériaux.`);
      else setError("Backend injoignable : vérifie l'IP dans api.ts et que le serveur tourne.");
      console.error('getMaterials:', status, e?.message);
    } finally { setLoading(false); }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const res = await stockService.getStats();
      setStats(res.data);
    } catch (e) { console.error(e); }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadMaterials(), loadStats()]);
    setRefreshing(false);
  }, [loadMaterials, loadStats]);

  useEffect(() => {
    loadMaterials();
    loadStats();
  }, [loadMaterials, loadStats]);

  if (loading) {
    return (<View style={styles.center}><ActivityIndicator size="large" /><Text style={styles.muted}>Chargement…</Text></View>);
  }

  const filtered = materials.filter((m) => {
    const matchName = (m.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = !statusFilter || m.status === statusFilter;
    const matchCat = !categoryFilter || m.category === categoryFilter;
    return matchName && matchStatus && matchCat;
  });

  const Header = (
    <View>
      {isAdmin && stats && (
        <>
          <Text style={styles.sectionTitle}>Statistiques</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}><Text style={styles.statNum}>{stats.total}</Text><Text style={styles.statLabel}>Total</Text></View>
            <View style={styles.statCard}><Text style={[styles.statNum, { color: '#16a34a' }]}>{stats.disponibles}</Text><Text style={styles.statLabel}>Dispo.</Text></View>
            <View style={styles.statCard}><Text style={[styles.statNum, { color: '#f58216' }]}>{stats.faibles}</Text><Text style={styles.statLabel}>Faibles</Text></View>
            <View style={styles.statCard}><Text style={[styles.statNum, { color: '#dc2626' }]}>{stats.en_rupture}</Text><Text style={styles.statLabel}>Rupture</Text></View>
          </View>
          <View style={styles.valueCard}>
            <Text style={styles.valueLabel}>Valeur totale du stock</Text>
            <Text style={styles.valueNum}>{stats.valeure_totale} DH</Text>
          </View>
          <StockCharts materials={materials} /> 
        </>
      )}

      <Text style={styles.sectionTitle}>Matériaux</Text>
      <TextInput style={styles.search} placeholder="Rechercher un matériau…" value={searchTerm} onChangeText={setSearchTerm} />

      <Text style={styles.filterLabel}>Statut</Text>
      <View style={styles.chips}>
        {STATUS_FILTERS.map((f) => (
          <TouchableOpacity key={f.value} style={[styles.chip, statusFilter === f.value && styles.chipActive]} onPress={() => setStatusFilter(f.value)}>
            <Text style={[styles.chipText, statusFilter === f.value && styles.chipTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.filterLabel}>Catégorie</Text>
      <View style={styles.chips}>
        <TouchableOpacity style={[styles.chip, categoryFilter === '' && styles.chipActive]} onPress={() => setCategoryFilter('')}>
          <Text style={[styles.chipText, categoryFilter === '' && styles.chipTextActive]}>Toutes</Text>
        </TouchableOpacity>
        {CATEGORIES.map((c) => (
          <TouchableOpacity key={c} style={[styles.chip, categoryFilter === c && styles.chipActive]} onPress={() => setCategoryFilter(c)}>
            <Text style={[styles.chipText, categoryFilter === c && styles.chipTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(m) => m.id}
        ListHeaderComponent={Header}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.muted}>Aucun matériau.</Text>}
        renderItem={({ item }) => {
          const s = STATUS[item.status] ?? { label: item.status, color: '#888' };
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={[styles.badge, { backgroundColor: s.color }]}><Text style={styles.badgeText}>{s.label}</Text></View>
              </View>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.info}>Quantité : {item.quantity} {item.unit}</Text>
              <Text style={styles.info}>Seuil : {item.seuilminal}</Text>
              <Text style={styles.info}>Prix : {item.unitPrice} DH</Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 16, backgroundColor: '#f9fafb' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginTop: 16, marginBottom: 10 },
  search: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 9, backgroundColor: '#fff', fontSize: 15, marginBottom: 4 },
  filterLabel: { fontSize: 13, fontWeight: '600', color: '#6b7280', marginTop: 8, marginBottom: 6 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 10, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
  statNum: { fontSize: 20, fontWeight: 'bold' },
  statLabel: { fontSize: 11, color: '#6b7280', marginTop: 2 },
  valueCard: { backgroundColor: '#04266e', borderRadius: 10, padding: 14, marginBottom: 12 },
  valueLabel: { color: '#cbd5e1', fontSize: 12 },
  valueNum: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginTop: 2 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  name: { fontSize: 16, fontWeight: 'bold', flex: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  category: { color: '#6b7280', marginBottom: 6 },
  info: { fontSize: 14, color: '#374151' },
  muted: { color: '#6b7280' },
  error: { color: '#dc2626', marginVertical: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  chipActive: { backgroundColor: '#04266e', borderColor: '#04266e' },
  chipText: { color: '#374151', fontSize: 13 },
  chipTextActive: { color: '#fff' },
});