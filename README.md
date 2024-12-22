# Liquide Trades

### Overview
tock Trades API designed for high-performance operations. The API supports user authentication (signup, login, refresh-token) and trade management (get trades, get trade:by ID, post trade) .

---

### **Getting Started**

#### **To Run This Project Using Docker**
1. Run the following command to start the application:
   ```bash
   docker-compose up
   ```

#### **To Run Migrations**
1. Access the Docker container shell:
   ```bash
   docker exec -it liquide sh
   ```
2. Run the database migrations:
   ```bash
   npm run migration:run
   ```

---

### **Authentication Endpoints**

#### **To Create a New User**
1. Make a POST request to:
   ```
   http://localhost:3000/auth/signup
   ```
2. Use the following request body:
   ```json
   {
       "email": "dev@liquide.com",
       "password": "mysecret8"
   }
   ```

#### **To Login**
1. Make a POST request to:
   ```
   http://localhost:3000/auth/login
   ```
2. Use the following request body:
   ```json
   {
       "email": "dev@liquide.com",
       "password": "mysecret8"
   }
   ```
3. Copy the `access_token` from the response for authenticated requests.

---

### **Trade Management API**

#### **To Add Trades**
- Add the `access_token` received from the login call to the `Authorization` header for all requests.

#### **Endpoints**
- **POST `/trades`**:
  - Create a new trade record.
- **GET `/trades`**:
  - Fetch all trades or filter trades using query parameters.
- **GET `/trades/{id}`**:
  - Fetch a trade by its unique ID.

#### **Error Handling**
- Ensure the `access_token` is valid and part of `Authorization` header
- Incase `access_token` is expired, create new `access_token` using `/auth/refresh-token` api with `refresh_token` json as body.

---

#### **Postman Collection**
[Link to collection](https://web.postman.co/workspace/My-Workspace~1bba946e-0188-49f0-8568-7f651bb57ed1/collection/8787338-5cbd716b-0b75-48c5-a28a-0099ed1b4e27?action=share&source=copy-link&creator=8787338)


---

### **TO DO**
- Add test cases to cover more scenarios.
- Better handle test-data generation (faker libraries) and test table data truncation

---

### **Future Enhancements (Need basis)**
- Add rate limiting to secure the API from abuse.
- Bulk Inserts for creating multiple trades at once
- Monitoring and logging.
- Add Retry with Circuit Breaker
