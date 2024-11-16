# Database Project App

**Deployed via Microsoft Azure**  
https://polite-sand-0f80b0a10.5.azurestaticapps.net/
Please refer to the `Team 3 DB Project Document.pdf` about info of the project.

---

## Installation

### Prerequisites

- Node.js installed  
- MySQL Server installed  

---

## Setup Instructions


1. **Clone the Repository**
   ```
   git clone https://github.com/ck011604/database-project-app.git
   ```
   
2. **Start the Local Database Server**
   - The following command might change depending on the version of MySQL and the OS you are on.
   - Run this command as administrator in the command prompt (for windows MySQL 9):  
     ```
     net start mysql90
     ```

3. **Import SQL File**  
   - Open MySQL Workbench and connect to your local server. Create a database called `restaurantDB` and import `restaurantDB.sql` (found in the root folder).


4. **Configure Environment Variables**   
   - in the `.env` file, replace `DB_PASSWORD` with the same password as the locally hosted MySql Server
     
5. **Install Dependencies**
   ```
   npm install
   ```

6. **Start the Server**  
   - In a separate terminal, navigate to the server folder and run the server by using the following command: 
     ```
     cd server
     node server.js
     ```

7. **Start the React App**  
   - In a separate terminal (should be in the root folder), run:  
     ```
     npm start
     ```  
   - Open [http://localhost:3000](http://localhost:3000) to view the app.
  
