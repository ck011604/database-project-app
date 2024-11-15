# Database Project App

**Deployed via Microsoft Azure**  
[Live Application](https://polite-sand-0f80b0a10.5.azurestaticapps.net/)

---

## Installation

### Prerequisites

- Node.js installed  
- MySQL Server installed  

---

## Setup Instructions

1. **Configure Environment Variables**  
   - Copy the environment variables from `localHost.txt`.  
   - Replace the variables in the `.env` file.

2. **Clone the Repository**
   - ```git clone https://github.com/ck011604/database-project-app.git```
     
4. **Install Dependencies**
   - ```npm install```


4. **Start the Local Database Server**  
   - Run this command as administrator in the command prompt:  
     ```
     net start mysql90
     ```

5. **Import SQL File**  
   - Open MySQL Workbench, connect to your local server, and import `restaurantDB.sql`.

6. **Start the Server**  
   - Navigate to the server directory and run:  
     ```
     cd server
     node server.js
     ```

7. **Start the React App**  
   - In a separate terminal, run:  
     ```
     npm start
     ```  
   - Open [http://localhost:3000](http://localhost:3000) to view the app.
---

## Running Only the Frontend  

To run only the frontend locally with the hosted server/database:  

   - Skip Steps 1, 4, 5, and 6.  
   - Follow the remaining steps.

