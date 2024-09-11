import {SQLiteDatabase, enablePromise, openDatabase} from 'react-native-sqlite-storage';
 
const databaseName = 'FinancialDb';
const serverPath = 'http://127.0.0.1';
 
enablePromise(true);
 
/*export const getDBConnection = async() => {
    return openDatabase(
        {name: `${databaseName}`},
        openCallback,
        errorCallback,
    );
}*/
export const getDBConnection = async () => {
    const db = await openDatabase(
        {name: `${databaseName}`},
        openCallback,
        errorCallback,
    );
    await createIncomesTable(db);
    await createExpensesTable(db);
    return db;
};
 
export const createIncomesTable = async (db: SQLiteDatabase) => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS Incomes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(20),
                value INTEGER,
                date TEXT
            )
        `;
        await db.executeSql(query);
        console.log('Incomes table created successfully');
    } catch (error) {
        console.error('Error creating Incomes table:', error);
        throw Error('Failed to create Incomes table');
    }
};
 
export const createExpensesTable = async (db: SQLiteDatabase) => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS Expenses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(20),
                value INTEGER,
                date TEXT
            )
        `;
        await db.executeSql(query);
        console.log('Expenses table created successfully');
    } catch (error) {
        console.error('Error creating Expenses table:', error);
        throw Error('Failed to create Expenses table');
    }
};
 

  
export const createUsersTable = async (db: SQLiteDatabase) => {
    try {
      const query = `CREATE TABLE IF NOT EXISTS User (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        dateOfBirth TEXT,
        phoneNumber TEXT,
        address TEXT
      )`;
      await db.executeSql(query);
      console.log('User table created successfully');
    } catch (error) {
      console.error('Error creating Users table:', error);
        throw Error('Failed to create table !!!');
      }
}

export const createUser = async (db: SQLiteDatabase, username: string, email: string, password: string, dob: string, phoneNumber: string, address: string) => {
    try {
      const query = 'INSERT INTO User (username, email, password, dateOfBirth, phoneNumber, address) VALUES (?, ?, ?, ?, ?, ?)';
      await db.executeSql(query, [username, email, password, dob, phoneNumber, address]);
      console.log('User created successfully');
    } catch (error) {
      console.error('Failed to create user:', error);
      throw new Error('Failed to create user');
    }
  };
  
  export const getUserByEmailAndPassword = async (db: SQLiteDatabase, email: string, password: string): Promise<any> => {
    try {
      const query = 'SELECT * FROM User WHERE email = ? AND password = ?';
      const result = await db.executeSql(query, [email, password]);
      
      if (result[0].rows.length > 0) {
        return result[0].rows.item(0);
      } else {
        return null;
      }
    } catch (error) {
      console.error('Failed to retrieve user:', error);
      throw new Error('Failed to retrieve user');
    }
  };
 
export const getIncomes = async(db: SQLiteDatabase): Promise<any> => {
    try{
        const IncomesData: any = [];
        const query = "SELECT * FROM Incomes ORDER BY name";
        const results = await db.executeSql(query);
        results.forEach(result => {
            (result.rows.raw()).forEach((item: any) => {
                IncomesData.push(item);
            })
        });
        return IncomesData;
    } catch (error) {
        console.error(error);
        throw Error('Failed to get Incomes !!!');
    }
}
 
export const getExpenses = async(db: SQLiteDatabase): Promise<any> => {
    try{
        const ExpensesData: any = [];
        const query = "SELECT * FROM Expenses ORDER BY name";
        const results = await db.executeSql(query);
        results.forEach(result => {
            (result.rows.raw()).forEach((item: any) => {
                ExpensesData.push(item);
            })
        });
        return ExpensesData;
    } catch (error) {
        console.error(error);
        throw Error('Failed to get Expenses !!!');
    }
}
 
 
export const getExpenseById = async (db: any, id: number) => {
    try {
        if (id <= 0) {
            throw new Error('Invalid ID provided.');
        }

        const query = 'SELECT * FROM expenses WHERE id = ?';
        const results = await db.executeSql(query, [id]);

        console.log(`Query result for expense with ID ${id}:`, results);

        if (results[0].rows.length === 0) {
            console.log(`No expense found with ID: ${id}`);
            return null;
        }

        return results[0].rows.item(0);
    } catch (error) {
        console.error('Failed to get expense by ID:', error);
        throw error;
    }
};


export const getIncomeById = async (db: any, id: number) => {
    try {
        const result = await db.executeSql(
            'SELECT * FROM incomes WHERE id = ?',
            [id]
        );
        console.log('Result from getIncomeById:', result); // Debugging
        if (result && result[0] && result[0].rows) {
            const { rows } = result[0];
            if (rows.length > 0) {
                return rows.item(0);
            } else {
                console.log(`No income found with ID: ${id}`);
                return null;
            }
        } else {
            console.error('Unexpected result structure from getIncomeById:', result);
            return null;
        }
    } catch (error) {
        console.error('Failed to get income by ID:', error);
        throw error;
    }
};



 
 
export const createIncomes = async (db: SQLiteDatabase, name: string, value: string, date: string) => {
    try {
        const query = 'INSERT INTO Incomes(name, value, date) VALUES (?, ?, ?)';
        await db.executeSql(query, [name, value, date]);
    } catch (error) {
        console.error('Failed to create income:', error);
        throw Error('Failed to create income');
    }
};
 
export const createExpenses = async (db: SQLiteDatabase, name: string, value: string, date: string) => {
    try {
        const query = 'INSERT INTO Expenses(name, value, date) VALUES (?, ?, ?)';
        await db.executeSql(query, [name, value, date]);
    } catch (error) {
        console.error('Failed to create expense:', error);
        throw Error('Failed to create expense');
    }
};
 

 
export const updateIncome = async (db: SQLiteDatabase, id: number, name: string, value: number, date: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'UPDATE Incomes SET name = ?, value = ?, date = ? WHERE id = ?',
                [name, value, date, id],
                () => resolve(),
                (_, error) => reject(error)
            );
        });
    });
};
  
  export const updateExpense = async (db: SQLiteDatabase, id: number, name: string, value: number, date: string) => {
    return new Promise<void>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'UPDATE Expenses SET name = ?, value = ?, date = ? WHERE id = ?',
                [name, value, date, id],
                () => resolve(),
                (_, error) => reject(error)
            );
        });
    });
  };
  
 
export const deleteIncome = async (db: SQLiteDatabase, id: number) => {
  return new Promise<void>((resolve, reject) => {
      db.transaction(tx => {
          tx.executeSql(
              'DELETE FROM incomes WHERE id = ?',
              [id],
              () => resolve(),
              (_, error) => reject(error)
          );
      });
  });
};
 
export const deleteExpense = async (db: SQLiteDatabase, id: number) => {
  return new Promise<void>((resolve, reject) => {
      db.transaction(tx => {
          tx.executeSql(
              'DELETE FROM expenses WHERE id = ?',
              [id],
              () => resolve(),
              (_, error) => reject(error)
          );
      });
  });
};
 
const openCallback = () => {
    console.log('database open success');
}
 
const errorCallback = (err: any) => {
    console.log('Error in opening the database: ' + err);
}

