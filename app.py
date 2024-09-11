from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

DATABASE = '../db.service'

def get_db_connection():
    try:
        conn = sqlite3.connect(DATABASE)
        conn.row_factory = sqlite3.Row
        print("Connection successful")
        return conn
    except sqlite3.Error as e:
        print(f"Connection failed: {e}")
        return None

@app.route('/api/incomes', methods=['GET', 'POST'])
def manage_incomes():
    if request.method == 'GET':
        return get_incomes()
    elif request.method == 'POST':
        return create_income()

def get_incomes():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM Incomes ORDER BY name')
        rows = cursor.fetchall()
        incomes = [dict(row) for row in rows]
        return jsonify(incomes)
    except sqlite3.Error as e:
        print(f"Error fetching incomes: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

def create_income():
    data = request.get_json()
    name = data.get('name')
    value = data.get('value')
    date = data.get('date')
    
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        cursor = conn.cursor()
        cursor.execute('INSERT INTO Incomes (name, value, date) VALUES (?, ?, ?)', (name, value, date))
        conn.commit()
        return jsonify({"status": "Income created"}), 201
    except sqlite3.Error as e:
        print(f"Error creating income: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/incomes/<int:id>', methods=['PUT', 'DELETE'])
def manage_income(id):
    if request.method == 'PUT':
        return update_income(id)
    elif request.method == 'DELETE':
        return delete_income(id)

def update_income(id):
    data = request.get_json()
    name = data.get('name')
    value = data.get('value')
    date = data.get('date')

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        cursor = conn.cursor()
        cursor.execute('UPDATE Incomes SET name = ?, value = ?, date = ? WHERE id = ?', (name, value, date, id))
        conn.commit()
        return jsonify({"status": "Income updated"}), 200
    except sqlite3.Error as e:
        print(f"Error updating income: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

def delete_income(id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM Incomes WHERE id = ?', (id,))
        conn.commit()
        return jsonify({"status": "Income deleted"}), 200
    except sqlite3.Error as e:
        print(f"Error deleting income: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/expenses', methods=['GET', 'POST'])
def manage_expenses():
    if request.method == 'GET':
        return get_expenses()
    elif request.method == 'POST':
        return create_expense()

def get_expenses():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM Expenses ORDER BY name')
        rows = cursor.fetchall()
        expenses = [dict(row) for row in rows]
        return jsonify(expenses)
    except sqlite3.Error as e:
        print(f"Error fetching expenses: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

def create_expense():
    data = request.get_json()
    name = data.get('name')
    value = data.get('value')
    date = data.get('date')

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        cursor = conn.cursor()
        cursor.execute('INSERT INTO Expenses (name, value, date) VALUES (?, ?, ?)', (name, value, date))
        conn.commit()
        return jsonify({"status": "Expense created"}), 201
    except sqlite3.Error as e:
        print(f"Error creating expense: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/expenses/<int:id>', methods=['PUT', 'DELETE'])
def manage_expense(id):
    if request.method == 'PUT':
        return update_expense(id)
    elif request.method == 'DELETE':
        return delete_expense(id)

def update_expense(id):
    data = request.get_json()
    name = data.get('name')
    value = data.get('value')
    date = data.get('date')

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        cursor = conn.cursor()
        cursor.execute('UPDATE Expenses SET name = ?, value = ?, date = ? WHERE id = ?', (name, value, date, id))
        conn.commit()
        return jsonify({"status": "Expense updated"}), 200
    except sqlite3.Error as e:
        print(f"Error updating expense: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

def delete_expense(id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM Expenses WHERE id = ?', (id,))
        conn.commit()
        return jsonify({"status": "Expense deleted"}), 200
    except sqlite3.Error as e:
        print(f"Error deleting expense: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

if __name__ == '__main__':
    app.run(debug=True)
