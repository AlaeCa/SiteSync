import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FloatingActionButtonProps {
  onPress: () => void;
  iconName?: React.ComponentProps<typeof Ionicons>['name'];
  style?: ViewStyle; // Keeps styling extensibility for overrides
}

export default function FloatingActionButton({ 
  onPress, 
  iconName = 'add', 
  style 
}: FloatingActionButtonProps) {
  return (
    <TouchableOpacity
      className="absolute bottom-6 right-6 bg-primary w-14 h-14 rounded-full justify-center items-center shadow-lg shadow-primary"
      activeOpacity={0.85}
      onPress={onPress}
      style={style}
    >
      <Ionicons name={iconName} size={28} color="#FFFFFF" />
    </TouchableOpacity>
  );
}
