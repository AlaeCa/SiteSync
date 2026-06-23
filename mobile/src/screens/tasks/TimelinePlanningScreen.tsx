import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity, 
  SafeAreaView, 
  Alert
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Ionicons } from '@expo/vector-icons';

import { taskService } from './taskService';
import { TaskResponseDto, TaskStatus } from './types';

type RouteParams = RouteProp<RootStackParamList, 'TimelinePlanning'>;

export default function TimelinePlanningScreen() {
  const route = useRoute<RouteParams>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { chantierId, chantierNom } = route.params || { chantierId: 'chantier-1', chantierNom: 'Zone Chantier' };

  const [tasks, setTasks] = useState<TaskResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const data = await taskService.getPlanningTasks(chantierId);
        const sorted = data.sort((a, b) => new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime());
        setTasks(sorted);
      } catch (err) {
        Alert.alert('Erreur', 'Impossible de charger le planning.');
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, [chantierId]);

  const formatDateRange = (startStr: string, endStr: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const start = new Date(startStr).toLocaleDateString('fr-FR', options);
    const end = new Date(endStr).toLocaleDateString('fr-FR', options);
    return `${start} au ${end}`;
  };

  const getStatusStyle = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return { color: '#10B981', bgClass: 'bg-emerald-50', icon: 'checkmark-circle', label: 'Terminé' };
      case TaskStatus.IN_PROGRESS:
        return { color: '#FF6B00', bgClass: 'bg-orange-50', icon: 'play-circle', label: 'En Cours' };
      default:
        return { color: '#6B7280', bgClass: 'bg-gray-50', icon: 'ellipse-outline', label: 'Planifié' };
    }
  };

  const getInitials = (id: string) => {
    const index = parseInt(id.replace(/[^0-9]/g, '') || '0', 10);
    const names = ['Jean Dupont', 'Amine Mansour', 'Sarah Bilal', 'Kevin Martin', 'Pierre Dubois'];
    const name = names[index % names.length];
    return name.split(' ').map(p => p[0]).join('');
  };

  const renderTimelineItem = ({ item, index }: { item: TaskResponseDto; index: number }) => {
    const statusTheme = getStatusStyle(item.statut);
    const isLast = index === tasks.length - 1;

    return (
      <View className="flex-row min-h-[100px]">
        {/* Timeline graphics left column */}
        <View className="w-10 items-center relative">
          {/* Vertical line stem */}
          {!isLast && <View className="absolute top-6 bottom-0 w-[2px] bg-gray-200" />}
          {/* Circle indicator */}
          <View 
            className="w-8 h-8 rounded-full border-2 bg-white justify-center items-center z-10"
            style={{ borderColor: statusTheme.color }}
          >
            <Ionicons name={statusTheme.icon as any} size={18} color={statusTheme.color} />
          </View>
        </View>

        {/* Timeline card details right column */}
        <View className="flex-1 pb-5">
          <View className="bg-white rounded-lg p-3.5 border border-gray-200 shadow-sm">
            {/* Top row */}
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-[11px] font-bold text-textMuted">
                {formatDateRange(item.dateDebut, item.dateFin)}
              </Text>
              <View className={`px-1.5 py-0.5 rounded ${statusTheme.bgClass}`}>
                <Text 
                  className="text-[9px] font-bold uppercase"
                  style={{ color: statusTheme.color }}
                >
                  {statusTheme.label}
                </Text>
              </View>
            </View>

            {/* Task Info */}
            <Text className="text-sm font-bold text-textMain mb-1.5">{item.titre}</Text>
            {item.description ? (
              <Text className="text-xs text-textMuted leading-4 mb-2.5">{item.description}</Text>
            ) : null}

            {/* Bottom row: Assignees list */}
            {item.assigneA && item.assigneA.length > 0 && (
              <View className="flex-row items-center mt-1">
                <Text className="text-[11px] text-textMuted font-semibold mr-1.5">Équipe :</Text>
                <View className="flex-row">
                  {item.assigneA.map((id, idx) => (
                    <View 
                      key={id} 
                      className={`w-5 h-5 rounded-full border border-white justify-center items-center ${
                        idx === 0 ? 'ml-0' : '-ml-1.5'
                      }`}
                      style={{ 
                        backgroundColor: ['#4A5568', '#2B6CB0', '#2F855A', '#FF6B00'][idx % 4],
                        zIndex: 5 - idx
                      }}
                    >
                      <Text className="text-white text-[7px] font-bold">{getInitials(id)}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-bgGlobal">
      {/* Chantier Header */}
      <View className="bg-white p-4 border-b border-gray-200 flex-row justify-between items-center flex-wrap gap-3">
        <View className="flex-row items-center">
          <Ionicons name="construct" size={24} color="#FF6B00" />
          <View className="ml-3">
            <Text className="text-base font-bold text-textMain">{chantierNom}</Text>
            <Text className="text-[12px] text-textMuted font-medium mt-0.5">Suivi chronologique des jalons</Text>
          </View>
        </View>

        <TouchableOpacity 
          className="bg-primary flex-row items-center px-3 py-2 rounded-md shadow shadow-primary"
          onPress={() => navigation.navigate('NewRapport', { chantierId, chantierNom })}
          activeOpacity={0.8}
        >
          <Ionicons name="document-text-outline" size={18} color="#FFFFFF" />
          <Text className="text-white text-xs font-bold ml-1.5">Nouveau Rapport</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center p-5">
          <ActivityIndicator size="large" color="#FF6B00" />
          <Text className="mt-3 text-textMuted text-sm font-medium">Génération de la frise chronologique...</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTimelineItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <Ionicons name="calendar-outline" size={60} color="#CBD5E0" />
              <Text className="text-sm text-textMuted font-medium mt-3">Aucune tâche programmée sur ce chantier.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
