'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';
import { Flame, Brain, LineChart, CheckCircle2, ChevronRight, Activity, TrendingDown, Mic, MicOff, Download } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

const TypewriterText = ({ text, delay = 20 }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return <span>{currentText}</span>;
};

export default function Home() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState('Menganalisis data finansial Anda...');
  const [result, setResult] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const dashboardRef = useRef(null);

  const downloadRealityCheck = async () => {
    if (!dashboardRef.current) return;

    const captureArea = dashboardRef.current;
    const buttons = document.getElementById('capture-buttons');

    if (buttons) buttons.style.display = 'none';
    captureArea.classList.add(styles.isCapturing);

    // Wait for DOM to update
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(captureArea, {
        backgroundColor: '#0a0a0c',
        scale: 2,
        useCORS: true
      });
      const image = canvas.toDataURL("image/jpeg", 0.9);
      const link = document.createElement("a");
      link.href = image;
      link.download = "ruthless-reality-check.jpg";
      link.click();
    } catch (error) {
      console.error("Failed to generate image:", error);
      alert("Gagal mengunduh gambar. Pastikan Anda sudah menginstal library html2canvas.");
    } finally {
      if (buttons) buttons.style.display = 'flex';
      captureArea.classList.remove(styles.isCapturing);
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  };

  const loadingMessages = [
    "Membaca alasan klise Anda",
    "Menghitung berapa banyak uang yang Anda bakar",
    "Menyiapkan mental untuk melihat kebodohan finansial ini",
    "Menganalisis gaya hidup 'sultan' Anda",
    "Mencari sisa-sisa harapan di dompet Anda"
  ];

  useEffect(() => {
    let interval;
    if (isLoading) {
      let i = 0;
      interval = setInterval(() => {
        i = (i + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[i]);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.lang = 'id-ID';
        rec.continuous = false;
        rec.interimResults = false;

        rec.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInput((prev) => prev ? prev + ' ' + transcript : transcript);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        rec.onerror = (event) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        setRecognition(rec);
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) {
      alert("Browser Anda tidak mendukung fitur suara. Silakan gunakan browser Google Chrome atau Safari versi terbaru.");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch (e) {
        console.error("Could not start recognition:", e);
      }
    }
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });

      if (!response.ok) throw new Error('API Error');

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Sistem kami menolak memproses data Anda. Terlalu banyak orang dengan finansial hancur yang sedang antre. Silakan coba lagi dalam beberapa menit jika Anda masih punya sisa kuota internet.');
    } finally {
      setIsLoading(false);
    }
  };

  const COLORS = ['#FF3366', '#FF9933', '#D4AF37', '#9966FF', '#00C49F', '#FFBB28'];

  // Calculate total expenses for chart summary
  const totalExpenses = result?.expenses?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

  const getScoreColor = (scoreStr) => {
    if (!scoreStr) return '#fff';
    // Get the first character (the grade) and convert to uppercase
    const grade = scoreStr.trim().charAt(0).toUpperCase();
    switch (grade) {
      case 'A': return '#4ade80'; // Green
      case 'B': return '#a3e635'; // Lime/Light Green
      case 'C': return '#fbbf24'; // Yellow
      case 'D': return '#f97316'; // Orange
      case 'F': return 'var(--accent-red)'; // Red
      default: return 'var(--text-primary)';
    }
  };

  return (
    <div className={styles.container}>
      <div ref={dashboardRef}>
        {/* Mobile-only Header */}
        {!result && !isLoading && (
          <header className={`${styles.mainHeader} ${styles.mobileHeader} ${styles.exportHeader}`}>
            <h1 className={styles.title}>Ruthless<span className={styles.titleHighlight}>Ledger</span></h1>
            <p className={styles.subtitle}>Ms. Ledger is ready to review your poor financial choices.</p>
          </header>
        )}

        <div className={styles.auditLayout}>
          {/* Left Side: The Content / Input */}
          <div className={styles.contentPanel}>
            {/* Desktop-only Header */}
            {!result && !isLoading && (
              <header className={`${styles.mainHeader} ${styles.desktopHeader}`}>
                <h1 className={styles.title}>Ruthless<span className={styles.titleHighlight}>Ledger</span></h1>
                <p className={styles.subtitle}>Ms. Ledger is ready to review your poor financial choices. Submit your expenses and face the reality check.</p>
              </header>
            )}

            <main>
              {error && !isLoading && (
                <div style={{
                  padding: '1.5rem',
                  backgroundColor: 'rgba(255, 51, 102, 0.1)',
                  border: '1px solid var(--accent-red)',
                  borderRadius: '12px',
                  color: '#ffb3c6',
                  marginBottom: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{ flexShrink: 0, display: 'flex' }}>
                    <Flame size={32} style={{ color: 'var(--accent-red)' }} />
                  </div>
                  <p style={{ margin: 0, fontWeight: 500, lineHeight: 1.5, fontSize: '1.05rem' }}>
                    {error}
                  </p>
                </div>
              )}

              {!isLoading && !result && (
                <section className={`${styles.inputSection} glass-panel`}>
                  <label htmlFor="finance-input" className={styles.promptLabel}>
                    Laporkan kebobrokan finansial Anda bulan ini:
                  </label>
                  <textarea
                    id="finance-input"
                    className={styles.textarea}
                    placeholder="Contoh: Gaji bulan ini 5 juta. Pengeluaran: bayar kos 1.5 juta, ngopi 1 juta, langganan streaming 150 ribu, hiburan 500 ribu..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                    <button
                      className={styles.button}
                      onClick={handleSubmit}
                      disabled={!input.trim() || isLoading}
                      style={{ flex: 1 }}
                    >
                      <Brain size={20} />
                      Mulai Audit
                    </button>

                    <button
                      className={`${styles.button} ${isListening ? 'animate-pulse' : ''}`}
                      onClick={toggleListening}
                      disabled={isLoading}
                      title={isListening ? "Hentikan Perekaman" : "Gunakan Suara"}
                      style={{
                        flex: '0 0 auto',
                        aspectRatio: '1 / 1',
                        padding: '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isListening ? 'var(--accent-red)' : 'rgba(255, 255, 255, 0.1)',
                        color: isListening ? '#fff' : 'var(--text-primary)'
                      }}
                    >
                      {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>
                  </div>

                  <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                    <button
                      onClick={() => setInput("Gaji saya 8 juta sebulan. Tapi saya maksa ngekos eksklusif 3 juta biar kelihatan sukses. Tiap hari wajib beli kopi susu kekinian 50 ribu, dan weekend nongkrong habis 500 ribu. Terus kemarin khilaf pinjol 2 juta buat beli tiket konser. Sekarang sisa uang di rekening tinggal 150 ribu padahal gajian masih 2 minggu lagi.")}
                      style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'underline', cursor: 'pointer', transition: 'color 0.2s' }}
                      onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                      onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                    >
                      Gak berani pakai data asli? [Gunakan Data Simulasi]
                    </button>
                  </div>
                </section>
              )}

              {isLoading && (
                <div className={styles.loadingState}>
                  <div className={styles.spinner}></div>
                </div>
              )}

              {result && !isLoading && (
                <div className={styles.dashboard}>
                  {/* Savage Score Badge */}
                  {result.savage_score && (
                    <div className={`${styles.card} glass-panel`} style={{ padding: '1.5rem', textAlign: 'center', borderColor: getScoreColor(result.savage_score) }}>
                      <h3 style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Savage Score</h3>
                      <div style={{ fontSize: '1.8rem', fontWeight: '900', color: getScoreColor(result.savage_score) }}>
                        {result.savage_score}
                      </div>
                    </div>
                  )}

                  {/* Left Column: Chart & Stats */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className={`${styles.card} glass-panel`}>
                      <h2 className={styles.cardTitle}>
                        <Activity className={styles.planIcon} />
                        Ringkasan Arus Kas
                      </h2>

                      <div className={styles.summaryCards}>
                        <div className={styles.statCard}>
                          <div className={styles.statLabel}>Income</div>
                          <div className={`${styles.statValue} ${styles.statIncome}`}>
                            {formatRupiah(result.income)}
                          </div>
                        </div>
                        <div className={styles.statCard}>
                          <div className={styles.statLabel}>Expenses</div>
                          <div className={`${styles.statValue} ${styles.statExpense}`}>
                            {formatRupiah(totalExpenses)}
                          </div>
                        </div>
                        {result.survival_days !== undefined && (
                          <div className={styles.statCard}>
                            <div className={styles.statLabel}>Survival Rate</div>
                            <div className={styles.statValue} style={{ color: result.survival_days < 14 ? 'var(--accent-red)' : '#4ade80' }}>
                              {result.survival_days} Hari
                            </div>
                          </div>
                        )}
                      </div>

                      <div className={styles.chartContainer}>
                        {result.expenses && result.expenses.length > 0 && totalExpenses > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={result.expenses}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="amount"
                                nameKey="category"
                              >
                                {result.expenses.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <RechartsTooltip
                                formatter={(value) => formatRupiah(value)}
                                contentStyle={{ backgroundColor: '#1a1a1f', border: '1px solid #2a2a35', borderRadius: '8px', color: '#f5f5f7' }}
                                itemStyle={{ color: '#f5f5f7' }}
                              />
                              <Legend wrapperStyle={{ color: '#f5f5f7' }} />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'center', padding: '2rem' }}>
                            Tidak ada data pengeluaran yang terdeteksi untuk divisualisasikan.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Opportunity Cost & Survival Plan */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {result.opportunity_cost && (
                      <div className={`${styles.card} glass-panel`} style={{ borderLeft: '4px solid #9966FF' }}>
                        <h2 className={styles.cardTitle} style={{ color: '#9966FF' }}>
                          <TrendingDown size={24} />
                          The Opportunity Cost
                        </h2>
                        <p className={styles.roastText} style={{ borderLeft: 'none', paddingLeft: 0 }}>
                          {result.opportunity_cost}
                        </p>
                      </div>
                    )}

                    <div className={`${styles.card} glass-panel ${styles.glowGold}`} style={{ height: '100%' }}>
                      <h2 className={styles.cardTitle} style={{ color: 'var(--accent-gold)' }}>
                        <CheckCircle2 size={24} />
                        Rencana Anggaran Darurat (30 Hari)
                      </h2>
                      <ul className={styles.planList}>
                        {result.plan.map((item, index) => (
                          <li key={index} className={styles.planItem}>
                            <ChevronRight className={styles.planIcon} size={20} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div id="capture-buttons" style={{ display: 'flex', gap: '1rem', width: '100%', marginTop: '2rem' }}>
                    <button
                      className={`${styles.button} ${styles.resetButton}`}
                      onClick={() => {
                        setResult(null);
                        setInput('');
                      }}
                      style={{ flex: 1, margin: 0 }}
                    >
                      Evaluasi Ulang Data Baru
                    </button>

                    <button
                      className={styles.button}
                      onClick={downloadRealityCheck}
                      style={{ flex: 1, margin: 0, background: 'var(--accent-red)', color: '#fff' }}
                    >
                      <Download size={20} />
                      Sebarkan Aib Ini
                    </button>
                  </div>
                </div>
              )}
            </main>
          </div>

          {/* Right Side: The Auditor Character */}
          <div className={styles.characterPanel}>
            <img src="/hero.png" alt="Ms. Ledger" className={styles.avatarLarge} />

            {(isLoading || result) && (
              <div className={`${styles.speechBubble} ${isLoading ? styles.bubbleLoading : styles.bubbleResult}`}>
                {isLoading && <span className={styles.typingDots}>{loadingMessage}</span>}
                {result && !isLoading && <TypewriterText text={result.roast} />}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
