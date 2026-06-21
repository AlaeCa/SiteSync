import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChantierListScreen from '../screens/chantiers/ChantierListScreen';
import ChantierMapScreen from '../screens/chantiers/ChantierMapScreen';

const Tab = createBottomTabNavigator();

export default function ChantierNavigator() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: '#F97316',
                    tabBarInactiveTintColor: '#9CA3AF',
                }}
            >
                <Tab.Screen name="Chantiers" component={ChantierListScreen} />
                <Tab.Screen name="Carte" component={ChantierMapScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}