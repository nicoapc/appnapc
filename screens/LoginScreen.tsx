import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Snackbar } from 'react-native-paper';
import { login } from '../api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation, route }: {navigation: any, route: { params: { msg: string } }}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [msg, setMsg] = useState(route.params?.msg || '') ; // Get msg from route params

  const handleLogin = async () => {
    try {
      const res = await login(email, password);
      await AsyncStorage.setItem('token', res.data.token);
      navigation.reset({ index: 0, routes: [{ name: 'Checklist' }] });
    } catch (err: any) {
      console.log(err);
      setErrorMsg(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput 
        label="Email" 
        value={email} 
        onChangeText={(text: string) => setEmail(text)} 
        keyboardType="email-address" // Correct type for email input
        autoCapitalize="none" // Prevent auto-capitalization
      />
      <TextInput 
        label="Contraseña" 
        secureTextEntry 
        value={password} 
        onChangeText={(text: string) => setPassword(text)} 
        textContentType="password" // Correct type for password input
      />
      <Button 
        mode="contained" 
        onPress={handleLogin}
      >
        Iniciar Sesión
      </Button>
      <Snackbar 
        visible={!!errorMsg} 
        onDismiss={() => setErrorMsg('')}
      >
        {errorMsg}
      </Snackbar>
      <Snackbar 
        visible={!!msg} 
        onDismiss={() => setMsg('')}
      >
        {msg}
      </Snackbar>
      <Button 
        onPress={() => navigation.navigate('Register')}
      >
        Registrarse
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 }
});
