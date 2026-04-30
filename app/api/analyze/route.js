import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text input is required' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey || apiKey === 'your_groq_api_key_here') {
      // Return a mocked response for demo purposes if no API key is provided
      console.warn("No valid GROQ_API_KEY found, returning mocked data.");
      return NextResponse.json({
        income: 5000000,
        expenses: [
          { category: "Kos", amount: 1500000 },
          { category: "Ngopi", amount: 1000000 },
          { category: "Netflix", amount: 150000 },
          { category: "Gacha Game", amount: 500000 }
        ],
        roast: "Kamu pikir ngopi 1 juta sebulan bikin kamu jadi CEO startup? Gacha game setengah juta? Pantesan akhir bulan makan promag. Ini bukan gaya hidup, ini bunuh diri finansial pelan-pelan.",
        plan: [
          "Hapus semua game gacha dari HP sekarang.",
          "Bikin kopi sendiri pakai sachet, rasanya sama aja kalau dicampur air mata.",
          "Cancel Netflix, kamu nggak punya waktu nonton kalau harus kerja keras bayar utang.",
          "Sisa uang ditabung, jangan sok kaya."
        ],
        savage_score: "F - Calon Gelandangan",
        opportunity_cost: "Uang 1,5 juta yang lu bakar buat gaya hidup hari ini, kalau lu masukin ke S&P 500 dengan bunga 10% per tahun, bakal jadi Rp 3.800.000 dalam 10 tahun. Selamat, lu baru aja merampok masa depan lu sendiri.",
        survival_days: 12
      });
    }

    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are Ms. Ledger, a savage, sarcastic, and extremely condescending Lead Auditor. 
Your client will provide you with a messy, unstructured rant about their income and expenses.
Your job is to parse this into structured JSON and completely roast their financial choices.
You MUST return ONLY valid JSON with the following schema, with no markdown formatting:
{
  "income": number (total income, 0 if not mentioned),
  "expenses": [ { "category": string, "amount": number } ],
  "roast": string (A brutal, sarcastic paragraph roasting their spending habits in Indonesian),
  "plan": [ string ] (An array of 3-4 harsh but realistic actionable steps for the next 30 days in Indonesian),
  "savage_score": string (Grade A to F with a harsh status, e.g., "F - Calon Gelandangan"),
  "opportunity_cost": string (Calculate roughly how much their worst expense would be worth in 10 years if invested at 10% return, explain it sarcastically),
  "survival_days": number (Estimate how many days they can survive if they lose their income today, based on their expenses)
}`
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.8
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Groq API Error:", errorData);
      throw new Error(`Groq API responded with status: ${response.status}`);
    }

    const data = await response.json();
    let resultText = data.choices[0].message.content;

    // Clean up markdown block if present
    resultText = resultText.replace(/```json/gi, '').replace(/```/g, '').trim();

    // Parse the JSON returned by Groq (Llama 3)
    const parsedData = JSON.parse(resultText);

    return NextResponse.json(parsedData);

  } catch (error) {
    console.error('Error analyzing financial data:', error);
    return NextResponse.json(
      { error: 'Failed to analyze data. Are you too poor for our servers?' },
      { status: 500 }
    );
  }
}
