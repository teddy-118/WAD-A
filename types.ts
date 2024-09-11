export type StackParamList = {
  Summary: { selectedMonth: string };
  Login: undefined;
  Register: undefined;
  CreateExpenseIncome: { type: 'expense' | 'income' };
  ViewExpenseIncome: undefined; // No params for this screen
  EditExpenseIncome: {
  type: 'income' | 'expense';
  id: number; // Define the id parameter
};
};

export type Transaction = {
  id: number;
  description: string;
  amount: number;
};

export type Income = {
id: number;
name: string;
value: number;
};

export type Expense = {
id: number;
name: string;
value: number;
};