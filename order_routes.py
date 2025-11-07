@app.route("/place_order", methods=["POST"])
def place_order():
    try:
        logger.info("Received order placement request")
        data = request.get_json()
        if not data:
            logger.error("No JSON data received")
            return jsonify({"error": "No data provided"}), 400

        user_id = data.get("user_id")
        items = data.get("items", [])
        
        if not user_id or not items:
            logger.error("Missing required fields")
            return jsonify({"error": "Missing required fields"}), 400

        db = get_db()
        cursor = db.cursor(dictionary=True)

        try:
            # Start transaction
            cursor.execute("START TRANSACTION")
            
            # Calculate total price and validate stock
            total_price = 0
            for item in items:
                cursor.execute("""
                    SELECT price, stock FROM products 
                    WHERE id = %s AND stock >= %s
                """, (item["product_id"], item["quantity"]))
                product = cursor.fetchone()
                
                if not product:
                    raise Exception(f"Product {item['product_id']} not available in requested quantity")
                
                total_price += product["price"] * item["quantity"]

            # Create order
            cursor.execute("""
                INSERT INTO orders (user_id, total_price, status) 
                VALUES (%s, %s, 'pending')
            """, (user_id, total_price))
            
            order_id = cursor.lastrowid

            # Add order items and update stock
            for item in items:
                cursor.execute("""
                    INSERT INTO order_items (order_id, product_id, quantity, price_at_time)
                    SELECT %s, %s, %s, price FROM products WHERE id = %s
                """, (order_id, item["product_id"], item["quantity"], item["product_id"]))
                
                cursor.execute("""
                    UPDATE products 
                    SET stock = stock - %s 
                    WHERE id = %s
                """, (item["quantity"], item["product_id"]))

            # Commit transaction
            db.commit()
            logger.info(f"Order {order_id} placed successfully for user {user_id}")
            
            return jsonify({
                "message": "Order placed successfully",
                "order_id": order_id,
                "total_price": float(total_price)
            }), 201

        except Exception as e:
            # Rollback transaction on error
            db.rollback()
            logger.error(f"Error placing order: {e}")
            return jsonify({"error": str(e)}), 500
        finally:
            cursor.close()

    except Exception as e:
        logger.error(f"Order placement error: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500