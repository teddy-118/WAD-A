import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamList } from '../types';
import { getDBConnection, getUserByEmailAndPassword } from '../db.service';
import Summary from './Summary';
import ViewExpenseIncome from './ViewExpenseIncome';
import EditExpenseIncome from './EditExpenseIncome';
import CreateExpenseIncome from './CreateExpenseIncome';

const Drawer = createDrawerNavigator<StackParamList>();

type LoginScreenProp = NativeStackNavigationProp<StackParamList, 'Login'>;

const Login = ({ navigation }: { navigation: LoginScreenProp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'You must enter both email and password.');
      return;
    }

    try {
      const db = await getDBConnection();
      const user = await getUserByEmailAndPassword(db, email, password);
      
      if (user) {
        navigation.navigate('Summary');
      } else {
        Alert.alert('Error', 'Email or password is incorrect.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('Error', 'Failed to log in. Please try again.');
    }
  };

  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Summary" component={Summary} />
      <Drawer.Screen name="ViewExpenseIncome" component={ViewExpenseIncome} />
      <Drawer.Screen name="EditExpenseIncome" component={EditExpenseIncome} />
      <Drawer.Screen name="CreateExpenseIncome" component={CreateExpenseIncome} />
      <Drawer.Screen name="Login">
        {() => (
          <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Button title="Login" onPress={handleLogin} />
            <Button title="Register" onPress={() => navigation.navigate('Register')} />
          </View>
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default Login;
