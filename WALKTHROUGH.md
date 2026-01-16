# Smart Campus Canteen - Hackathon Project Walkthrough

## 🚀 Getting Started

1.  **Run the App**:
    ```bash
    npm install
    npm run dev
    ```
    Open `http://localhost:5173` in your browser.

## 📱 Features

### 1. Student Portal (The "Client" view)
*   **Login**: Sleek, glassmorphism UI. Click "Sign In with ID" (Mocked) or "Google".
*   **Dashboard**:
    *   **Smart Slot Booking**: Select a time slot (e.g., 12:15).
    *   **Real-time Menu**: Filter by Category (Veg, Non-Veg).
    *   **Crowd Meter**: Visual indicator of current rush.
    *   **Voting System**: "Vote for Tomorrow" section to engage students.
    *   **AI Chatbot**: Click the floating bubble to ask "What's special?". (Uses a Mock AI service for the demo).
*   **Ordering Flow**: Add to Cart -> Select Slot -> Pay -> **Get QR Ticket**.

### 2. Admin Portal (The "Staff" view)
*   **Access**: Click "**Are you a staff member? Login here**" on the login page.
*   **Dashboard**:
    *   **Live Queue**: See orders coming in real-time.
    *   **Controls**: Pause/Resume booking instantly (simulating overload control).
    *   **Analytics**: Quick view of total orders and revenue.
    *   **QR Scanner**: Button to validate student tickets.

## 🛠️ Tech Stack & "Wow" Factors
*   **Frontend**: React + Vite.
*   **Styling**: Tailwind CSS + Framer Motion (Neon/Cyberpunk Glassmorphism).
*   **Google Tech Integration**:
    *   **Firebase**: Configured structure for Auth/Firestore.
    *   **Gemini AI**: "AI Assistant" service showcasing how you'd use LLMs for menu questions.

## 🎤 Hackathon Demo Flow
1.  **Start as Student**: Login, ask the AI "What's special?", add Biriyani to cart.
2.  **Book Slot**: Select 12:15, Checkout. Show the generated **QR Code**.
3.  **Switch to Admin**: Go to Login -> Staff Login.
4.  **Manage Orders**: Show the new order in "Live Queue". Click checkmark to "Serve" it.
5.  **Analytics**: Show the "Booking Active" toggle to prove you can control the crowd.
