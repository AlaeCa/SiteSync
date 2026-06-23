import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import MainTabs from './MainTabs';
import TimelinePlanningScreen from '../screens/tasks/TimelinePlanningScreen';
import NewRapportScreen from '../screens/tasks/NewRapportScreen';

import NotificationCenterScreen from '../screens/admin/NotificationCenterScreen';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Profile: undefined;
  Main: undefined;
  TimelinePlanning: { chantierId: string; chantierNom: string };
  NewRapport: { chantierId: string; chantierNom: string };
  Notifications: undefined; 
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('token');
    setIsLoggedIn(!!token);
  };

  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' }}>
        <ActivityIndicator size="large" color="#ff6b35" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isLoggedIn ? 'Main' : 'Login'}
        screenOptions={{
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTintColor: '#111827',
          headerTitleStyle: { fontWeight: '700', fontSize: 18 },
          contentStyle: { backgroundColor: '#F4F7F9' },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Notifications" component={NotificationCenterScreen} options={{ headerShown: true, title: 'Notifications', presentation: 'modal' }}/>
        <Stack.Screen
          name="TimelinePlanning"
          component={TimelinePlanningScreen}
          options={({ route }) => ({
            title: route.params?.chantierNom ? `Planning: ${route.params.chantierNom}` : 'Planning & Suivi',
          })}
        
          
        />
        <Stack.Screen
          name="NewRapport"
          component={NewRapportScreen}
          options={{ title: 'Soumettre un Rapport', presentation: 'modal' }}
        />

        
      </Stack.Navigator>
    </NavigationContainer>
  );
}