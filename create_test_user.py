import mysql.connector
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_test_user():
    try:
        # Connect to MySQL
        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Pringles10@",
            database="ecommerce"
        )
        cursor = db.cursor()

        # Test user credentials
        test_user = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'Password123'  # In a real app, this would be hashed
        }

        # Check if user already exists
        cursor.execute("SELECT id FROM users WHERE username = %s OR email = %s", 
                      (test_user['username'], test_user['email']))
        
        if cursor.fetchone():
            logger.info("Test user already exists")
        else:
            # Create test user
            query = "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)"
            cursor.execute(query, (test_user['username'], test_user['email'], test_user['password']))
            db.commit()
            logger.info("Test user created successfully")

        logger.info("Test user credentials:")
        logger.info(f"Username: {test_user['username']}")
        logger.info(f"Password: {test_user['password']}")
        logger.info(f"Email: {test_user['email']}")

    except mysql.connector.Error as err:
        logger.error(f"Database error: {err}")
    except Exception as e:
        logger.error(f"Error: {e}")
    finally:
        if 'db' in locals() and db.is_connected():
            cursor.close()
            db.close()

if __name__ == "__main__":
    create_test_user()