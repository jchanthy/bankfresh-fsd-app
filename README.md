
# Capstone Project - BankFresh

## Introduction
BankFresh is a dynamic net banking web application designed to provide users with a secure and smooth banking experience. It features key banking functionalities such as account access, transaction history, fund transfers, and digital statement downloads.

## IMPORTANT NOTE: This project is hosted on this account as part of the sample capstone projects in the Full-Stack Development Program provided by upGrad KnowledgeHut. Support shall only be provided through official channels and tickets through your PRISM account if you're a registered learner. For everyone else, the project is provided as is for tinkering however no support would be provided.

## Setup Instructions

### Prerequisites
- Git
- Node.js and npm
- MongoDB Atlas account

### Getting Started
1. **Clone the Repository**
   ```sh
   git clone https://github.com/sachinbhatnagar/bankfresh-fsd-app.git
   cd bankfresh-fsd-app
   ```

2. **Install Dependencies**
   Navigate to both backend and frontend directories and install the required packages.
   ```sh
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

3. **MongoDB Atlas Setup**
   - Set up a MongoDB Atlas account [here](https://www.mongodb.com/cloud/atlas).
   - Create a new user within your MongoDB Atlas dashboard.
   - Ensure that network access is open (Note: This is only recommended for development purposes).
   - Copy your MongoDB connection URL.

4. **Environment Configuration**
   Create a `.env` file in the root of the backend folder and add the following keys:
   ```plaintext
   JWT_SECRET=<unique-string>
   DB_URI=<mongodb-url>
   ```

5. **Start the Application**
   Navigate to the backend folder and start the server and frontend application.
   ```sh
   cd backend
   npm start
   ```

6. **Access the Application - Frontend**
   Open your web browser and go to `http://localhost:3000`.

7. **User Registration**
   Sign up as a new user. You will need to specify an initial amount to seed your account, as part of the registration process as this is an academic project.

## Features

- **User Account Access**: Log in to view and manage your bank account.
- **Transaction History**: Check past transactions with dates and amounts.
- **Fund Transfers**: Securely transfer funds to other accounts.
- **Digital Statements**: Download your account statements at your convenience.
- and more...

## Future Enhancements
We plan to introduce a CLI tool for backend administrative operations to enhance the realism of this academic project.

## Contributors
- [Sachin Bhatnagar](sachin@knowledgehut.com)
