import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackParamList } from '../types';
import { getDBConnection, getIncomes, getExpenses } from '../db.service';

type Transaction = {
    id: number;
    name: string;
    value: number;
    date: string;
};

type SummaryRouteProp = RouteProp<StackParamList, 'Summary'>;

const Summary: React.FC = () => {
    const [incomes, setIncomes] = useState<Transaction[]>([]);
    const [expenses, setExpenses] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [totalIncomes, setTotalIncomes] = useState<number>(0);
    const [totalExpenses, setTotalExpenses] = useState<number>(0);
    const [balance, setBalance] = useState<number>(0);
    const navigation = useNavigation();
    const route = useRoute<SummaryRouteProp>();
    const selectedMonth = route.params?.selectedMonth || 'January';

    const fetchData = useCallback(async (month: string) => {
        try {
            setLoading(true);
            const db = await getDBConnection();
            const fetchedIncomes = await getIncomes(db);
            const fetchedExpenses = await getExpenses(db);

            const filteredIncomes = fetchedIncomes.filter((item: Transaction) => {
                const itemMonth = new Date(item.date).toLocaleString('default', { month: 'long' });
                return itemMonth === month;
            });

            const filteredExpenses = fetchedExpenses.filter((item: Transaction) => {
                const itemMonth = new Date(item.date).toLocaleString('default', { month: 'long' });
                return itemMonth === month;
            });

            if (!filteredIncomes.length && !filteredExpenses.length) {
                Alert.alert('No data available', `No records found for ${month}.`);
            }

            setIncomes(filteredIncomes);
            setExpenses(filteredExpenses);

            const totalIncomeAmount = filteredIncomes.reduce((sum: number, item: Transaction) => sum + item.value, 0);
            const totalExpenseAmount = filteredExpenses.reduce((sum: number, item: Transaction) => sum + item.value, 0);

            setTotalIncomes(totalIncomeAmount);
            setTotalExpenses(totalExpenseAmount);
            setBalance(totalIncomeAmount - totalExpenseAmount);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            Alert.alert('Error', 'Failed to fetch data. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchData(selectedMonth);
        }, [selectedMonth, fetchData])
    );

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Summary for {selectedMonth}</Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <View style={styles.summaryContent}>
                        <View style={styles.summaryBox}>
                            <Text style={styles.subtitle}>Total Incomes</Text>
                            <Text style={styles.totalAmount}>${totalIncomes.toFixed(2)}</Text>

                            <Text style={styles.subtitle}>Total Expenses</Text>
                            <Text style={styles.totalAmount}>${totalExpenses.toFixed(2)}</Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.balanceBox, { backgroundColor: balance >= 0 ? 'green' : 'red' }]}
                            onPress={() => navigation.navigate('ViewExpenseIncome', { selectedMonth })}
                        >
                            <Text style={styles.balanceText}>
                                Total Balance: ${balance.toFixed(2)}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#007bff' }]}
                    onPress={() => navigation.navigate('CreateExpenseIncome', { type: 'expense' })}
                >
                    <Text style={styles.buttonText}>Add Expense</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#28a745' }]}
                    onPress={() => navigation.navigate('CreateExpenseIncome', { type: 'income' })}
                >
                    <Text style={styles.buttonText}>Add Income</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 8,
    },
    summaryContent: {
        flex: 1,
    },
    summaryBox: {
        marginBottom: 16,
    },
    totalAmount: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    balanceBox: {
        marginVertical: 16,
        paddingVertical: 20,
        paddingHorizontal: 16,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    balanceText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 16,
        backgroundColor: '#f8f8f8',
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default Summary;
