# NOIR - E-Commerce Clothing Store 🛍️

An elegant e-commerce platform for fashion and clothing built with React, Flask, and MySQL.

## Features ✨

- 🏠 Modern, responsive UI with elegant design
- 👗 Product categories (Men's, Women's, Accessories)
- 🛒 Shopping cart functionality
- 📦 Order management with cancel option
- 👤 User authentication & registration
- 🔐 Password reset functionality
- 📱 Mobile-friendly design
- 🎨 Category-based filtering

## Tech Stack 💻

### Frontend
- React with TypeScript
- Vite
- Tailwind CSS
- Context API for state management

### Backend
- Flask (Python)
- MySQL Database
- Flask-CORS
- bcrypt for password hashing

## Installation & Setup 🚀

### Prerequisites
- Python 3.8+
- Node.js 16+
- MySQL Server

### Backend Setup

1. Clone the repository
```bash
git clone <your-repo-url>
cd E-commerce-Store
```

2. Create and activate virtual environment
```bash
python -m venv .venv
# On Windows
.venv\Scripts\activate
# On Unix/MacOS
source .venv/bin/activate
```

3. Install Python dependencies
```bash
pip install flask flask-cors mysql-connector-python bcrypt python-dotenv itsdangerous
```

4. Set up environment variables
```bash
# Copy the example env file
cp .env.example .env
# Edit .env with your actual credentials
```

5. Set up MySQL database
```sql
-- Create database
CREATE DATABASE ecommerce;

-- Create user
CREATE USER 'ecommerce_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON ecommerce.* TO 'ecommerce_user'@'localhost';
FLUSH PRIVILEGES;
```

6. Run the Flask server
```bash
python app.py
```
Backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to Frontend directory
```bash
cd Frontend
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```
Frontend will be available at `http://localhost:3001`

## Environment Variables 🔐

Create a `.env` file in the root directory with:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=ecommerce

# Email Configuration (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your_email@example.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_FROM=your_email@example.com

# Application Configuration
SECRET_KEY=generate-a-random-secret-key-here
FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173,http://localhost:3001
```

**⚠️ Never commit your `.env` file to version control!**

## Database Schema 📊

### Users Table
- id, username, email, password, created_at

### Products Table
- id, name, description, price, stock, image, category, created_at

### Orders Table
- id, user_id, total_price, status, order_date

### Order Items Table
- id, order_id, product_id, quantity, price_at_time, created_at

## API Endpoints 🔌

### Authentication
- `POST /add_user` - Register new user
- `POST /login` - User login
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password

### Products
- `GET /products` - Get all products

### Orders
- `POST /place_order` - Place a new order
- `GET /orders` - Get user's order history
- `POST /orders/<order_id>/cancel` - Cancel an order

## Security Features 🔒

- Password hashing with bcrypt
- Environment-based configuration
- CORS protection
- SQL injection prevention with parameterized queries
- Secure token-based password reset

## Project Structure 📁

```
E-commerce-Store/
├── app.py                 # Main Flask application
├── .env                   # Environment variables (not in git)
├── .env.example          # Example environment variables
├── .gitignore            # Git ignore file
├── Frontend/             # React frontend
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── context/
└── README.md
```

## Contributing 🤝

Feel free to submit issues and pull requests!

## License 📄

This project is open source and available under the MIT License.

## Author ✍️

Developed by Nabeel

---
Made with ❤️ using React, Flask, and MySQL
