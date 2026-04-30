Project Name
Ruthless Ledger

Project Overview
Ruthless Ledger is a brutally honest, AI-powered financial evaluation web application designed for young professionals who need a harsh reality check regarding their spending habits. Unlike traditional budgeting apps that rely on tedious manual data entry, Ruthless Ledger allows users to simply type out their financial confessions in unstructured, natural language.

The core of the application utilizes Generative AI to parse this chaotic input, extracting concrete data points (income, categorized expenses) and transforming them into a structured JSON format. This structured data dynamically powers the frontend visualizations, including interactive pie charts and financial summaries. Beyond data extraction, the AI takes on the persona of "Ms. Ledger," a ruthless financial auditor. It evaluates the user's financial health by generating a "Savage Score," calculating the long-term "Opportunity Cost" of their worst expenses, and estimating their "Survival Rate" in days. The result is a highly engaging, gamified financial tool that forces users to confront the reality of their financial decisions through sharp, persona-driven feedback.

Frontend Framework
Next.js (App Router), React, Recharts.

AI Model / API Used
Google Gemini API.

How AI is Integrated
AI is strictly utilized as the core data-processing engine, not a bolt-on chatbot. When a user submits an unstructured financial narrative, the Next.js Serverless backend sends a precise system prompt to the Gemini API. The AI acts as a data parser, extracting numerical values, categorizing expenses, and outputting a strictly formatted JSON object. The React frontend then intercepts this JSON to dynamically render UI components, generate financial charts, and display the AI's calculated metrics alongside its personalized financial evaluation.

Branding Notes
The visual identity of Ruthless Ledger was conceptualized and developed by Kardigi to reflect the premium, intimidating aura of an elite consulting firm. The color palette relies on a sleek dark mode accented with sharp reds (symbolizing financial danger) and muted greens. The central character, "Ms. Ledger," is visually represented as a strict corporate auditor, reinforcing the application's narrative. The layout utilizes clean typography and subtle UI borders to ensure the product feels like a high-end, functional financial tool.

What Makes It Unique
The unique value proposition lies in replacing the friction of manual spreadsheet data entry with an engaging, narrative-driven AI extraction process. By gamifying financial failure through custom metrics like the "Savage Score" and "Opportunity Cost," it transforms mundane budgeting into a highly impactful reality check. It proves that AI can be leveraged to engineer behavioral change through tough love rather than passive assistance.
