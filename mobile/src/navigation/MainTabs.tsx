import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ProfileScreen from '../screens/profile/ProfileScreen';
import TaskDashboardScreen from '../screens/tasks/TaskDashboardScreen';
import StockScreen from '../screens/stock/StockScreen';
import ChantierListScreen from '../screens/chantier/ChantierListScreen';
import ChantierMapScreen from '../screens/chantier/ChantierMapScreen';
import DashboardScreen from '../screens/admin/DashboardScreen';

// --- Module Chantier/Carte : menu EN BAS (Chantier | Carte) ---
function MapModule() {
  const [vue, setVue] = useState<'chantier' | 'carte'>('chantier');
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {vue === 'chantier' ? <ChantierListScreen /> : <ChantierMapScreen />}
      </View>
      <View style={mapMenuStyles.bar}>
        <TouchableOpacity style={mapMenuStyles.btn} onPress={() => setVue('chantier')}>
          <Ionicons
            name={vue === 'chantier' ? 'list' : 'list-outline'}
            size={22}
            color={vue === 'chantier' ? '#F97316' : '#9CA3AF'}
          />
          <Text style={[mapMenuStyles.txt, vue === 'chantier' && mapMenuStyles.txtActive]}>Chantier</Text>
        </TouchableOpacity>
        <TouchableOpacity style={mapMenuStyles.btn} onPress={() => setVue('carte')}>
          <Ionicons
            name={vue === 'carte' ? 'map' : 'map-outline'}
            size={22}
            color={vue === 'carte' ? '#F97316' : '#9CA3AF'}
          />
          <Text style={[mapMenuStyles.txt, vue === 'carte' && mapMenuStyles.txtActive]}>Carte</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export type MainTabParamList = {
  Profile: undefined;
  Tasks: undefined;
  Stock: undefined;
  Map: undefined;
  KPIs: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  const [role, setRole] = useState<string | null>(null);
  useEffect(() => { AsyncStorage.getItem('userRole').then(setRole); }, []);
  const isAdmin = role === 'ADMIN'; // ⚠️ adapte si besoin

  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        // En-tête global bleu + cloche de notifications
        headerStyle: { backgroundColor: '#04266e' },
        headerTintColor: '#fff',
        headerTitleStyle: { color: '#fff' },
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}
            style={{ marginRight: 16 }}
          >
            <Ionicons name="notifications-outline" size={24} color="#fff" />
          </TouchableOpacity>
        ),
        // Icônes du menu d'onglets
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: React.ComponentProps<typeof Ionicons>['name'] = 'alert-circle';
          if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          else if (route.name === 'Tasks') iconName = focused ? 'clipboard' : 'clipboard-outline';
          else if (route.name === 'Stock') iconName = focused ? 'cube' : 'cube-outline';
          else if (route.name === 'Map') iconName = focused ? 'map' : 'map-outline';
          else if (route.name === 'KPIs') iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B00',
        tabBarInactiveTintColor: '#4B5563',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      })}
    >
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
      <Tab.Screen name="Tasks" component={TaskDashboardScreen} options={{ title: 'Mes Tâches' }} />
      <Tab.Screen name="Stock" component={StockScreen} options={{ title: 'Stock' }} />
      <Tab.Screen name="Map" component={MapModule} options={{ title: 'Carte' }} />
      <Tab.Screen
        name="KPIs"
        component={DashboardScreen}
        options={{ title: 'KPIs', tabBarItemStyle: isAdmin ? undefined : { display: 'none' } }}
      />
    </Tab.Navigator>
  );
}

const mapMenuStyles = StyleSheet.create({
  bar: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingVertical: 4 },
  btn: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 6 },
  txt: { fontSize: 11, color: '#9CA3AF', fontWeight: '600', marginTop: 2 },
  txtActive: { color: '#F97316' },
});
