import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Button } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButtons from '../../components/SocialSignInButtons';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { SHA256 } from 'crypto-js';
import bcrypt from 'bcryptjs';


const SignUpScreen = () => {
  const { control, handleSubmit, watch } = useForm();
  const pwd = watch('password');
  const navigation = useNavigation();

  const onRegisterPressed = async () => {

  };

  const onSignInPress = () => {
    navigation.navigate('SignIn');
  };

  const onTermsOfUsePressed = () => {
    console.warn('onTermsOfUsePressed');
  };

  const onPrivacyPressed = () => {
    console.warn('onPrivacyPressed');
  };

  // ! ---------- Cryptage mot de passe ----------- //

  const cryptageMdp = async (e) => {

    try {
      const saltRounds = 10;
      const hashedPassword = bcrypt.hashSync(e, saltRounds);

      console.log(hashedPassword)
      return hashedPassword
    } catch (error) {
      console.log(error.message)
    }
  }

  const [eyes, setEyes] = useState(true);
  const [name, setName] = useState('');
  const [firstname, setFirstname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confpassword, setConfPassword] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [emails2, setEmails2] = useState([]);

  useEffect(() => {
    //récup les emails afin de de pas créer de double compte
    const Url = "http://195.20.234.70:3000/connexion/email";
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
  }, []);

  const handleChange = () => {
    setEyes(!eyes);
  };

  const handleNameChange = (text) => {
    setName(text);
  };

  const handleFirstnameChange = (text) => {
    setFirstname(text);
  };


  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };
  const handleConfPasswordChange = (text) => {
    setConfPassword(text);
  }

  const handlePhoneNumberChange = (text) => {
    setPhonenumber(text);
  };

  const handleSignUp = async () => {
    const emailRegex = /[a-z0-9_\-\.]+@[a-z0-9_\-\.]+\.[a-z]+/i;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const digitRegex = /[0-9]/;
    const specialCharRegex = /[\W_]/;


    if (name === '' || firstname === '' || email === '' || password === '') {
      Alert.alert('Veuillez remplir tous les champs.');
    }

    else if (email && !emailRegex.test(email)) {
      Alert.alert('Adresse e-mail invalide', 'Veuillez saisir une adresse e-mail valide.');
    }


    else if (emails2.includes(email)) {
      Alert.alert("l'adresse mail possède déjà un compte");
    }

    else if (password && (!uppercaseRegex.test(password) || !lowercaseRegex.test(password) || !digitRegex.test(password) || !specialCharRegex.test(password) || password.length < 8)) {
      Alert.alert('Mot de passe invalide', 'Le mot de passe doit contenir au moins 8 caractères, dont au moins une majuscule, une minuscule, un chiffre et un caractère spécial.');
    }
    else if (password !== confpassword) {
      Alert.alert('Les mots de passes ne correspondent pas');
      Alert.alert(password)
      Alert.alert(confpassword)
    } else {


      const emailWithoutSpace = email.replace(/\s+$/, ''); // Supprime les espaces à la fin
      const hashedPassword = SHA256(password).toString();
      console.log('Name:', name);
      console.log('First Name:', firstname);
      console.log('Email:', emailWithoutSpace);
      console.log('Password:', hashedPassword);
      console.log('Phone number', phonenumber);
      const referralCode = generateReferralCode();
      console.log('Referral code', referralCode);
      let data = JSON.stringify({
        "name": name,
        "firstname": firstname,
        "email": emailWithoutSpace,
        "password": hashedPassword,
        "phonenumber": phonenumber,
        "referralcode": referralCode,
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://195.20.234.70:3000/connexion',
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      };

      axios.request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          console.log("c'est cool")

        })
        .catch((error) => {
          console.log(error);
          console.log("c'est de la merde")
        });


      setName('');
      setFirstname('');
      setEyes(true);
      setEmail('');
      setPassword('');
      setConfPassword('');
      setPhonenumber('');

      navigation.navigate('Test');

    }
  }

  // Génère un code de parrainage aléatoire unique
  const generateReferralCode = () => {
    // Obtient l'horodatage actuel en millisecondes
    const timestamp = Date.now().toString();

    // Génère une chaîne aléatoire de 6 caractères
    const randomString = Math.random().toString(36).substring(2, 8);

    // Combine l'horodatage et la chaîne aléatoire
    const code = timestamp + randomString;

    // Effectue une fonction de hachage SHA256 sur le code pour le rendre unique
    const hashedCode = SHA256(code).toString();

    // Retourne les 8 premiers caractères du code haché en majuscules
    return hashedCode.substring(0, 8).toUpperCase();
  };


  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Create an account</Text>

        <CustomInput
          name="name"
          setValue={handleNameChange}
          value={name}
          placeholder="name"

        />

        <CustomInput
          name="Firstname"
          setValue={handleFirstnameChange}
          value={firstname}
          placeholder="Firstname"
        />



        <CustomInput
          name="email"
          setValue={handleEmailChange}
          placeholder="Email"
          value={email}
        />

        <CustomInput
          name="password"
          setValue={handlePasswordChange}
          value={password}
          placeholder="Password"
          secureTextEntry

        />
        <CustomInput
          name="password-repeat"
          setValue={handleConfPasswordChange}
          value={confpassword}
          placeholder="Repeat Password"
          secureTextEntry

        />

        <CustomInput
          name="phonenumber"
          setValue={handlePhoneNumberChange}
          value={phonenumber}
          placeholder="phone number"

        />


        <CustomButton
          text="Register"
          onPress={handleSignUp}
        />

        <Text style={styles.text}>
          By registering, you confirm that you accept our{' '}
          <Text style={styles.link} onPress={onTermsOfUsePressed}>
            Terms of Use
          </Text>{' '}
          and{' '}
          <Text style={styles.link} onPress={onPrivacyPressed}>
            Privacy Policy
          </Text>
        </Text>

        <SocialSignInButtons />

        <CustomButton
          text="Have an account? Sign in"
          onPress={onSignInPress}
          type="TERTIARY"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#051C60',
    margin: 10,
  },
  text: {
    color: 'gray',
    marginVertical: 10,
  },
  link: {
    color: '#FDB075',
  },

  input_container: {
    backgroundColor: 'white',
    width: '100%',
    height: '6%',

    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderRadius: 5,

    paddingHorizontal: 10,
    marginVertical: 5,
  },
  input_sexe: {
    height: 40,
    color: 'black',
  },

  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },

});

export default SignUpScreen;
