import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ChecklistScreen from '../screens/ChecklistScreen';
import CodeVerification from '../screens/CodeVerification';

type AppStackParamList = {
  Login: { msg: string };
  Register: undefined;
  Checklist: undefined;
  CodeVerification: { email: string };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Checklist" component={ChecklistScreen} />
        <Stack.Screen name="CodeVerification" component={CodeVerification} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
