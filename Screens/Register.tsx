import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamList } from '../types';
import { getDBConnection, createUser } from '../db.service';
import Login from './Login';
import Summary from './Summary';
import ViewExpenseIncome from './ViewExpenseIncome';
import EditExpenseIncome from './EditExpenseIncome';
import CreateExpenseIncome from './CreateExpenseIncome';

const Drawer = createDrawerNavigator<StackParamList>();

type RegisterScreenProp = NativeStackNavigationProp<StackParamList, 'Register'>;

const Register = ({ navigation }: { navigation: RegisterScreenProp }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState(''); 
  const [phoneNumber, setPhoneNumber] = useState(''); 
  const [address, setAddress] = useState(''); 
  const handleRegister = async () => {
    if (!username || !email || !password || !dob || !phoneNumber || !address) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    try {
      const db = await getDBConnection();
      await createUser(db, username, email, password, dob, phoneNumber, address);

      Alert.alert('Success', 'Account created successfully');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error creating user:', error);
      Alert.alert('Error', 'Failed to create account. Please try again.');
    }
  };

  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Summary" component={Summary} />
      <Drawer.Screen name="ViewExpenseIncome" component={ViewExpenseIncome} />
      <Drawer.Screen name="EditExpenseIncome" component={EditExpenseIncome} />
      <Drawer.Screen name="CreateExpenseIncome" component={CreateExpenseIncome} />
      <Drawer.Screen name="Register">
        {() => (
          <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
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
            <TextInput
              style={styles.input}
              placeholder="Date of Birth"
              value={dob}
              onChangeText={setDob}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
            />
            <Button title="Register" onPress={handleRegister} />
            <Button title="Back to Login" onPress={() => navigation.navigate('Login')} />
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

export default Register;
