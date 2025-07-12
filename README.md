# 👕 Re-Wear

A full-stack web application for donating, managing, and requesting reusable clothing — built with **Node.js**, **MongoDB**, **Angular (client & admin)**, and an integrated **AI-style chatbot** for FAQs and product recommendations.

---

## 📁 Project Structure

cloth-reuse-platform/
├── admin/ → Admin dashboard (Angular)
├── client/ → User-facing frontend (Angular)
├── server/ → Node.js backend with Express & MongoDB


---

## ✨ Features

### 👤 Users
- Browse and request available clothing
- Donate clothes via an easy form
- Chatbot for instant FAQ answers

### 👮 Admin
- Manage donations, users, and products
- View analytics or approval queues *(optional features)*

### 💬 Chatbot
- FAQs: Answers to common questions like donation process, pickup, eligibility, swapping

---

## ⚙️ Technologies Used

| Layer        | Tech Stack                       |
|--------------|----------------------------------|
| Frontend     | Angular (User + Admin)           |
| Backend      | Node.js, Express.js              |
| Database     | MongoDB, Mongoose                |
| Chatbot      | Custom intent matcher via REST API |
| Styling      | CSS, Angular Forms               |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/cloth-reuse-platform.git
cd cloth-reuse-platform
```

### 2. Set up the Backend (server/)

```bash
cd server
npm install
```

#### Create .env (optional)

MONGO_URI=mongodb+srv://Shibam9064:EjaPjODb1qtq24ft@cluster0.yctg4cl.mongodb.net/rewear
PORT=8000
JWT_SECRET=shibamisagoodboy

#### Start the backend

```bash
node server.js
```

### 3. Set up the User Frontend (client/)

```bash
cd ../client
npm install
ng serve
```

### 4. Set up the Admin Panel (admin/)

```bash
cd ../admin
npm install
ng serve --port 4300
```


## 📌 TODO (Optional Enhancements)

- OpenAI-based chatbot understanding

- Admin analytics dashboard

- Email or SMS notifications

- Role-based access control

- Product image uploads via cloud storage


## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.








