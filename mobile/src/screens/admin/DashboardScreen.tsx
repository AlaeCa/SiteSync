import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  ChantierStatsDTO,
  getDashboardKPIs,
  KPIsDashboardDTO,
} from './adminService';

const COLORS = {
  primary: '#FF6B00',
  primarySoft: '#FFE4D1',
  navy: '#1E293B',
  background: '#F8FAFC',
  card: '#FFFFFF',
  success: '#16A34A',
  successBg: '#DCFCE7',
  danger: '#EF4444',
  dangerBg: '#FEE2E2',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  border: '#E2E8F0',
};

// Module 5 does not yet expose a workforce metric, kept as a static display value.
const MOCK_ACTIVE_WORKFORCE = 248;

const MOCK_WEEKLY_ACTIVITY: { label: string; value: number }[] = [
  { label: 'L', value: 0.4 },
  { label: 'M', value: 0.65 },
  { label: 'M', value: 0.5 },
  { label: 'J', value: 0.8 },
  { label: 'V', value: 0.95 },
  { label: 'S', value: 0.3 },
  { label: 'D', value: 0.15 },
];

// Used only when the API has no chantiers yet, mirroring the backend mock fallback.
const MOCK_PROJECTS: ChantierStatsDTO[] = [
  {
    chantierId: 'mock-1',
    nom: 'Residence Al Manar',
    statut: 'EN_COURS',
    dateDebut: '2026-01-10',
    dateFinPrevue: '2026-07-15',
    dateFinReelle: null,
    budgetPrevisionnel: 1200000,
    coutReel: 980000,
    ecartBudgetaire: -220000,
    tauxAvancement: 68,
    retardEnJours: 0,
    nombreTaches: 42,
    tachesTerminees: 29,
    tachesEnRetard: 1,
  },
  {
    chantierId: 'mock-2',
    nom: 'Tour Atlas Business',
    statut: 'EN_COURS',
    dateDebut: '2025-09-01',
    dateFinPrevue: '2026-05-01',
    dateFinReelle: null,
    budgetPrevisionnel: 3000000,
    coutReel: 3380000,
    ecartBudgetaire: 380000,
    tauxAvancement: 54,
    retardEnJours: 12,
    nombreTaches: 80,
    tachesTerminees: 38,
    tachesEnRetard: 9,
  },
];

function formatCurrency(value: number): string {
  return `${Math.round(value).toLocaleString('fr-FR')} DH`;
}

function StatusBadge({ retardEnJours }: { retardEnJours: number }) {
  const delayed = retardEnJours > 0;
  return (
    <View style={[styles.statusBadge, delayed ? styles.statusBadgeDanger : styles.statusBadgeSuccess]}>
      <Text style={[styles.statusBadgeText, delayed ? styles.statusTextDanger : styles.statusTextSuccess]}>
        {delayed ? 'En retard' : 'A jour'}
      </Text>
    </View>
  );
}

function ProjectCard({ project }: { project: ChantierStatsDTO }) {
  const progress = Math.min(100, Math.max(0, project.tauxAvancement));
  const idBadge = project.chantierId.slice(-4).toUpperCase();

  return (
    <View style={styles.projectCard}>
      <View style={styles.projectHeaderRow}>
        <View style={styles.idBadge}>
          <Text style={styles.idBadgeText}>#{idBadge}</Text>
        </View>
        <Text style={styles.projectName} numberOfLines={1}>
          {project.nom}
        </Text>
        <StatusBadge retardEnJours={project.retardEnJours} />
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <View style={styles.projectFooterRow}>
        <Text style={styles.projectFooterText}>{progress.toFixed(0)}% complete</Text>
        <Text style={styles.projectFooterText}>
          {formatCurrency(project.coutReel)} / {formatCurrency(project.budgetPrevisionnel)}
        </Text>
      </View>
    </View>
  );
}

function WeeklySummary() {
  return (
    <View style={styles.weeklyCard}>
      <Text style={styles.sectionTitle}>Resume hebdomadaire</Text>
      <View style={styles.weeklyChartRow}>
        {MOCK_WEEKLY_ACTIVITY.map((day, index) => (
          <View key={`${day.label}-${index}`} style={styles.weeklyBarColumn}>
            <View style={styles.weeklyBarTrack}>
              <View style={[styles.weeklyBarFill, { height: `${day.value * 100}%` }]} />
            </View>
            <Text style={styles.weeklyBarLabel}>{day.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function DashboardScreen() {
  const [kpis, setKpis] = useState<KPIsDashboardDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const data = await getDashboardKPIs();
      setKpis(data);
      setError(null);
    } catch {
      setError('Impossible de charger les indicateurs.');
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadData();
      setLoading(false);
    })();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const projects = kpis?.chantiersEnRetardDetails?.length ? kpis.chantiersEnRetardDetails : MOCK_PROJECTS;
  const coutTotalReel = kpis?.coutTotalReel ?? 0;
  const depassement = kpis?.depassementBudgetairePourcentage ?? 0;
  const overBudget = depassement > 0;

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tableau de bord</Text>
        <Text style={styles.headerSubtitle}>Vue d&apos;ensemble des chantiers</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.metricsRow}>
          <View style={[styles.metricCard, styles.metricCardLight]}>
            <Text style={styles.metricLabel}>Projets actifs</Text>
            <Text style={[styles.metricValue, { color: COLORS.primary }]}>
              {kpis?.chantiersActifs ?? '--'}
            </Text>
            <Text style={styles.metricSubtext}>{kpis?.totalChantiers ?? 0} au total</Text>
          </View>

          <View style={[styles.metricCard, styles.metricCardLight]}>
            <Text style={styles.metricLabel}>Cout vs Budget</Text>
            <Text style={[styles.metricValue, { color: overBudget ? COLORS.danger : COLORS.success }]}>
              {overBudget ? '+' : ''}
              {depassement.toFixed(1)}%
            </Text>
            <Text style={styles.metricSubtext}>{formatCurrency(coutTotalReel)}</Text>
          </View>

          <View style={[styles.metricCard, styles.metricCardDark]}>
            <Text style={styles.metricLabelDark}>Effectif actif</Text>
            <Text style={styles.metricValueDark}>{MOCK_ACTIVE_WORKFORCE}</Text>
            <Text style={styles.metricSubtextDark}>ouvriers</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Chantiers</Text>
            <View style={styles.sectionCountBadge}>
              <Text style={styles.sectionCountText}>{projects.length}</Text>
            </View>
          </View>

          {projects.map((project) => (
            <ProjectCard key={project.chantierId} project={project} />
          ))}
        </View>

        <WeeklySummary />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.navy,
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#CBD5E1',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  errorBanner: {
    backgroundColor: COLORS.dangerBg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  errorBannerText: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: '600',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: -36,
  },
  metricCard: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    minHeight: 96,
    justifyContent: 'space-between',
  },
  metricCardLight: {
    backgroundColor: COLORS.card,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  metricCardDark: {
    backgroundColor: COLORS.navy,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  metricSubtext: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  metricLabelDark: {
    fontSize: 11,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  metricValueDark: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  metricSubtextDark: {
    fontSize: 10,
    color: '#94A3B8',
  },
  section: {
    marginTop: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  sectionCountBadge: {
    backgroundColor: COLORS.primarySoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  sectionCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  projectCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  projectHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  idBadge: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  idBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  projectName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusBadgeSuccess: {
    backgroundColor: COLORS.successBg,
  },
  statusBadgeDanger: {
    backgroundColor: COLORS.dangerBg,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusTextSuccess: {
    color: COLORS.success,
  },
  statusTextDanger: {
    color: COLORS.danger,
  },
  progressTrack: {
    marginTop: 12,
    height: 8,
    borderRadius: 999,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: COLORS.primary,
  },
  projectFooterRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  projectFooterText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  weeklyCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  weeklyChartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 16,
    height: 110,
  },
  weeklyBarColumn: {
    flex: 1,
    alignItems: 'center',
  },
  weeklyBarTrack: {
    width: 14,
    height: 88,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  weeklyBarFill: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  weeklyBarLabel: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
});
