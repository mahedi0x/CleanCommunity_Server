# 🌱 CleanBD Server

This is the **server-side API** for the CleanBD project.  
It powers authentication, issue reporting, contribution tracking, and community data management.  
Built with **Node.js**, **Express**, and **MongoDB**, it provides a scalable backend for the CleanBD client.

---

## 🔗 Live API

<!-- 👉 [View API Live]()   -->

---

## ✨ Features

- 🔐 **Authentication** – User registration, login, password reset.
- 🗂️ **Issue Management** – Create, update, delete, and fetch community complaints.
- 📊 **Contribution Tracking** – Store and retrieve user contributions.
- 👥 **User Management** – Role-based access for admins, volunteers, and citizens.
- 🌍 **RESTful API** – JSON-based endpoints for easy integration with the client.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js  
- **Framework:** Express.js  
- **Database:** MongoDB (Mongoose ODM)  
- **Auth:** Firebase JWT (JSON Web Tokens), bcrypt for password hashing  
- **Other:** dotenv for environment variables, cors for cross-origin requests  

---

## 🚀 Getting Started (Development)

### Prerequisites

- Node.js (>= 16)
- MongoDB (local or Atlas cluster)
- npm or yarn

### Installation

```bash
git clone https://github.com/mahedi0x/CleanCommunity_Server
cd cleanbd-server
npm install
