import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Alert, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { taskService } from './taskService';

type RouteParams = RouteProp<RootStackParamList, 'NewRapport'>;

export default function NewRapportScreen() {
  const route = useRoute<RouteParams>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { chantierId, chantierNom } = route.params || { chantierId: 'chantier-1', chantierNom: 'Zone Chantier' };

  const [observations, setObservations] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const requestPermission = async (type: 'camera' | 'library') => {
    if (type === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === 'granted';
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === 'granted';
    }
  };

  const handleTakePick = async (source: 'camera' | 'gallery') => {   
    try {
      const hasPermission = await requestPermission(source === 'camera' ? 'camera' : 'library');
      if (!hasPermission) {
        Alert.alert('Permission refusée', `L'accès à la ${source === 'camera' ? 'caméra' : 'galerie'} est requis pour ajouter des photos.`);
        return;
      }

      let result;
      if (source === 'camera') {
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotos(prev => [...prev, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Image picking error:', error);
      Alert.alert('Erreur', 'Impossible de charger l\'image.');
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async () => {
    if (!observations.trim()) {
      Alert.alert('Champ requis', 'Veuillez saisir vos observations de terrain.');
      return;
    }

    setSubmitting(true);
    try {
      await taskService.createRapport({
        chantierId,
        auteurId: 'u1',
        observations: observations.trim(),
        photos: photos
      });

      Alert.alert(
        'Rapport soumis', 
        'Votre rapport journalier a été enregistré avec succès.',
        [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Échec de la soumission du rapport.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-bgGlobal"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
        {/* Banner */}
        <View className="flex-row items-center bg-white p-3 rounded-lg border border-gray-200 mb-5">
          <Ionicons name="construct" size={20} color="#FF6B00" />
          <Text className="text-sm text-textMuted ml-2.5 font-medium">
            Chantier : <Text className="font-bold text-textMain">{chantierNom}</Text>
          </Text>
        </View>

        {/* Input Text Section */}
        <View className="bg-white rounded-xl p-4 border border-gray-200 mb-5 shadow-sm">
          <Text className="text-sm font-bold text-textMain mb-3">Observations du Terrain</Text>
          <TextInput
            className="bg-gray-50 rounded-md border border-gray-300 p-3 text-sm text-textMain min-h-[120px]"
            multiline
            numberOfLines={6}
            placeholder="Décrivez l'avancement des travaux, les anomalies constatées ou les besoins spécifiques..."
            placeholderTextColor="#9CA3AF"
            value={observations}
            onChangeText={setObservations}
            textAlignVertical="top"
          />
          <Text className="text-[11px] text-gray-400 text-right mt-1.5 font-medium">{observations.length} caractères</Text>
        </View>

        {/* Photos Picker Section */}
        <View className="bg-white rounded-xl p-4 border border-gray-200 mb-5 shadow-sm">
          <Text className="text-sm font-bold text-textMain mb-3">Photos du Chantier</Text>
          
          {/* Pickers Buttons */}
          <View className="flex-row gap-3 mb-4">
            <TouchableOpacity 
              className="flex-1 flex-row items-center justify-center py-2.5 rounded-md border border-primary bg-orange-50/50"
              onPress={() => handleTakePick('camera')}
              activeOpacity={0.8}
            >
              <Ionicons name="camera" size={20} color="#FF6B00" />
              <Text className="text-primary text-xs font-bold ml-2">Prendre Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="flex-1 flex-row items-center justify-center py-2.5 rounded-md border border-primary bg-orange-50/50"
              onPress={() => handleTakePick('gallery')}
              activeOpacity={0.8}
            >
              <Ionicons name="images" size={20} color="#FF6B00" />
              <Text className="text-primary text-xs font-bold ml-2">Galerie</Text>
            </TouchableOpacity>
          </View>

          {/* Photos list layout */}
          {photos.length > 0 ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={{ flexDirection: 'row', paddingVertical: 4 }}
            >
              {photos.map((uri, index) => (
                <View key={index} className="relative mr-3">
                  <Image source={{ uri }} className="w-[90px] h-[90px] rounded-md border border-gray-200" />
                  <TouchableOpacity 
                    className="absolute -top-1 -right-1 bg-red-600 w-5 h-5 rounded-full justify-center items-center border border-white shadow"
                    onPress={() => handleRemovePhoto(index)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View className="border border-gray-200 border-dashed rounded-md h-[90px] justify-center items-center bg-gray-50">
              <Ionicons name="image-outline" size={32} color="#9CA3AF" />
              <Text className="text-xs text-gray-400 font-medium mt-1.5">Aucune photo sélectionnée</Text>
            </View>
          )}
        </View>

        {/* Submit */}
        <View className="mt-2 gap-3">
          <TouchableOpacity 
            className={`flex-row items-center justify-center py-3.5 rounded-lg shadow shadow-primary ${
              submitting ? 'bg-orange-300 shadow-none' : 'bg-primary'
            }`}
            onPress={handleSubmit}
            disabled={submitting}
            activeOpacity={0.8}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="send" size={18} color="#FFFFFF" />
                <Text className="text-white text-sm font-bold ml-2">Soumettre le Rapport</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            className="py-3 items-center"
            onPress={() => navigation.goBack()}
            disabled={submitting}
          >
            <Text className="text-textMuted text-sm font-semibold">Annuler</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
