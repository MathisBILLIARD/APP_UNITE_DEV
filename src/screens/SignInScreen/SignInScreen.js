import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, useWindowDimensions, ScrollView, Alert } from 'react-native';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import UNITE_LOGO from '../../images/UNITE_LOGO.png'
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import axios from 'axios';
import * as NavigationBar from "expo-navigation-bar";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Cookies from "js-cookie";
import emailjs from "@emailjs/browser";
import bcrypt from 'bcryptjs';




const SignInScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emails2, setEmails2] = useState([]);
    const { height } = useWindowDimensions();
    const [valdEmail, setValidEmail] = useState(false);
    const [passwords, setPasswords] = useState([]);
    const [validMdp, setValidMdp] = useState(false);
    const [userInfo, setUserInfo] = useState('');

    const navigation = useNavigation();

    useEffect(() => {
        const Url = "http://195.20.234.70:3000/connexion/email";
        const Url2 = "http://195.20.234.70:3000/connexion/pass";
        var requestOptions = {
            method: "GET",
            redirect: "follow",
        };
        fetch(Url, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                const emails2 = JSON.parse(result);
                console.log(emails2)
                setEmails2(emails2);
            })
            .catch((error) => console.log("error", error));
        var requestOptions2 = {
            method: "GET",
            redirect: "follow",
        };
        fetch(Url2, requestOptions2)
            .then((response) => response.text())
            .then((result) => {
                const passwords = JSON.parse(result);
                setPasswords(passwords);
            })
            .catch((error) => console.log("error", error));
    }, []);

    useEffect(() => {
        NavigationBar.setVisibilityAsync("hidden");

    }, []);

    const onSignInPressed = async () => {
        try {
            console.log(emails2);

            if (email === '' || password === '') {
                Alert.alert('Veuillez remplir tous les champs.');
            } else {
                let number = -1;
                console.log("TON ADRESSE MAIL :");
                console.log(email);
                for (let i = 0; i <= emails2.length; i++) {
                    console.log("LES ADRESSES COMPAREES:");
                    console.log(emails2[i]);
                    if (email === emails2[i]) {
                        number = i;
                        console.log("C'EST LA MEME ADRESSE");
                        break;
                    }
                }
                if (number === -1) {
                    Alert.alert("Votre nom d'utilisateur n'est pas valide");
                    return;
                }

                console.log("ON ARRIVE A LA COMPARAISON DU MDP");

                for (let index = 0; index < passwords.length; index++) {
                    console.log(passwords[index]);
                    if (password === passwords[number]) {
                        console.log("Bah t'es connecté fdp");

                        //  if (bcrypt.compareSync(password, passwords[number])) {
                        //    console.log("Bah t'es connecté fdp");

                        const userInfoURL = "http://195.20.234.70:3000/connexion/" + email;

                        var requestOptionsInfoUser = {
                            method: "GET",
                            redirect: "follow",
                        };

                        try {
                            const response = await fetch(userInfoURL, requestOptionsInfoUser);
                            const result = await response.text();
                            const infoUser = JSON.parse(result);
                            console.log("les infos balancées dans le JSON");
                            console.log(infoUser);
                            setUserInfo(infoUser);

                            AsyncStorage.setItem('userInfo', JSON.stringify(infoUser))
                                .then(() => {
                                    console.log('Informations utilisateur enregistrées avec succès.');
                                    setValidEmail(true);
                                    setValidMdp(true);
                                    navigation.navigate('Test');
                                })
                                .catch((error) => {
                                    console.log('Erreur lors de l\'enregistrement des informations utilisateur :', error);
                                });
                        } catch (error) {
                            console.log("error", error);
                        }
                    } else {
                        Alert.alert("Votre identifiant ou votre mot de passe ne correspond pas");
                    }
                }
            }
        } catch (error) {
            Alert.alert("Erreur lors de la connexion", error.message);
        }
    };

    // ! ---------- Cookie ----------//

    const checkCookieExists = (cookieName) => {
        var cookies = document.cookie.split(";");

        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.indexOf(cookieName + "=") === 0) {
                return true;
            }
        }

        return false;
    }

    const deleteCookie = (cookieName) => {
        document.cookie =
            cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }



    const onForgotPasswordPressed = () => {
        console.warn("onForgotPasswordPressed");

    }

    const onSignInFacebook = () => {
        console.warn("Facebook");
    }

    const onSignInGoogle = () => {
        console.warn("Google");
    }

    const onSignInApple = () => {
        console.warn("Apple");
    }

    const onSignUpPressed = () => {
        navigation.navigate('SignUp')
    }

    const onTest = () => {
        navigation.navigate('Test')
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.root}>
                <Image
                    source={UNITE_LOGO}
                    style={[styles.logo, { height: height * 0.2 }]}
                    resizeMode="contain"
                />

                <CustomInput
                    placeholder="Email"
                    value={email}
                    setValue={setEmail}
                    secureTextEntry={false}
                />
                <CustomInput
                    placeholder="Password"
                    value={password}
                    setValue={setPassword}
                    secureTextEntry={false}
                />
                <CustomButton
                    text="Sign In"
                    onPress={onSignInPressed}
                    bgColor="#00DAFB"
                />

                <CustomButton
                    text="Forgot password?"
                    onPress={onForgotPasswordPressed}
                    type="TERTIARY"
                />

                <CustomButton
                    text="Sign In With Facebook"
                    onPress={onSignInFacebook}
                    bgColor="#E7EAF4"
                    fgColor="#4765A9"
                />

                <CustomButton
                    text="Sign In With Google"
                    onPress={onSignInGoogle}
                    bgColor="#FAE9EA"
                    fgColor="#DD4D44"
                />


                <CustomButton
                    text="Sign In With Apple"
                    onPress={onSignInApple}
                    bgColor="#e3e3e3"
                    fgColor="#363636"
                />

                <CustomButton
                    text="Don't have an account? Create one "
                    onPress={onSignUpPressed}
                    type="TERTIARY"
                />

                <CustomButton
                    text="Travaux "
                    onPress={onTest}
                />



            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        paddingTop: 80,
        paddingLeft: 20,
        paddingRight: 20,


    },
    logo: {
        width: '70%',
        maxWidth: 300,
        maxHeight: 200,
        marginBottom: 50,

    },
    fontTest: {
        fontSize: 40,
        fontFamily: 'SpaceGrotesk-VariableFont_wght',
    }

})

export default SignInScreen