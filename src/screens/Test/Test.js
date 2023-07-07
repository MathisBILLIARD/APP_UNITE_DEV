import React, { useState, useEffect } from 'react';
import {
    Appearance, ActivityIndicator, useColorScheme, View, Text, StyleSheet, ClipboardStatic, Pressable, ScrollView, Alert, Button, SafeAreaView, StatusBar, NativeModules, TouchableOpacity, Platform, Clipboard
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as NavigationBar from "expo-navigation-bar";
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import NavigationBarColor from 'react-native-navigation-bar-color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";



const TestScreen = () => {

    const navigation = useNavigation();

    const colorScheme = useColorScheme();

    const getBackgroundColor = () => {
        if (colorScheme === 'dark') {
            return 'white'; // Fond noir pour le thème sombre
        } else {
            return 'black'; // Fond blanc pour le thème clair
        }
    };


    const { NavigationBarColor } = NativeModules;


    useEffect(() => {
        StatusBar.setBarStyle('light-content', true);
        StatusBar.setBackgroundColor('#0996AE');
    }, []);

    const handleSetToRed = () => {
        NavigationBarColor.changeNavigationBarColor('#FF0000');
    };

    const handleSetToGreen = () => {
        NavigationBarColor.changeNavigationBarColor('#00FF00');
    };

    const handleSetToBlue = () => {
        NavigationBarColor.changeNavigationBarColor('#0000FF');
    };




    const [userInfo, setUserInfo] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserInfo();
    }, []);

    // récupérer les infos d'un utilisateur deja connecté 
    const getUserInfo = async () => {
        try {
            console.log("Récupération des informations")
            const userInfoData = await AsyncStorage.getItem('userInfo');
            if (userInfoData) {
                const userInfo = JSON.parse(userInfoData);
                console.log(userInfo);
                setUserInfo(userInfo);
                setLoading(false);
            }
        } catch (error) {
            console.log('Erreur lors de la récupération des informations utilisateur :', error);
            setLoading(false);
        }
    };


    // copier le code de parrainage
    const handleCopy = () => {
        Clipboard.setString(userInfo.referralcode);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="red" />
                <Text style={styles.loadingText}>Chargement des informations...</Text>
            </View>
        );
    }


    return (
        <SafeAreaView style={[styles.root, { backgroundColor: getBackgroundColor() }]}>
            <Text style={styles.text}> Connecté </Text>
            {userInfo ? (
                <>
                    <Text style={styles.text}>Email: {userInfo.email}</Text>
                    <Text style={styles.text}>Referral Code: {userInfo.referralcode}</Text>
                    <TouchableOpacity onPress={handleCopy}>
                        <Text style={styles.text}>Copy</Text>
                    </TouchableOpacity>
                    <Text style={styles.text}>Achète ta soirée !</Text>
                    <CustomInput
                        placeholder="Email"
                        value={email}
                        setValue={setEmail}
                        secureTextEntry={false}
                    />
                </>
            ) : (
                <Text style={styles.text}>Aucune information utilisateur trouvée.</Text>
            )}
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 200,
        backgroundColor: 'black',
    },
    text: {
        color: 'white',
        fontSize: 20
    }
});

export default TestScreen;
