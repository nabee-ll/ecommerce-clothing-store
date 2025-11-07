# -*- coding: utf-8 -*-
from flask import Flask, request, jsonify, g
from flask_cors import CORS
import mysql.connector
import logging
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

from itsdangerous import URLSafeTimedSerializer
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default-secret-key-change-in-production')
serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])

# Get CORS origins from environment or use defaults
cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:5173,http://localhost:3002,http://localhost:3000,http://localhost:3001').split(',')
CORS(app, resources={r"/*": {"origins": cors_origins}},
     allow_headers=["Content-Type", "Authorization", "Accept"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     supports_credentials=True)

def send_reset_email(email: str, reset_url: str) -> bool:
    try:
        # Get email configuration from environment variables
        email_host = os.getenv('EMAIL_HOST', 'smtp.gmail.com')
        email_port = int(os.getenv('EMAIL_PORT', '587'))
        email_username = os.getenv('EMAIL_USERNAME')
        email_password = os.getenv('EMAIL_PASSWORD')
        email_from = os.getenv('EMAIL_FROM')
        
        # Debug logging
        logger.info(f"Email Configuration:")
        logger.info(f"Host: {email_host}")
        logger.info(f"Port: {email_port}")
        logger.info(f"Username: {email_username}")
        logger.info(f"From: {email_from}")
        logger.info(f"Password length: {len(email_password) if email_password else 0}")
        logger.info(f"Sending to: {email}")

        if not all([email_username, email_password, email_from]):
            logger.error("Missing email configuration")
            return False

        msg = MIMEMultipart()
        msg['Subject'] = "Password Reset Request - Noir"
        msg['From'] = email_from
        msg['To'] = email
        
        body = f"""
        Hello,
        
        You have requested to reset your password for your Noir account.
        
        Please click the following link to reset your password:
        {reset_url}
        
        If you did not request this password reset, please ignore this email.
        This link will expire in 30 minutes for security purposes.
        
        Best regards,
        Noir Team
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        try:
            logger.info("Attempting to connect to SMTP server...")
            with smtplib.SMTP(email_host, email_port, timeout=10) as server:
                logger.info("Connected to SMTP server")
                
                logger.info("Starting TLS...")
                server.starttls()  # Enable TLS
                logger.info("TLS started")
                
                logger.info("Attempting login...")
                server.login(email_username, email_password)
                logger.info("Login successful")
                
                logger.info("Sending message...")
                server.send_message(msg)
                logger.info(f"Password reset email sent successfully to {email}")
                return True
                
        except smtplib.SMTPAuthenticationError as auth_error:
            logger.error(f"SMTP Authentication failed: {auth_error}")
            logger.error("Please check your EMAIL_USERNAME and EMAIL_PASSWORD in .env")
            return False
        except smtplib.SMTPConnectError as conn_error:
            logger.error(f"SMTP Connection failed: {conn_error}")
            logger.error("Please check your EMAIL_HOST and EMAIL_PORT in .env")
            return False
        except smtplib.SMTPException as smtp_error:
            logger.error(f"SMTP error while sending email: {smtp_error}")
            return False
        except TimeoutError:
            logger.error("Connection timed out. Please check your internet connection.")
            return False
            
    except Exception as e:
        logger.error(f"Error in send_reset_email: {e}")
        return False

def get_db():
    if not hasattr(g, "db"):
        try:
            g.db = mysql.connector.connect(
                host=os.getenv('DB_HOST', 'localhost'),
                user=os.getenv('DB_USER', 'ecommerce_user'),
                password=os.getenv('DB_PASSWORD', 'ecommerce123'),
                database=os.getenv('DB_NAME', 'ecommerce')
            )
            if not g.db.is_connected():
                raise Exception("Failed to connect to database")
            logger.info("Successfully connected to database")
        except Exception as e:
            logger.error(f"Database connection error: {str(e)}")
            raise
    return g.db

@app.teardown_appcontext
def close_db(error):
    if hasattr(g, "db"):
        try:
            if g.db.is_connected():
                g.db.close()
                logger.info("Database connection closed")
        except Exception as e:
            logger.error(f"Error closing database connection: {str(e)}")

import bcrypt

@app.route("/add_user", methods=["POST"])
def add_user():
    try:
        logger.info("Received registration request")
        data = request.get_json()
        if not data:
            logger.error("No JSON data received")
            return jsonify({"error": "No data provided"}), 400

        username = data.get("username", "").strip()
        email = data.get("email", "").strip()
        password = data.get("password", "")
        
        # Hash the password
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

        if not username or not email or not password:
            logger.error("Missing required fields")
            return jsonify({"error": "Missing required fields"}), 400

        db = get_db()
        cursor = db.cursor(dictionary=True)

        try:
            cursor.execute("SELECT id FROM users WHERE username = %s OR email = %s", (username, email))
            if cursor.fetchone():
                logger.warning(f"User {username} or email {email} already exists")
                return jsonify({"error": "Username or email already exists"}), 409

            query = "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)"
            cursor.execute(query, (username, email, hashed_password))
            db.commit()
            
            logger.info(f"Successfully registered user: {username}")
            return jsonify({
                "message": "User registered successfully",
                "user": {"username": username, "email": email}
            }), 201

        except Exception as e:
            logger.error(f"Database error: {e}")
            return jsonify({"error": str(e)}), 500
        finally:
            cursor.close()

    except Exception as e:
        logger.error(f"Registration error: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route("/login", methods=["POST"])
def login():
    try:
        logger.info("Received login request")
        data = request.get_json()
        if not data:
            logger.error("No JSON data received")
            return jsonify({"error": "No data provided"}), 400

        username = data.get("username", "").strip()
        password = data.get("password", "")

        if not username or not password:
            logger.error("Missing required fields")
            return jsonify({"error": "Missing required fields"}), 400

        db = get_db()
        cursor = db.cursor(dictionary=True)

        try:
            cursor.execute("SELECT id, username, email, password FROM users WHERE username = %s", 
                         (username,))
            user = cursor.fetchone()
            
            if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
                # User authenticated successfully
                access_token = f"mock_token_{user['id']}"  # In production, use proper JWT tokens
                logger.info(f"Login successful for user: {username}")
                return jsonify({
                    "user": {
                        "id": user["id"],
                        "username": user["username"],
                        "email": user["email"]
                    },
                    "access_token": access_token
                })
            
            logger.warning(f"Failed login attempt for user: {username}")
            return jsonify({"error": "Invalid username or password"}), 401

        except Exception as e:
            logger.error(f"Database error during login: {e}")
            return jsonify({"error": "Database error occurred"}), 500
        finally:
            cursor.close()

    except Exception as e:
        logger.error(f"Login error: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route("/products", methods=["GET"])
def get_products():
    try:
        logger.info("Fetching products")
        db = get_db()
        cursor = db.cursor(dictionary=True)


        try:
            # Get all products with their basic information
            cursor.execute("""
                SELECT id, name, description, price, stock, image, category 
                FROM products
                WHERE stock > 0
                ORDER BY id DESC
            """)
            products = cursor.fetchall()
            
            logger.info(f"Found {len(products)} products")
            return jsonify(products)

        except Exception as e:
            logger.error(f"Database error while fetching products: {e}")
            return jsonify({"error": "Failed to fetch products"}), 500
        finally:
            cursor.close()

    except Exception as e:
        logger.error(f"Error in get_products: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route("/forgot-password", methods=["POST"])
def forgot_password():
    try:
        logger.info("Received forgot password request")
        data = request.get_json()
        
        if not data:
            logger.error("No JSON data received")
            return jsonify({"error": "No data provided"}), 400
            
        email = data.get("email")
        if not email:
            logger.error("No email provided")
            return jsonify({"error": "Email is required"}), 400
            
        logger.info(f"Processing forgot password request for email: {email}")
        
        db = get_db()
        cursor = db.cursor(dictionary=True)
        
        try:
            # Check if email exists
            cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()
            
            if not user:
                # Don't reveal whether the email exists
                logger.info(f"No user found with email: {email}")
                return jsonify({
                    "message": "If your email is registered, you will receive a password reset link"
                }), 200
            
            # Generate reset token
            token = serializer.dumps(email, salt='password-reset-salt')
            
            # Create reset URL
            frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5173')
            reset_url = f"{frontend_url}/reset-password?token={token}"
            
            try:
                # Send reset email
                if send_reset_email(email, reset_url):
                    logger.info(f"Password reset email sent successfully to {email}")
                    return jsonify({
                        "message": "If your email is registered, you will receive a password reset link"
                    }), 200
                else:
                    logger.error(f"Failed to send reset email to {email}")
                    return jsonify({"error": "Failed to send reset email"}), 500
                    
            except Exception as e:
                logger.error(f"Error sending reset email: {e}")
                return jsonify({"error": "Failed to send reset email"}), 500
                
        except Exception as e:
            logger.error(f"Database error during forgot password: {e}")
            return jsonify({"error": "An error occurred while processing your request"}), 500
        finally:
            cursor.close()
            
    except Exception as e:
        logger.error(f"Forgot password error: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

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

@app.route("/orders", methods=["GET"])
def get_orders():
    try:
        logger.info("Received order history request")
        
        # Get user ID from Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Missing or invalid authorization token"}), 401
        
        token = auth_header.split(' ')[1]
        # Extract user_id from token (mock implementation - in production use JWT)
        try:
            user_id = int(token.split('_')[2])
        except:
            return jsonify({"error": "Invalid token format"}), 401
        
        db = get_db()
        cursor = db.cursor(dictionary=True)

        try:
            # Get all orders for the user
            cursor.execute("""
                SELECT o.id, o.total_price, o.status, o.order_date
                FROM orders o
                WHERE o.user_id = %s
                ORDER BY o.order_date DESC
            """, (user_id,))
            
            orders = cursor.fetchall()
            
            # Format the response
            formatted_orders = []
            for order in orders:
                # Get order items for this order
                cursor.execute("""
                    SELECT oi.product_id, oi.quantity, oi.price_at_time
                    FROM order_items oi
                    WHERE oi.order_id = %s
                """, (order["id"],))
                
                items = cursor.fetchall()
                
                formatted_items = []
                for item in items:
                    formatted_items.append({
                        "product_id": item["product_id"],
                        "quantity": item["quantity"],
                        "price": float(item["price_at_time"])
                    })
                
                formatted_orders.append({
                    "id": order["id"],
                    "user_id": user_id,
                    "total_price": float(order["total_price"]),
                    "status": order["status"],
                    "created_at": order["order_date"].isoformat() if order["order_date"] else None,
                    "items": formatted_items
                })
            
            logger.info(f"Found {len(formatted_orders)} orders for user {user_id}")
            return jsonify(formatted_orders)

        except Exception as e:
            logger.error(f"Database error while fetching orders: {e}")
            return jsonify({"error": "Failed to fetch orders"}), 500
        finally:
            cursor.close()

    except Exception as e:
        logger.error(f"Error in get_orders: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route("/orders/<int:order_id>/cancel", methods=["POST"])
def cancel_order(order_id):
    try:
        logger.info(f"Received order cancellation request for order {order_id}")
        
        # Get user ID from Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Missing or invalid authorization token"}), 401
        
        token = auth_header.split(' ')[1]
        # Extract user_id from token (mock implementation - in production use JWT)
        try:
            user_id = int(token.split('_')[2])
        except:
            return jsonify({"error": "Invalid token format"}), 401
        
        db = get_db()
        cursor = db.cursor(dictionary=True)

        try:
            # Check if order exists and belongs to user
            cursor.execute("""
                SELECT id, user_id, status FROM orders 
                WHERE id = %s AND user_id = %s
            """, (order_id, user_id))
            
            order = cursor.fetchone()
            
            if not order:
                return jsonify({"error": "Order not found"}), 404
            
            if order["status"] != "pending":
                return jsonify({"error": f"Cannot cancel order with status: {order['status']}"}), 400
            
            # Get order items to restore stock
            cursor.execute("""
                SELECT product_id, quantity FROM order_items 
                WHERE order_id = %s
            """, (order_id,))
            
            order_items = cursor.fetchall()
            
            # Start transaction
            cursor.execute("START TRANSACTION")
            
            # Update order status to cancelled
            cursor.execute("""
                UPDATE orders 
                SET status = 'cancelled' 
                WHERE id = %s
            """, (order_id,))
            
            # Restore product stock
            for item in order_items:
                cursor.execute("""
                    UPDATE products 
                    SET stock = stock + %s 
                    WHERE id = %s
                """, (item["quantity"], item["product_id"]))
            
            db.commit()
            logger.info(f"Order {order_id} cancelled successfully by user {user_id}")
            
            return jsonify({"message": "Order cancelled successfully"}), 200

        except Exception as e:
            db.rollback()
            logger.error(f"Database error while cancelling order: {e}")
            return jsonify({"error": "Failed to cancel order"}), 500
        finally:
            cursor.close()

    except Exception as e:
        logger.error(f"Error in cancel_order: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route("/")
def home():
    return jsonify({
        "status": "running",
        "cors_allowed_origins": ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:5173"]
    })

@app.route("/test")
def test():
    return jsonify({"message": "Backend is running"})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
