import React, { useState, useEffect } from 'react';
import {
    Appearance, ActivityIndicator, Image, useColorScheme, View, Text, StyleSheet, ClipboardStatic, Pressable, ScrollView, Alert, Button, SafeAreaView, StatusBar, NativeModules, TouchableOpacity, Platform, Clipboard
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as NavigationBar from "expo-navigation-bar";
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import NavigationBarColor from 'react-native-navigation-bar-color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";



const TestScreen = () => {

    // VARIABLES

    const [userInfo, setUserInfo] = useState('');
    const [loading, setLoading] = useState(true);
    const [referralCode, setReferralCode] = useState('');
    const [allReferralCode, setAllReferralCode] = useState('');
    const [infoParty, setInfoParty] = useState([]); // Parties disponibles
    const [imageURL, setImageURL] = useState('');

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


    // lance la récupération des utilisateurs
    // lance la récupération des partyyy
    useEffect(() => {
        getUserInfo();
        getPartyInfo();
    }, []);

    // récupérer les infos d'un utilisateur deja connecté 
    const getUserInfo = async () => {
        try {
            console.log("Récupération des informations");
            const userInfoData = await AsyncStorage.getItem('userInfo');
            if (userInfoData) {
                const userInfo = JSON.parse(userInfoData);
                const userInfoURL = `http://195.20.234.70:3000/connexion/${userInfo.email}`;
                var requestOptionsInfoUser = {
                    method: "GET",
                    redirect: "follow",
                };
                try {
                    const response = await fetch(userInfoURL, requestOptionsInfoUser);
                    const result = await response.json();
                    console.log("les infos balancées dans le JSON");
                    console.log(result);
                    setUserInfo(result);
                    AsyncStorage.setItem('userInfo', JSON.stringify(result))
                        .then(() => {
                            console.log('Informations utilisateur enregistrées avec succès.');
                        })
                        .catch((error) => {
                            console.log('Erreur lors de l\'enregistrement des informations utilisateur :', error);
                        });
                } catch (error) {
                    console.log("Erreur lors de la requête :", error);
                }
            }
            setLoading(false);
        } catch (error) {
            console.log('Erreur lors de la récupération des informations utilisateur :', error);
            setLoading(true);
        }
    };


    // NOTE EVENEMENTS REQUETES
    // CREER UNE PARTY http://195.20.234.70:3000/events/
    // RECUPERER LES INFOS D'UNE PARTY AVEC L'ID DE LA SOIREE : http://195.20.234.70:3000/events/total/tout
    // RECUPERER LES TOUTES LES INFOS SUR LES BOUGS QUI SONT INSCRIT A UNE PARTY (id) : http://195.20.234.70:3000/connexion/client/party/1

    // RECUP INFO PARTY  
    // récupérer les infos des party 
    const getPartyInfo = async () => {


        const UrlRecupPartyById = "http://195.20.234.70:3000/events/total/tout";

        var requestOptions = {
            method: "GET",
            redirect: "follow",
        };
        fetch(UrlRecupPartyById, requestOptions)
            .then((response) => response.text())
            .then((result) => {

                const infosDeLaParty = JSON.parse(result);
                console.log(infosDeLaParty)
                setInfoParty(infosDeLaParty);


            })

            .catch((error) => console.log("error", error), alwaysNewParty = false);

    }
    //console.log("Voici les soirées : ")
    //console.log(infoParty);





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

    // quand l'utilisateur réserve sa partyyyy
    const onBuyParty = (partyId, referralCode) => {
        console.log('enculer');
        if (referralCode) {
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
                            if (userInfo.party_id !== null) {
                                var party = userInfo.party_id.slice(); // Supposons que `userInfo.party_id` soit un tableau initial
                                console.log(party);
                                party.push(partyId); // Ajoute `partyId` à la fin du tableau existant
                                console.log(party);
                            } else {
                                var party = []
                                console.log(party);
                                party.push(partyId); // Ajoute `partyId` à la fin du tableau existant
                                console.log(party);
                            }
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
                                            console.log("CODE DE PARRAINAGE ACTIVE! ");
                                        })
                                        .catch((error) => console.log("error", error));

                                    let data2 = JSON.stringify({
                                        "party_id": party
                                    });

                                    const UrlUpdateParty = "http://195.20.234.70:3000/connexion/" + userInfo.id;


                                    const requestOptions2 = {
                                        method: "PATCH",
                                        redirect: "follow",
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: data2
                                    };

                                    fetch(UrlUpdateParty, requestOptions2)
                                        .then((response) => response.text())
                                        .then((result) => {
                                            console.log("Party ajouté! ");
                                            navigation.navigate('Test');
                                        })
                                        .catch((error) => console.log("error", error));


                                })
                                .catch((error) => console.log("error", error));
                            break;
                        }
                    }
                })
                .catch((error) => console.log("error", error));
        }

        else {
            if (userInfo.party_id !== null) { // S'IL POSSEDE DEJA DES PARTYY
                var party = userInfo.party_id.slice(); // Supposons que `userInfo.party_id` soit un tableau initial
                console.log(party);
                party.push(partyId); // Ajoute `partyId` à la fin du tableau existant
                console.log(party);
            } else { // IL N'A PAS ENCORE DE PARTYY
                var party = []; // Supposons que `userInfo.party_id` soit un tableau initial
                console.log(party);
                party.push(partyId); // Ajoute `partyId` à la fin du tableau existant
                console.log(party);
            }
            let data2 = JSON.stringify({
                "party_id": party
            });

            const UrlUpdateParty = "http://195.20.234.70:3000/connexion/" + userInfo.id;


            const requestOptions2 = {
                method: "PATCH",
                redirect: "follow",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: data2
            };

            fetch(UrlUpdateParty, requestOptions2)
                .then((response) => response.text())
                .then((result) => {
                    console.log("Party ajouté! ");
                    console.log("CHANGEMENT ETAT DE USERINFO! ");
                    setUserInfo(prevUserInfo => ({ ...prevUserInfo, party_id: [...prevUserInfo.party_id, partyId] }));
                })
                .catch((error) => console.log("error", error));
        }

    }

    return (
        <ScrollView style={[styles.root, { backgroundColor: getBackgroundColor() }]}>
            <Text style={styles.text}> Connecté </Text>
            {userInfo ? (
                <>
                    <Text style={styles.text}>Email: {userInfo.email}</Text>
                    <Text style={styles.text}>Referral Code: {userInfo.referralcode}</Text>
                    <TouchableOpacity onPress={handleCopy}>
                        <Text style={styles.text}>Copy</Text>
                    </TouchableOpacity>
                    <Text style={styles.text}>Achète tessoirée !</Text>

                    {/* TOUTES LES INFOS DISPO
                    <Text style={styles.text}>Infos :</Text>
                    <Text style={styles.text}>Capacity: {infoParty.capacity}</Text>
                    <Text style={styles.text}>Date: {infoParty.date}</Text>
                    <Text style={styles.text}>Description: {infoParty.description}</Text>
                    <Text style={styles.text}>Name: {infoParty.name}</Text>
                    <Text style={styles.text}>Number of Conso: {infoParty.nbConso}</Text>
                    <Text style={styles.text}>Price: {infoParty.price}</Text>
                    <Text style={styles.text}>Start Time: {infoParty.start_time}</Text>
                    */}

                    {infoParty.map(party => {

                        if (userInfo.party_id != null) {
                            if (userInfo.party_id.includes(party.id)) { // SI L'UTILISATEUR A DEJA COMMANDE LA PARTY ON L'AFFICHE PAS ! 
                                return null; // Utilisation de `null` pour ignorer l'élément
                            } else {
                                if ((party.image_name !== null) && (party.image_name !== '')) {

                                    let imgUrl = "http://195.20.234.70:3000/events/photo/" + party.image_name;
                                    setImageURL(imgUrl)


                                }
                                return (
                                    <View key={party.id} style={styles.partyContainer}>
                                        <Text style={styles.partyName}>{party.name}</Text>
                                        <Text style={styles.partyDescription}>{party.description}</Text>
                                        <Text style={styles.partyPrice}>Price: {party.price}</Text>
                                        <CustomInput
                                            placeholder="Code de parrainage ?"
                                            value={referralCode}
                                            setValue={setReferralCode}
                                            secureTextEntry={false}
                                        />
                                        <CustomButton
                                            text="Acheter"
                                            onPress={() => onBuyParty(party.id, referralCode)}
                                        />
                                    </View>
                                );
                            }
                        } else {
                            return (
                                <View key={party.id} style={styles.partyContainer}>
                                    <Text style={styles.partyName}>{party.name}</Text>
                                    <Text style={styles.partyDescription}>{party.description}</Text>
                                    <Text style={styles.partyPrice}>Price: {party.price}</Text>
                                    <CustomInput
                                        placeholder="Code de parrainage ?"
                                        value={referralCode}
                                        setValue={setReferralCode}
                                        secureTextEntry={false}
                                    />
                                    <CustomButton
                                        text="Acheter"
                                        onPress={() => onBuyParty(party.id, referralCode)}
                                    />
                                </View>
                            );
                        }
                    })}



                </>
            ) : (
                <Text style={styles.text}>Aucune information utilisateur trouvée.</Text>
            )}
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    root: {
        flex: 1,
        paddingTop: 200,
        backgroundColor: 'black',
    },
    text: {
        color: 'white',
        fontSize: 20
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: 'white'
    },
    partyContainer: {
        marginVertical: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 8,
    },
    partyName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
    },
    partyDescription: {
        fontSize: 16,
        color: 'white',
        marginBottom: 8,
    },
    partyPrice: {
        fontSize: 16,
        color: 'white',
        marginBottom: 8,
    },
});

export default TestScreen;
