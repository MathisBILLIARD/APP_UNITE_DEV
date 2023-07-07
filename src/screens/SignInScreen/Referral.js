import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, TextInput, Modal } from 'react-native';

const ReferralScreen = () => {
    const [referralCode, setReferralCode] = useState('');
    const [isReferralApplied, setIsReferralApplied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleApplyReferral = () => {
        setIsLoading(true);

        // Simuler un délai de chargement de 2 secondes
        setTimeout(() => {
            // Vérifier si le code de parrainage est valide et appliquer les actions appropriées
            if (referralCode === 'ABC') {
                setIsReferralApplied(true);
                Alert.alert('Parrainage appliqué', 'Vous avez appliqué le code de parrainage ' + referralCode + ' avec succès !!');
            } else {
                Alert.alert('Code de parrainage invalide', 'Le code de parrainage ' + referralCode + ' que vous avez saisi est invalide.');
            }

            setIsLoading(false);
        }, 2000);
    };

    return (
        <View style={styles.container}>
            <Modal transparent={true} visible={isLoading}>
                <View style={styles.loadingContainer}>
                    <View style={styles.loadingWrapper}>
                        <ActivityIndicator size="large" color="blue" />
                        <Text style={styles.loadingText}>Chargement en cours...</Text>
                    </View>
                </View>
            </Modal>

            <View style={[styles.content, isLoading && styles.blurred]}>
                {isReferralApplied ? (
                    <View>
                        <Text style={styles.text}>Parrainage appliqué !</Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => setIsReferralApplied(false)}
                        >
                            <Text style={styles.buttonText}>Retour au menu</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View>
                        <Text style={styles.text}>Entrez le code de parrainage :</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={text => setReferralCode(text)}
                            value={referralCode}
                        />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleApplyReferral}
                        >
                            <Text style={styles.buttonText}>Appliquer</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    content: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 3,
    },
    blurred: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(5px)',
    },
    text: {
        fontSize: 18,
        marginBottom: 10,
    },
    input: {
        height: 40,
        width: 200,
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 10,
    },
    button: {
        backgroundColor: 'blue',
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    loadingWrapper: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
    },
});

export default ReferralScreen;
