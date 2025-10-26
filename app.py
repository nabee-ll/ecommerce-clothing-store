from flask import Flask, request, jsonify
from flask_cors import CORS

import mysql.connector

app = Flask(__name__)
CORS(app)



# MySQL connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Pringles10@",  # replace with your MySQL password
    database="ecommerce"
)

cursor = db.cursor()


@app.route('/')
def home():
    return "Hello, Ecommerce Store is running!"


@app.route('/products', methods=['GET'])
def get_products():
    cursor.execute("SELECT * FROM products")
    products = cursor.fetchall()
    
    # Format data as a list of dictionaries
    product_list = []
    for p in products:
        product_list.append({
            "id": p[0],
            "name": p[1],
            "description": p[2],
            "price": float(p[3]),
            "stock": p[4]
        })
    return jsonify(product_list)


if __name__ == '__main__':
    app.run(debug=True)

@app.route('/add_user', methods=['POST'])
def add_user():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')  # In real apps, hash passwords!

    query = "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)"
    cursor.execute(query, (username, email, password))
    db.commit()
    
    return jsonify({"message": "User added successfully!"})

@app.route('/add_product', methods=['POST'])
def add_product():
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    price = data.get('price')
    stock = data.get('stock')

    query = "INSERT INTO products (name, description, price, stock) VALUES (%s, %s, %s, %s)"
    cursor.execute(query, (name, description, price, stock))
    db.commit()
    
    return jsonify({"message": "Product added successfully!"})


@app.route('/place_order', methods=['POST'])
def place_order():
    data = request.get_json()
    user_id = data.get('user_id')
    product_id = data.get('product_id')
    quantity = data.get('quantity')

    # Check stock
    cursor.execute("SELECT stock FROM products WHERE id = %s", (product_id,))
    result = cursor.fetchone()
    if not result:
        return jsonify({"message": "Product not found!"}), 404
    
    stock = result[0]
    if stock < quantity:
        return jsonify({"message": "Not enough stock!"}), 400

    # Insert order
    query = "INSERT INTO orders (user_id, product_id, quantity) VALUES (%s, %s, %s)"
    cursor.execute(query, (user_id, product_id, quantity))
    
    # Update stock
    cursor.execute("UPDATE products SET stock = stock - %s WHERE id = %s", (quantity, product_id))
    
    db.commit()
    return jsonify({"message": "Order placed successfully!"})
