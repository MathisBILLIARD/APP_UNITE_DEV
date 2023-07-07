import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, TextInput, Modal, SafeAreaView } from 'react-native';
import ReferralScreen from './screens/SignInScreen/Referral';
import SignInScreen from './screens/SignInScreen/SignInScreen';
import Navigation from './navigation';


const App = () => {
  return (
    <SafeAreaView style={styles.root}>
      <Navigation />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9FBFC',
  }
})



export default App;