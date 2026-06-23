import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TaskResponseDto, TaskStatus } from './types';

interface TaskCardProps {
  task: TaskResponseDto;
  onPress: () => void;
}

export function getTaskPriority(task: TaskResponseDto): 'URGENT' | 'MEDIUM' | 'ROUTINE' {
  if ('priority' in task && task.priority) {
    return task.priority as 'URGENT' | 'MEDIUM' | 'ROUTINE';
  }
  
  const now = new Date();
  const deadline = new Date(task.dateFin);
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (task.statut !== TaskStatus.COMPLETED && diffDays <= 1) {
    return 'URGENT';
  } else if (task.statut !== TaskStatus.COMPLETED && diffDays <= 5) {
    return 'MEDIUM';
  }
  return 'ROUTINE';
}

const PRIORITY_THEMES = {
  URGENT: {
    bgClass: 'bg-urgentBg',
    textClass: 'text-white',
    icon: '⚠️',
    label: 'URGENT',
  },
  MEDIUM: {
    bgClass: 'bg-mediumBg',
    textClass: 'text-white',
    icon: '🕒',
    label: 'MEDIUM',
  },
  ROUTINE: {
    bgClass: 'bg-routineBg',
    textClass: 'text-white',
    icon: 'ℹ️',
    label: 'ROUTINE',
  },
};

export default function TaskCard({ task, onPress }: TaskCardProps) {
  const priority = getTaskPriority(task);
  const theme = PRIORITY_THEMES[priority];
  
  const isCompleted = task.statut === TaskStatus.COMPLETED;
  
  const deadlineDate = new Date(task.dateFin);
  const now = new Date();
  const isOverdue = !isCompleted && (
    deadlineDate < now && 
    deadlineDate.toDateString() !== now.toDateString()
  );
  
  const isDueToday = !isCompleted && deadlineDate.toDateString() === now.toDateString();

  const getInitials = (id: string) => {
    const index = parseInt(id.replace(/[^0-9]/g, '') || '0', 10);
    const names = [
      'Jean Dupont', 'Amine Mansour', 'Sarah Bilal', 'Kevin Martin', 
      'Pierre Dubois', 'Sophie Laurent', 'Thomas Petit', 'Lucas Roux'
    ];
    const name = names[index % names.length];
    return name.split(' ').map(p => p[0]).join('');
  };

  const getRole = (id: string) => {
    const index = parseInt(id.replace(/[^0-9]/g, '') || '0', 10);
    const roles = ['Lead Technician', 'Ouvrier Spécialisé', 'Electricien', 'Chef de Chantier'];
    return roles[index % roles.length];
  };

  const assignees = task.assigneA || [];
  const primaryAssignees = assignees.slice(0, 3);
  const remainingCount = assignees.length - primaryAssignees.length;

  const formatDeadline = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <TouchableOpacity 
      className={`bg-surfaceCard rounded-xl p-4 mb-3 shadow border border-gray-200 ${
        isCompleted ? 'opacity-75 bg-gray-50' : ''
      }`}
      activeOpacity={0.8}
      onPress={onPress}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center mb-3">
        <View className={`flex-row items-center px-2 py-1 rounded-md ${theme.bgClass}`}>
          <Text className="text-[12px] mr-1">{theme.icon}</Text>
          <Text className={`text-[10px] font-bold tracking-wider ${theme.textClass}`}>{theme.label}</Text>
        </View>
        <Text className="text-xs font-semibold text-textMuted">ID: T-{task.id.slice(-4).toUpperCase()}</Text>
      </View>

      {/* Body */}
      <View className="mb-3">
        <Text 
          className={`text-base font-bold text-textMain leading-5 mb-1 ${
            isCompleted ? 'line-through text-gray-400' : ''
          }`}
          numberOfLines={2}
        >
          {task.titre}
        </Text>
        
        {task.description ? (
          <Text className="text-xs text-textMuted leading-4 mb-2" numberOfLines={2}>
            {task.description}
          </Text>
        ) : null}

        {/* Assignees */}
        {assignees.length > 0 && (
          <View className="flex-row items-center mt-1.5">
            <View className="flex-row mr-2">
              {primaryAssignees.map((id, index) => (
                <View 
                  key={id} 
                  className={`w-6 h-6 rounded-full justify-center items-center border border-white ${
                    index === 0 ? 'ml-0' : '-ml-2'
                  }`}
                  style={{
                    backgroundColor: ['#FF6B00', '#2B6CB0', '#2F855A', '#B7791F'][index % 4],
                    zIndex: 10 - index 
                  }}
                >
                  <Text className="text-white text-[9px] font-bold">{getInitials(id)}</Text>
                </View>
              ))}
            </View>
            
            <Text className="text-xs text-textMuted font-medium">
              {remainingCount > 0 
                ? `+${remainingCount} ${getRole(assignees[3])}`
                : `${getRole(assignees[0])}`}
            </Text>
          </View>
        )}
      </View>

      {/* Divider */}
      <View className="h-[1px] bg-gray-100 mb-3" />

      {/* Footer */}
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Ionicons 
            name="calendar-outline" 
            size={16} 
            color={isOverdue || isDueToday ? '#DC2626' : '#4B5563'} 
          />
          <Text 
            className={`text-xs font-semibold text-textMuted ml-1.5 ${
              isOverdue || isDueToday ? 'text-urgentBg font-bold' : ''
            }`}
          >
            {isDueToday ? "Aujourd'hui" : isOverdue ? `En retard (${formatDeadline(task.dateFin)})` : formatDeadline(task.dateFin)}
          </Text>
        </View>

        <View className="w-7 h-7 rounded-full bg-orange-50 justify-center items-center">
          <Ionicons 
            name="chevron-forward" 
            size={18} 
            color="#FF6B00" 
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}
