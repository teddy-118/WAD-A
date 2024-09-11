import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackParamList } from '../types';
import { getDBConnection, getIncomes, getExpenses, deleteExpense, deleteIncome } from '../db.service';

type Transaction = {
    id: number;
    name: string;
    value: number;
    date: string;
};

type ViewExpenseIncomeRouteProp = RouteProp<StackParamList, 'ViewExpenseIncome'>;

const ViewExpenseIncome: React.FC = () => {
    const [incomes, setIncomes] = useState<Transaction[]>([]);
    const [expenses, setExpenses] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigation = useNavigation();
    const route = useRoute<ViewExpenseIncomeRouteProp>();
    const selectedMonth = route.params?.selectedMonth || 'January'; // Default to 'January'

    const fetchData = useCallback(async () => {
        try {
            const db = await getDBConnection();
            const fetchedIncomes = await getIncomes(db);
            const fetchedExpenses = await getExpenses(db);

            const filterByMonth = (items: Transaction[]) =>
                items.filter((item) => new Date(item.date).toLocaleString('default', { month: 'long' }) === selectedMonth);

            setIncomes(filterByMonth(fetchedIncomes));
            setExpenses(filterByMonth(fetchedExpenses));
        } catch (error) {
            console.error('Failed to load data:', error);
            Alert.alert('Error', 'Failed to load data.');
        } finally {
            setLoading(false);
        }
    }, [selectedMonth]);

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData])
    );

    const handleEdit = (type: 'income' | 'expense', id: number) => {
        navigation.navigate('EditExpenseIncome', { type, id });
    };

    const handleDelete = async (type: 'income' | 'expense', id: number) => {
        try {
            const db = await getDBConnection();
            if (type === 'expense') {
                await deleteExpense(db, id);
                setExpenses(expenses.filter(expense => expense.id !== id));
            } else if (type === 'income') {
                await deleteIncome(db, id);
                setIncomes(incomes.filter(income => income.id !== id));
            }
            Alert.alert('Success', 'Record deleted successfully!');
        } catch (error) {
            console.error('Failed to delete record:', error);
            Alert.alert('Error', 'Failed to delete record.');
        }
    };

    const renderItem = ({ item, type }: { item: Transaction; type: 'income' | 'expense' }) => (
        <View style={styles.itemContainer}>
            <View style={styles.itemContent}>
                <Text style={styles.itemText}>
                    {item.name} - ${item.value.toFixed(2)}{'\n'}
                    <Text style={styles.dateText}>{new Date(item.date).toLocaleDateString()}</Text>
                </Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.editButton]}
                        onPress={() => handleEdit(type, item.id)}
                    >
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.deleteButton]}
                        onPress={() => handleDelete(type, item.id)}
                    >
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <View style={styles.listContainer}>
                    <Text style={styles.title}>Incomes for {selectedMonth}</Text>
                    <FlatList
                        data={incomes}
                        renderItem={(props) => renderItem({ ...props, type: 'income' })}
                        keyExtractor={(item) => item.id.toString()}
                    />
                    <Text style={styles.title}>Expenses for {selectedMonth}</Text>
                    <FlatList
                        data={expenses}
                        renderItem={(props) => renderItem({ ...props, type: 'expense' })}
                        keyExtractor={(item) => item.id.toString()}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    listContainer: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    itemContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    itemContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 16,
    },
    dateText: {
        fontSize: 14,
        color: '#888',
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 8,
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 5,
        marginHorizontal: 4,
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: '#007bff',
    },
    deleteButton: {
        backgroundColor: '#dc3545',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default ViewExpenseIncome;
