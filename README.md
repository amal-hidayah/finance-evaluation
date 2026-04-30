# Ruthless Ledger: AI Financial Evaluator

An AI-powered financial reality check built with Next.js. Unlike traditional expense trackers or simple chatbots, Ruthless Ledger utilizes Generative AI as a core data-parsing engine to extract unstructured financial confessions, visualize them dynamically, and deliver a brutally honest financial evaluation.

## 🚀 Key Features

* **AI-Driven Data Extraction:** The AI processes chaotic, natural language inputs and converts them into structured JSON data (Income, Expenses, Categories) in real-time.
* **Dynamic Visualization:** Extracted data is instantly rendered into interactive pie charts using `recharts`.
* **The "Savage" Agent:** Introduces a distinct AI persona ("Ms. Ledger") providing unfiltered financial roasting, an opportunity cost breakdown, and a realistic 30-day survival plan.
* **Modern & Sleek UI:** Built with a dark-mode first approach, smooth loading states, and responsive design for a premium, intimidating corporate aesthetic.

## 💻 Tech Stack

* **Frontend:** Next.js (App Router), React, CSS
* **Charts & Icons:** Recharts, Lucide React
* **AI Integration:** Groq API (Llama 3 70B via Next.js Serverless Route) - *Chosen for its ultra-low latency and superior JSON structuring capabilities.*
* **Deployment:** Vercel

## ⚙️ Getting Started

To run this project locally, create a `.env.local` file in the root directory and add your Groq API key:
```env
GROQ_API_KEY=your_groq_api_key_here
Then, run the development server:

Bash
npm run dev
