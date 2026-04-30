# Ruthless Ledger: AI Financial Evaluator

An AI-powered financial reality check built with Next.js. Unlike traditional expense trackers or simple chatbots, Ruthless Ledger utilizes Generative AI as a core data-parsing engine to extract unstructured financial confessions, visualize them dynamically, and deliver a brutally honest financial evaluation.

## 🚀 Key Features

* **AI-Driven Data Extraction:** The AI processes chaotic, natural language inputs and converts them into structured JSON data (Income, Expenses, Categories).
* **Dynamic Visualization:** Extracted data is instantly rendered into interactive pie charts using `recharts`.
* **The "Savage" Agent:** Introduces a distinct AI persona ("Ms. Ledger") providing unfiltered financial roasting, an opportunity cost breakdown, and a realistic 30-day survival plan.
* **Modern & Sleek UI:** Built with a dark-mode first approach, glassmorphism elements, and responsive design for a premium consulting firm aesthetic.

## 💻 Tech Stack

* **Frontend:** Next.js (App Router), React, CSS Modules
* **Charts & Icons:** Recharts, Lucide React
* **AI Integration:** Google Gemini API (via Next.js Serverless Route)
* **Deployment:** Vercel

## 🛠️ How to Run Locally

1. Clone this repository:
   ```bash
   git clone [https://github.com/amal-hidayah/finance-evaluation.git](https://github.com/amal-hidayah/finance-evaluation.git)
Install dependencies:

Bash
npm install
Set up environment variables:
Create a .env.local file in the root directory and add your Google Gemini API Key:

Cuplikan kode
   GEMINI_API_KEY=your_api_key_here
Run the development server:

Bash
npm run dev
