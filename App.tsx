import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextStyle } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Summary from './Screens/Summary';
import Login from './Screens/Login';
import Register from './Screens/Register';
import ViewExpenseIncome from './Screens/ViewExpenseIncome';
import EditExpenseIncome from './Screens/EditExpenseIncome';
import CreateExpenseIncome from './Screens/CreateExpenseIncome';
import { StackParamList } from './types';
import { getDBConnection, createIncomesTable, createExpensesTable, createUsersTable} from './db.service';

const Stack = createStackNavigator<StackParamList>();
const Drawer = createDrawerNavigator();

// Months array for the drawer items
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];



// Define the stack for your main screens
const StackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Summary" component={Summary} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Register" component={Register} />
    <Stack.Screen name="ViewExpenseIncome" component={ViewExpenseIncome} />
    <Stack.Screen name="EditExpenseIncome" component={EditExpenseIncome} />
    <Stack.Screen name="CreateExpenseIncome" component={CreateExpenseIncome} />
  </Stack.Navigator>
);

// Drawer content with months
const CustomDrawerContent = ({ navigation }: any) => {
  return (
    <View style={{ flex: 1 }}>
      {months.map((month, index) => (
        <TouchableOpacity
          key={index}
          style={{ padding: 20, borderBottomWidth: 1 }}
          onPress={() => {
            navigation.navigate('Summary', { selectedMonth: month });
          }}
        >
          <Text>{month}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Drawer navigator
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={StackNavigator} />
    </Drawer.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
};
 
export default App;