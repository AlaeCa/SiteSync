import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NotificationDTO } from './adminService';

const COLORS = {
  primary: '#FF6B00',
  primarySoft: '#FFE4D1',
  navy: '#1E293B',
  background: '#F8FAFC',
  card: '#FFFFFF',
  warning: '#F59E0B',
  danger: '#EF4444',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  border: '#E2E8F0',
  unreadBg: '#FFF7ED',
};

// Module 5's API only exposes POST /notifications/broadcast today, so listing
// and read/unread state are managed locally until a list endpoint ships.
const MOCK_NOTIFICATIONS: NotificationDTO[] = [
  {
    id: '1',
    type: 'RETARD',
    message: 'Le chantier "Tour Atlas Business" depasse son delai de 12 jours.',
    destinataires: ['chef-projet'],
    lu: false,
    createdAt: '2026-06-19T09:12:00',
  },
  {
    id: '2',
    type: 'BUDGET',
    message: 'Depassement budgetaire detecte sur "Tour Atlas Business" (+12.6%).',
    destinataires: ['chef-projet', 'direction'],
    lu: false,
    createdAt: '2026-06-18T16:45:00',
  },
  {
    id: '3',
    type: 'STOCK',
    message: 'Niveau de stock critique pour le ciment sur "Residence Al Manar".',
    destinataires: ['responsable-stock'],
    lu: true,
    createdAt: '2026-06-17T08:30:00',
  },
  {
    id: '4',
    type: 'INFO',
    message: 'Rapport hebdomadaire genere avec succes.',
    destinataires: ['chef-projet'],
    lu: true,
    createdAt: '2026-06-15T18:00:00',
  },
];

const TYPE_COLORS: Record<string, string> = {
  RETARD: COLORS.danger,
  BUDGET: COLORS.warning,
  STOCK: COLORS.warning,
  INFO: COLORS.primary,
};

function formatDate(value: string): string {
  const date = new Date(value);
  const day = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  const time = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return `${day} - ${time}`;
}

function NotificationRow({
  notification,
  onToggleRead,
}: {
  notification: NotificationDTO;
  onToggleRead: (id: string) => void;
}) {
  const dotColor = TYPE_COLORS[notification.type] ?? COLORS.primary;

  return (
    <TouchableOpacity
      style={[styles.row, !notification.lu && styles.rowUnread]}
      activeOpacity={0.7}
      onPress={() => onToggleRead(notification.id)}
    >
      <View style={[styles.indicator, { backgroundColor: dotColor }]} />

      <View style={styles.rowContent}>
        <Text style={styles.rowType}>{notification.type}</Text>
        <Text style={styles.rowMessage} numberOfLines={2}>
          {notification.message}
        </Text>
        <Text style={styles.rowDate}>{formatDate(notification.createdAt)}</Text>
      </View>

      <View style={[styles.readBadge, notification.lu ? styles.readBadgeRead : styles.readBadgeUnread]}>
        <Text style={[styles.readBadgeText, notification.lu ? styles.readBadgeTextRead : styles.readBadgeTextUnread]}>
          {notification.lu ? 'Lu' : 'Non lu'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function NotificationCenterScreen() {
  const [notifications, setNotifications] = useState<NotificationDTO[]>(MOCK_NOTIFICATIONS);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.lu).length, [notifications]);

  const toggleRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, lu: !n.lu } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, lu: true })));
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSubtitle}>
            {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}` : 'Tout est lu'}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.markAllButton, unreadCount === 0 && styles.markAllButtonDisabled]}
          onPress={markAllAsRead}
          disabled={unreadCount === 0}
        >
          <Text style={styles.markAllButtonText}>Tout marquer lu</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => <NotificationRow notification={item} onToggleRead={toggleRead} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Aucune notification</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  markAllButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  markAllButtonDisabled: {
    backgroundColor: '#475569',
  },
  markAllButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  separator: {
    height: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  rowUnread: {
    backgroundColor: COLORS.unreadBg,
    borderColor: COLORS.primarySoft,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 5,
    marginRight: 12,
  },
  rowContent: {
    flex: 1,
    marginRight: 10,
  },
  rowType: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  rowMessage: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textPrimary,
    lineHeight: 18,
  },
  rowDate: {
    marginTop: 6,
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  readBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  readBadgeUnread: {
    backgroundColor: COLORS.primarySoft,
  },
  readBadgeRead: {
    backgroundColor: COLORS.background,
  },
  readBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  readBadgeTextUnread: {
    color: COLORS.primary,
  },
  readBadgeTextRead: {
    color: COLORS.textMuted,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 64,
  },
  emptyStateText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
});
