import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../types';
import { getDBConnection, updateExpense, updateIncome, getExpenseById, getIncomeById } from '../db.service';
import DateTimePicker from '@react-native-community/datetimepicker';

type EditExpenseIncomeNavigationProp = StackNavigationProp<StackParamList, 'EditExpenseIncome'>;
type EditExpenseIncomeRouteProp = RouteProp<StackParamList, 'EditExpenseIncome'>;

const EditExpenseIncome = ({ route }: { route: EditExpenseIncomeRouteProp }) => {
    const [name, setName] = useState('');
    const [value, setValue] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [error, setError] = useState('');
    const navigation = useNavigation<EditExpenseIncomeNavigationProp>();
    const { type = 'expense', id = 0 } = route.params || {};

    useEffect(() => {
        const loadItem = async () => {
            try {
                console.log(`Loading item with ID: ${id} and type: ${type}`);
                if (type !== 'expense' && type !== 'income') {
                    throw new Error('Invalid type provided.');
                }
    
                const db = await getDBConnection();
                let item;
                if (type === 'expense') {
                    console.log(`Querying for expense with ID: ${id}`);
                    item = await getExpenseById(db, id);
                } else if (type === 'income') {
                    console.log(`Querying for income with ID: ${id}`);
                    item = await getIncomeById(db, id);
                }
    
                if (item) {
                    setName(item.name || '');
                    setValue(item.value?.toString() || '');
    
                    const itemDate = item.date ? new Date(item.date) : null;
                    if (itemDate && !isNaN(itemDate.getTime())) {
                        setDate(itemDate);
                    } else {
                        console.warn('Invalid or null date found, using current date');
                        setDate(new Date());
                    }
                } else {
                    throw new Error('Item not found');
                }
            } catch (error) {
                console.error('Failed to load item:', error);
                Alert.alert('Error', `Failed to load item. ${error.message}`);
            }
        };
    
        loadItem();
    }, [type, id]);
    

    const handleUpdate = async () => {
        setError('');
        if (!name || !value) {
            setError('Please fill in all fields.');
            return;
        }

        const parsedValue = parseFloat(value);
        if (isNaN(parsedValue)) {
            setError('Value must be a valid number.');
            return;
        }

        try {
            const db = await getDBConnection();
            const formattedDate = date.toISOString().split('T')[0];
            if (type === 'expense') {
                await updateExpense(db, id, name, parsedValue, formattedDate);
            } else if (type === 'income') {
                await updateIncome(db, id, name, parsedValue, formattedDate);
            } else {
                throw new Error('Invalid type for update.');
            }
            Alert.alert('Success', 'Record updated successfully!');
            navigation.goBack();
        } catch (error) {
            console.error('Failed to update record:', error);
            Alert.alert('Error', `Failed to update record. ${error.message}`);
        }
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(false);
        setDate(currentDate);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{type === 'expense' ? 'Edit Expense' : 'Edit Income'}</Text>
            
            <View style={styles.formGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter description"
                    value={name}
                    onChangeText={setName}
                />
            </View>
            
            <View style={styles.formGroup}>
                <Text style={styles.label}>Value</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter value"
                    value={value}
                    onChangeText={setValue}
                    keyboardType="numeric"
                />
                {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
            
            <View style={styles.formGroup}>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                    <Text style={styles.dateButtonText}>Select Date</Text>
                </TouchableOpacity>
                <Text style={styles.dateText}>{date.toISOString().split('T')[0]}</Text>
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}
            </View>
            
            <TouchableOpacity onPress={handleUpdate} style={styles.updateButton}>
                <Text style={styles.updateButtonText}>Update</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',   
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 28,
        marginBottom: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 8,
        color: '#333',
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
    errorText: {
        color: 'red',
        marginTop: 8,
        fontSize: 14,
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
        fontSize: 18,
    },
    dateText: {
        fontSize: 16,
        marginTop: 8,
        textAlign: 'center',
        color: '#333',
    },
    updateButton: {
        height: 50,
        backgroundColor: '#007bff',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    updateButtonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default EditExpenseIncome;
