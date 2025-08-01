# 🍽️ Mess App – Next.js Project

A modern, full-stack web application to manage daily mess operations including menus, user registrations, attendance, and payments. Built with **Next.js**, **Tailwind CSS**, and **MongoDB**.

---

## ✨ Features

- ✅ User registration & login (students & admin)
- 📅 Daily & weekly menu planner
- 🍛 Meal selection & attendance tracking
- 💳 Online/offline payment management
- 📊 Admin dashboard with analytics
- 📱 Responsive UI for mobile & desktop
- 📨 Email notifications/reminders

---

## 🧰 Tech Stack

| Tech        | Description                              |
|-------------|------------------------------------------|
| Next.js     | React framework with server-side rendering |
| MongoDB     | NoSQL database for storing users, meals, payments |
| Tailwind CSS| Utility-first styling framework           |
| Prisma      | Type-safe ORM for MongoDB                |
| NextAuth.js | Authentication for students & admins     |
| Vercel      | Hosting platform for seamless deployment |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/mess-app-nextjs.git
cd mess-app-nextjs


npm install
# or
yarn install


DATABASE_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/messapp
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000


npm run dev
# or
yarn dev


🔒 Authentication
Uses NextAuth.js to support:

Student login via email/password

Admin login with protected routes

Session-based security

🧾 Payments (Optional)
Supports integration with:

Razorpay / Stripe

Payment history in dashboard

Monthly fee tracking

📦 Deployment
Easily deploy to Vercel:

bash
Copy
Edit
# Deploy using Vercel CLI
vercel
Or connect your GitHub repo to Vercel for auto-deployments.

🧑‍💻 Contributing
Fork the repository

Create a new branch: git checkout -b feature/your-feature

Commit your changes: git commit -m "Add your feature"

Push to the branch: git push origin feature/your-feature

Open a Pull Request

📄 License
This project is licensed under the MIT License.

🙋‍♀️ Acknowledgements
Thanks to:

Next.js

Tailwind CSS

MongoDB

Vercel

NextAuth.js
