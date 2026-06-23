import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TaskStatus } from './types';

interface TaskStatusTabsProps {
  selectedStatus: TaskStatus;
  onStatusChange: (status: TaskStatus) => void;
}

export default function TaskStatusTabs({ selectedStatus, onStatusChange }: TaskStatusTabsProps) {
  const tabs = [
    { key: TaskStatus.TO_DO, label: 'À Faire' },
    { key: TaskStatus.IN_PROGRESS, label: 'En Cours' },
    { key: TaskStatus.COMPLETED, label: 'Terminé' },
  ];

  return (
    <View className="flex-row bg-white rounded-lg p-1 border border-gray-200 mx-4 my-3 shadow-sm">
      {tabs.map((tab) => {
        const isActive = selectedStatus === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            className="flex-1 py-2.5 items-center justify-center relative"
            activeOpacity={0.7}
            onPress={() => onStatusChange(tab.key)}
          >
            <Text className={`text-sm font-semibold ${isActive ? 'text-primary font-bold' : 'text-textMuted'}`}>
              {tab.label}
            </Text>
            {isActive && <View className="absolute bottom-[-4px] left-[25%] right-[25%] h-[3px] bg-primary rounded-t" />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
