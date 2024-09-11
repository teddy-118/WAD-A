import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../types';
import { getDBConnection, createIncomes, createExpenses } from '../db.service';
import DateTimePicker from '@react-native-community/datetimepicker';

type CreateExpenseIncomeNavigationProp = StackNavigationProp<StackParamList, 'CreateExpenseIncome'>;
type CreateExpenseIncomeRouteProp = RouteProp<StackParamList, 'CreateExpenseIncome'>;

const CreateExpenseIncome = () => {
    const [name, setName] = useState('');
    const [value, setValue] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const navigation = useNavigation<CreateExpenseIncomeNavigationProp>();
    const route = useRoute<CreateExpenseIncomeRouteProp>();
    const { type } = route.params || {}; // Get the 'type' parameter from the route

    if (!type) {
        Alert.alert('Error', 'No type specified.');
        return null;
    }

    const handleCreate = async () => {
        if (!name || !value) {
            Alert.alert('Validation Error', 'Please fill in all fields.');
            return;
        }

        const parsedValue = parseFloat(value);
        if (isNaN(parsedValue)) {
            Alert.alert('Validation Error', 'Value must be a valid number.');
            return;
        }

        try {
            const db = await getDBConnection();
            const formattedDate = date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD

            if (type === 'expense') {
                await createExpenses(db, name, parsedValue.toString(), formattedDate);
            } else if (type === 'income') {
                await createIncomes(db, name, parsedValue.toString(), formattedDate);
            }

            Alert.alert('Success', 'Record created successfully!');
            navigation.goBack(); // Navigate back to the previous screen
        } catch (error) {
            console.error('Failed to create record:', error);
            Alert.alert('Error', 'Failed to create record.');
        }
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(false);
        setDate(currentDate);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create {type === 'expense' ? 'Expense' : 'Income'}</Text>
            <TextInput
                style={styles.input}
                placeholder="Description"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#888"
            />
            <TextInput
                style={styles.input}
                placeholder="Value"
                value={value}
                onChangeText={setValue}
                keyboardType="numeric"
                placeholderTextColor="#888"
            />
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.dateButtonText}>Select Date</Text>
            </TouchableOpacity>
            <Text style={styles.dateText}>{date.toISOString().split('T')[0]}</Text>
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    style={styles.datePicker}
                />
            )}
            <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
                <Text style={styles.createButtonText}>Create</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    dateButton: {
        height: 50,
        backgroundColor: '#007bff',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    dateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    dateText: {
        fontSize: 18,
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    datePicker: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 20,
    },
    createButton: {
        height: 50,
        backgroundColor: '#28a745',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    createButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CreateExpenseIncome;
