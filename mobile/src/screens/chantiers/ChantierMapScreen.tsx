import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { chantierService } from '../../services/chantierService';
import { Chantier, StatutChantier } from '../../types/chantier.types';

const COULEUR_MARQUEUR: Record<StatutChantier, string> = {
    PLANIFIE: 'gray',
    EN_COURS: 'orange',
    SUSPENDU: 'red',
    TERMINE: 'green',
};

export default function ChantierMapScreen() {
    const [chantiers, setChantiers] = useState<Chantier[]>([]);
    const [chargement, setChargement] = useState(true);

    useEffect(() => {
        chantierService.getAll()
            .then(setChantiers)
            .catch((e) => console.error('Erreur chargement carte :', e))
            .finally(() => setChargement(false));
    }, []);

    if (chargement) {
        return (
            <View style={styles.centre}>
                <ActivityIndicator size="large" color="#F97316" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <MapView
                style={StyleSheet.absoluteFillObject}
                initialRegion={{
                    latitude: 31.7917,
                    longitude: -7.0926,
                    latitudeDelta: 5,
                    longitudeDelta: 5,
                }}
            >
                {chantiers.map((chantier) => (
                    <Marker
                        key={chantier.id}
                        coordinate={{
                            latitude: chantier.latitude,
                            longitude: chantier.longitude,
                        }}
                        pinColor={COULEUR_MARQUEUR[chantier.statut]}
                    >
                        <Callout>
                            <View style={{ width: 180, padding: 6 }}>
                                <Text style={{ fontWeight: 'bold' }}>{chantier.nom}</Text>
                                <Text style={{ color: '#666' }}>{chantier.ville}</Text>
                                <Text style={{ color: '#F97316', marginTop: 4 }}>
                                    Avancement : {chantier.avancement}%
                                </Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    centre: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});