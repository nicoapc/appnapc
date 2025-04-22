import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Snackbar } from 'react-native-paper';
import { register } from '../api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async () => {
    try {
      await register(email, password);
      navigation.navigate('CodeVerification');
    navigation.navigate('CodeVerification', { email });
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Error al registrarse');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput 
      label="Email" 
      value={email} 
      onChangeText={setEmail} 
      keyboardType="email-address" 
      autoCapitalize="none" 
      />
      <TextInput 
      label="Contraseña" 
      secureTextEntry 
      value={password} 
      onChangeText={setPassword} 
      />
      <Button mode="contained" onPress={handleRegister}>Registrarse</Button>
      <Snackbar 
      visible={!!errorMsg} 
      onDismiss={() => setErrorMsg('')}
      >
      {errorMsg}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 }
});