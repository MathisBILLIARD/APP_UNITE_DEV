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

    const [userInfo, setUserInfo] = useState('');
    const [loading, setLoading] = useState(true);
    const [referralCode, setReferralCode] = useState('');
    const [allReferralCode, setAllReferralCode] = useState('');


    // lance la récupération des utilisateurs
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
            setLoading(true);
        }
    };


    // copier le code de parrainage
    const handleCopy = () => {
        Clipboard.setString(userInfo.referralcode);
    };

    // si il y a un problème de chargement
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="red" />
                <Text style={styles.loadingText}>Chargement des informations...</Text>
            </View>
        );
    }

    const onBuyParty = (referralCode) => {

        console.log("Referral Code:", referralCode);
        //récup les emails afin de de pas créer de double compte
        const UrlAllReferralCode = "http://195.20.234.70:3000/connexion/code";
        var requestOptions = {
            method: "GET",
            redirect: "follow",
        };
        fetch(UrlAllReferralCode, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                const allReferralCode = JSON.parse(result);
                console.log(allReferralCode);
                setAllReferralCode(allReferralCode);
                for (let i = 0; i < allReferralCode.length; i++) {
                    if (referralCode == allReferralCode[i]) {
                        console.log("ON A TROUVE UN CODE QUI EXISTE DANS LA BASE")
                        console.log(allReferralCode[i])
                        const UrlAllReferralCode = "http://195.20.234.70:3000/connexion/client/" + referralCode;
                        var requestOptions = {
                            method: "GET",
                            redirect: "follow",
                        };
                        fetch(UrlAllReferralCode, requestOptions)
                            .then((response) => response.text())
                            .then((result) => {
                                console.log("affichage info");
                                const allInfoUser = JSON.parse(result);
                                console.log(allInfoUser)
                                let nbrParrainage = parseInt(allInfoUser.numberParrainage);
                                nbrParrainage = nbrParrainage + 1;
                                console.log("le nombre de parrainage changé ! :")
                                console.log(nbrParrainage)
                                console.log(allInfoUser.id)

                                let data = JSON.stringify({
                                    "numberParrainage": nbrParrainage
                                });

                                const UrlUpdateNbrParrainage = "http://195.20.234.70:3000/connexion/" + allInfoUser.id;


                                const requestOptions = {
                                    method: "PATCH",
                                    redirect: "follow",
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: data
                                };

                                fetch(UrlUpdateNbrParrainage, requestOptions)
                                    .then((response) => response.text())
                                    .then((result) => {
                                        console.log("C'EST CHANGE CHEF ! ");
                                    })
                                    .catch((error) => console.log("error", error));


                            })
                            .catch((error) => console.log("error", error));
                        break;
                    }
                    // GET http://195.20.234.70:3000/connexion/client/VIP1390
                    // PATCH  http://195.20.234.70:3000/connexion/28 NUMBER PARAINNAGE +1 
                }

            })
            .catch((error) => console.log("error", error));
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
                        placeholder="Code de parrainage ?"
                        value={referralCode}
                        setValue={setReferralCode}
                        secureTextEntry={false}
                    />

                    <CustomButton
                        text="Register"
                        onPress={() => onBuyParty(referralCode)}
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
