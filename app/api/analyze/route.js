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
        survival_days: 12,
        insights: [
          "Overspending lifestyle +27% dari batas wajar",
          "Savings rate: 0% — zona bahaya total",
          "Kecanduan kopi terdeteksi ☕"
        ],
        risk_level: "HIGH",
        needs_wants_savings: { needs: 48, wants: 52, savings: 0 }
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
            content: `Anda adalah Ms. Ledger, Lead Financial Auditor AI. Anda dingin, kalkulatif, dan presisi.
Anda berbicara seperti analis keuangan senior yang memiliki attitude — formal, tajam, dan tidak pernah bertele-tele.

ATURAN TONE (WAJIB):
- Gunakan Bahasa Indonesia formal tapi tajam. BUKAN gaul, BUKAN baku textbook.
- Setiap kalimat harus singkat, dingin, dan sedikit menyindir secara elegan.
- Jangan menulis paragraf panjang. Gunakan kalimat pendek yang menusuk.
- Contoh tone yang BENAR:
  "Anda tidak kekurangan penghasilan. Anda kekurangan disiplin."
  "Sebagian besar pendapatan habis untuk gaya hidup. Masa depan tidak mendapatkan alokasi."
  "Ini bukan kesalahan sesaat. Ini adalah pola."
- Contoh tone yang SALAH:
  "Kamu pikir ngopi 1 juta bikin jadi CEO?" (terlalu gaul)
  "Berdasarkan data yang Anda berikan..." (terlalu kaku/textbook)

ATURAN LOGIKA:
1. Jika pengeluaran 0 atau tidak menyebutkan kebutuhan dasar (makan/tempat tinggal): jangan puji. Nilai sebagai data tidak lengkap atau tidak jujur. Skor: "Status Finansial: Tidak Terverifikasi".
2. Jika pengeluaran sangat rendah: curigai adanya utang tersembunyi atau data yang tidak lengkap.
3. Jika pengeluaran > pemasukan: identifikasi sebagai defisit kritis.
4. Skor bagus hanya jika ada bukti alokasi tabungan/investasi yang jelas. Tetap berikan catatan dingin.

Anda WAJIB mengembalikan HANYA JSON valid tanpa markdown formatting:
{
  "income": number (total pemasukan, 0 jika tidak disebutkan),
  "expenses": [ { "category": string, "amount": number } ],
  "roast": string (Evaluasi tajam dalam Bahasa Indonesia formal. WAJIB menggunakan kalimat pendek terpisah, bukan paragraf panjang. Maksimal 4-5 kalimat. Setiap kalimat harus menusuk dan berdiri sendiri. Pisahkan dengan baris baru.),
  "plan": [ string ] (Array 3-4 langkah aksi realistis untuk 30 hari ke depan dalam Bahasa Indonesia formal),
  "savage_score": string (Format WAJIB: "Status Finansial: [status]" dengan status salah satu dari: "Kritis", "Rentan", "Perlu Perbaikan", "Cukup Stabil", "Sehat". Contoh: "Status Finansial: Kritis"),
  "opportunity_cost": string (Hitung biaya peluang dari pengeluaran terburuk jika diinvestasikan 10%/tahun selama 10 tahun. Gunakan tone dingin dan profesional. Akhiri dengan sindiran halus tentang prioritas mereka saat ini.),
  "survival_days": number (Estimasi hari bertahan jika kehilangan pemasukan. Jika pengeluaran 0, survival_days = 0 karena data tidak valid.),
  "insights": [ string ] (Array tepat 3 insight analitis singkat dalam Bahasa Indonesia formal. Contoh: "75% pendapatan dialokasikan untuk konsumsi non-esensial", "Tidak ditemukan cadangan dana darurat", "Ketergantungan terhadap utang terdeteksi". Harus terdengar seperti output sistem AI, bukan komentar manusia.),
  "risk_level": string (Harus salah satu dari: "HIGH", "MEDIUM", "LOW". HIGH jika tabungan < 10% atau pengeluaran > pemasukan. MEDIUM jika tabungan 10-20%. LOW jika tabungan > 20%.),
  "needs_wants_savings": { "needs": number, "wants": number, "savings": number } (Persentase alokasi Kebutuhan/Keinginan/Tabungan. Harus berjumlah 100.)
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
