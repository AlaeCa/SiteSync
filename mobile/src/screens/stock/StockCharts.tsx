import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

type Mat = {
  statut?: string; status?: string;
  category?: string; categorie?: string;
  quantity?: number; quantite?: number;
  unitPrice?: number; prixUnitaire?: number;
};

type Row = { label: string; value: number; color: string };

const PALETTE = ['#2563eb', '#16a34a', '#f58216', '#dc2626', '#7c3aed', '#0891b2', '#ca8a04', '#db2777'];

function Bars({ rows, suffix = '' }: { rows: Row[]; suffix?: string }) {
  if (rows.length === 0) return <Text style={styles.empty}>Aucune donnée.</Text>;
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <View>
      {rows.map((r) => (
        <View key={r.label} style={styles.row}>
          <Text style={styles.label} numberOfLines={1}>{r.label}</Text>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${(r.value / max) * 100}%`, backgroundColor: r.color }]} />
          </View>
          <Text style={styles.count} numberOfLines={1}>{r.value.toLocaleString()}{suffix}</Text>
        </View>
      ))}
    </View>
  );
}

export default function StockCharts({ materials = [] }: { materials?: Mat[] }) {
  const TABS = ['Statut', 'Catégorie', 'Valeur'] as const;
  type TabKey = typeof TABS[number];
  const [tab, setTab] = useState<TabKey>('Statut');

  const norm = (m: Mat) => String(m.statut ?? m.status ?? '').toUpperCase();
  const cat = (m: Mat) => String(m.category ?? m.categorie ?? 'Autre');
  const qty = (m: Mat) => Number(m.quantity ?? m.quantite ?? 0);
  const price = (m: Mat) => Number(m.unitPrice ?? m.prixUnitaire ?? 0);

  const statutRows: Row[] = [
    { label: 'Disponible', value: materials.filter((m) => norm(m) === 'DISPONIBLE').length, color: '#16a34a' },
    { label: 'Faible', value: materials.filter((m) => norm(m) === 'FAIBLE').length, color: '#f58216' },
    { label: 'Rupture', value: materials.filter((m) => ['EN_RUPTURE', 'RUPTURE'].includes(norm(m))).length, color: '#dc2626' },
  ];

  const categorieRows: Row[] = useMemo(() => {
    const map: Record<string, number> = {};
    materials.forEach((m) => { const c = cat(m); map[c] = (map[c] || 0) + 1; });
    return Object.keys(map).map((k, i) => ({ label: k, value: map[k], color: PALETTE[i % PALETTE.length] }));
  }, [materials]);

  const valeurRows: Row[] = useMemo(() => {
    const map: Record<string, number> = {};
    materials.forEach((m) => { const c = cat(m); map[c] = (map[c] || 0) + qty(m) * price(m); });
    return Object.keys(map).map((k, i) => ({ label: k, value: Math.round(map[k]), color: PALETTE[i % PALETTE.length] }));
  }, [materials]);

  const totalValeur = valeurRows.reduce((s, r) => s + r.value, 0);

  return (
    <View style={styles.card}>
      {/* Barre de navigation horizontale */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
        {TABS.map((t) => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabTxt, tab === t && styles.tabTxtActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {tab === 'Statut' && <Bars rows={statutRows} />}
      {tab === 'Catégorie' && <Bars rows={categorieRows} />}
      {tab === 'Valeur' && (
        <>
          <Bars rows={valeurRows} suffix=" MAD" />
          <Text style={styles.total}>Valeur totale : {totalValeur.toLocaleString()} MAD</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginHorizontal: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  tabs: { gap: 8, paddingBottom: 14 },
  tab: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#F1F5F9' },
  tabActive: { backgroundColor: '#FF6B00' },
  tabTxt: { fontSize: 13, fontWeight: '600', color: '#4B5563' },
  tabTxtActive: { color: '#fff' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  label: { width: 80, fontSize: 12, color: '#4B5563' },
  track: { flex: 1, height: 14, backgroundColor: '#F1F5F9', borderRadius: 7, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 7 },
  count: { width: 100, textAlign: 'right', fontSize: 11, fontWeight: '700', color: '#111827' },
  total: { marginTop: 6, fontSize: 13, fontWeight: '700', color: '#111827' },
  empty: { fontSize: 13, color: '#6B7280', paddingVertical: 8 },
});
