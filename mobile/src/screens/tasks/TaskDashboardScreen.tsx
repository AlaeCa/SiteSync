import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  Alert, 
  RefreshControl,
  SafeAreaView
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

import TaskStatusTabs from './TaskStatusTabs';
import TaskCard from './TaskCard';
import FloatingActionButton from './FloatingActionButton';
import { taskService } from './taskService';
import { TaskResponseDto, TaskStatus } from './types';

export default function TaskDashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [tasks, setTasks] = useState<TaskResponseDto[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>(TaskStatus.TO_DO);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTasks = async (showLoadingIndicator = true) => {
    if (showLoadingIndicator) setLoading(true);
    try {
      const fetchedTasks = await taskService.getTasks();
      setTasks(fetchedTasks);
    } catch (error:any) {
      console.error('LOAD TASKS ERROR', error?.response?.status, error?.config?.url, error?.message, JSON.stringify(error?.response?.data));
      Alert.alert('Erreur', 'Impossible de charger les tâches.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTasks(false);
    }, [])
  );

  useEffect(() => {
    loadTasks(true);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadTasks(false);
  };

  const handleTaskPress = (task: TaskResponseDto) => {
    Alert.alert(
      "Statut de la tâche",
      `Tâche: "${task.titre}"\n\nModifier l'avancement :`,
      [
        { 
          text: task.statut === TaskStatus.TO_DO ? "À Faire 🔘 (Actuel)" : "À Faire 🔘", 
          onPress: () => changeStatus(task.id, TaskStatus.TO_DO),
        },
        { 
          text: task.statut === TaskStatus.IN_PROGRESS ? "En Cours 🟠 (Actuel)" : "En Cours 🟠", 
          onPress: () => changeStatus(task.id, TaskStatus.IN_PROGRESS),
        },
        { 
          text: task.statut === TaskStatus.COMPLETED ? "Terminé ✅ (Actuel)" : "Terminé ✅", 
          onPress: () => changeStatus(task.id, TaskStatus.COMPLETED),
        },
        { 
          text: "Voir Planning 📅", 
          onPress: () => navigation.navigate('TimelinePlanning', { 
            chantierId: task.chantierId,
            chantierNom: task.chantierId === 'chantier-1' ? 'Zone Résidentielle Nord' : 'Rénovation Centre Ville'
          }) 
        },
        { text: "Annuler", style: "cancel" }
      ]
    );
  };

  const changeStatus = async (id: string, newStatus: TaskStatus) => {
    try {
      await taskService.updateTaskStatus(id, newStatus);
      loadTasks(false);
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de modifier le statut de la tâche.');
    }
  };

  const filteredTasks = tasks.filter(task => task.statut === selectedStatus);

  const getStatusSummary = () => {
    const todo = tasks.filter(t => t.statut === TaskStatus.TO_DO).length;
    const progress = tasks.filter(t => t.statut === TaskStatus.IN_PROGRESS).length;
    const done = tasks.filter(t => t.statut === TaskStatus.COMPLETED).length;
    return `${todo} à faire • ${progress} en cours • ${done} terminées`;
  };

  return (
    <SafeAreaView className="flex-1 bg-bgGlobal">
      {/* Header Summary */}
      <View className="bg-white px-4 pt-4 pb-3 border-b border-gray-200">
        <Text className="text-[12px] font-bold text-primary uppercase tracking-wider mb-1">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </Text>
        <Text className="text-xl font-extrabold text-textMain mb-1">Mes Tâches du Jour</Text>
        <Text className="text-xs text-textMuted font-medium">{getStatusSummary()}</Text>
      </View>

      {/* Tabs */}
      <TaskStatusTabs 
        selectedStatus={selectedStatus} 
        onStatusChange={setSelectedStatus} 
      />

      {/* Loader */}
      {loading ? (
        <View className="flex-1 justify-center items-center p-5">
          <ActivityIndicator size="large" color="#FF6B00" />
          <Text className="mt-3 text-textMuted text-sm font-medium">Chargement des tâches...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskCard 
              task={item} 
              onPress={() => handleTaskPress(item)} 
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 90 }}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={handleRefresh}
              colors={['#FF6B00']}
              tintColor="#FF6B00"
            />
          }
          ListEmptyComponent={
            <View className="items-center justify-center py-14 px-5">
              <Text className="text-5xl mb-4">
                {selectedStatus === TaskStatus.COMPLETED ? '🎉' : '📝'}
              </Text>
              <Text className="text-sm text-textMuted text-center leading-5 font-medium">
                {selectedStatus === TaskStatus.COMPLETED 
                  ? 'Aucune tâche complétée pour le moment.'
                  : selectedStatus === TaskStatus.IN_PROGRESS 
                  ? 'Aucune tâche en cours d\'exécution.'
                  : 'Toutes les tâches prévues sont lancées ou terminées !'}
              </Text>
            </View>
          }
        />
      )}

      {/* FAB */}
      <FloatingActionButton 
        onPress={() => navigation.navigate('NewRapport', { 
          chantierId: 'chantier-1',
          chantierNom: 'Zone Résidentielle Nord'
        })} 
        iconName="document-text"
      />
    </SafeAreaView>
  );
}
