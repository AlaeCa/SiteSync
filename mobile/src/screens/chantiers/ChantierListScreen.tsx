import React, { useState, useEffect } from 'react';
import {
    View, Text, FlatList, StyleSheet,
    ActivityIndicator, RefreshControl, Alert,
} from 'react-native';
import { chantierService } from '../../services/chantierService';
import { Chantier, StatutChantier } from '../../types/chantier.types';
 
const STATUT_COULEUR: Record<StatutChantier, string> = {
    PLANIFIE: '#6B7280',
    EN_COURS: '#F97316',
    SUSPENDU: '#EF4444',
    TERMINE: '#22C55E',
};
 
export default function ChantierListScreen() {
    const [chantiers, setChantiers] = useState<Chantier[]>([]);
    const [chargement, setChargement] = useState(true);
    const [rafraichissement, setRafraichissement] = useState(false);
 
    async function chargerChantiers() {
        try {
            const data = await chantierService.getAll();
            setChantiers(data);
        } catch (erreur: any) {
            Alert.alert(
                'Erreur de connexion',
                'Impossible de joindre le serveur.\n\n' + erreur.message
            );
        } finally {
            setChargement(false);
            setRafraichissement(false);
        }
        try {
            console.log('=== DÉBUT REQUÊTE ===');
            const data = await chantierService.getAll();
            console.log('=== DONNÉES REÇUES ===', data);
            setChantiers(data);
        } catch (erreur: any) {
            console.log('=== ERREUR ===', erreur.message);
            Alert.alert(
                'Erreur de connexion',
                'Impossible de joindre le serveur.\n\n' + erreur.message
            );
        } finally {
            setChargement(false);
            setRafraichissement(false);
        }
    }
 
    useEffect(() => {
        chargerChantiers();
    }, []);
 
    if (chargement) {
        return (
            <View style={styles.centre}>
                <ActivityIndicator size="large" color="#F97316" />
                <Text style={{ marginTop: 12, color: '#666' }}>Chargement...</Text>
            </View>
        );
    }
 
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Liste des chantiers</Text>
            <Text style={styles.compteur}>{chantiers.length} chantier(s)</Text>
            <FlatList
                data={chantiers}
                keyExtractor={(item) => item.id}
                refreshControl={
                    <RefreshControl
                        refreshing={rafraichissement}
                        onRefresh={() => {
                            setRafraichissement(true);
                            chargerChantiers();
                        }}
                    />
                }
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardNom}>{item.nom}</Text>
                            <View style={[
                                styles.badge,
                                { backgroundColor: STATUT_COULEUR[item.statut] },
                            ]}>
                                <Text style={styles.badgeTexte}>{item.statut}</Text>
                            </View>
                        </View>
                        <Text style={styles.cardVille}>{item.ville}</Text>
                        <Text style={styles.cardAvancement}>
                            Avancement : {item.avancement}%
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}
 
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: 50, paddingHorizontal: 16 },
    centre: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 22, fontWeight: 'bold' },
    compteur: { fontSize: 13, color: '#888', marginBottom: 16, marginTop: 2 },
    card: { backgroundColor: '#F3F4F6', padding: 14, borderRadius: 8, marginBottom: 10 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardNom: { fontSize: 16, fontWeight: 'bold', flex: 1 },
    badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
    badgeTexte: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
    cardVille: { fontSize: 13, color: '#666666', marginTop: 4 },
    cardAvancement: { fontSize: 13, color: '#F97316', fontWeight: 'bold', marginTop: 6 },
});