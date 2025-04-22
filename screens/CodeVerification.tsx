// src/screens/CodeVerification.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { verifyCode } from '../api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function CodeVerification({ navigation, route }: { navigation: any; route: { params: { email: string } } }) {
    const [code, setCode] = useState('');

    const email = route.params?.email; // Get email from route params
    console.log("email", email);

    const handleVerifyCode = () => {
        verifyCode(email, code)
            .then(async (response) => {
                if (response.status === 200) {
                    var msg="Código verificado correctamente, por favor inicia sesión";
                    navigation.navigate('Login', {msg}); // Redirect to login
                } else {
                    alert('Código incorrecto');
                }
            })
            .catch((error) => {
                console.error('Error al verificar el código:', error);
                alert('Hubo un error al verificar el código. Inténtalo de nuevo.');
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Verifica tu código</Text>
            <TextInput
                style={styles.input}
                placeholder="Ingresa el código"
                value={code}
                onChangeText={setCode}
                keyboardType="numeric"
            />
            <Button title="Verificar Código" onPress={handleVerifyCode} />
        </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 20 },
});
