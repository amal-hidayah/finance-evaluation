'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';
import { Brain, LineChart, CheckCircle2, ChevronRight, Activity, TrendingDown, Mic, MicOff, Download, Shield, BarChart3, Zap, Lock, AlertTriangle } from 'lucide-react';
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
  const [loadingMessage, setLoadingMessage] = useState('Menganalisis keputusan buruk Anda…');
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
    "Menganalisis keputusan buruk Anda",
    "Menjalankan audit realita finansial",
    "Mendeteksi pola pengeluaran",
    "Menghitung biaya peluang",
    "Menyiapkan tamparan kenyataan"
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
      setError('Sistem kami menolak memproses data Anda saat ini. Terlalu banyak orang dengan finansial hancur yang sedang antre. Silakan coba lagi dalam beberapa menit.');
    } finally {
      setIsLoading(false);
    }
  };

  const COLORS = ['#FF3366', '#FF9933', '#D4AF37', '#9966FF', '#00C49F', '#FFBB28'];

  // Calculate total expenses for chart summary
  const totalExpenses = result?.expenses?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

  const getScoreColor = (scoreStr) => {
    if (!scoreStr) return '#fff';
    const grade = scoreStr.trim().charAt(0).toUpperCase();
    switch (grade) {
      case 'A': return '#4ade80';
      case 'B': return '#a3e635';
      case 'C': return '#fbbf24';
      case 'D': return '#f97316';
      case 'F': return 'var(--accent-red)';
      default: return 'var(--text-primary)';
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'HIGH': return '#FF3366';
      case 'MEDIUM': return '#fbbf24';
      case 'LOW': return '#4ade80';
      default: return '#fff';
    }
  };

  const getRiskWidth = (level) => {
    switch (level) {
      case 'HIGH': return '90%';
      case 'MEDIUM': return '55%';
      case 'LOW': return '25%';
      default: return '50%';
    }
  };

  const getRiskLabel = (level) => {
    switch (level) {
      case 'HIGH': return '🔴 High Risk';
      case 'MEDIUM': return '🟡 Medium';
      case 'LOW': return '🟢 Stable';
      default: return level;
    }
  };

  return (
    <div className={styles.container}>
      <div ref={dashboardRef}>
        {/* Mobile-only Header */}
        {!result && !isLoading && (
          <header className={`${styles.mainHeader} ${styles.mobileHeader} ${styles.exportHeader}`}>
            <h1 className={styles.title}>Ruthless<span className={styles.titleHighlight}>Ledger</span></h1>
            <p className={styles.tagline}>Saya tidak menghakimi. Saya menghitung.</p>
          </header>
        )}

        <div className={styles.auditLayout}>
          {/* Left Side: The Content / Input */}
          <div className={styles.contentPanel}>
            {/* Desktop-only Header */}
            {!result && !isLoading && (
              <header className={`${styles.mainHeader} ${styles.desktopHeader}`}>
                <h1 className={styles.title}>Ruthless<span className={styles.titleHighlight}>Ledger</span></h1>
                <p className={styles.tagline}>Saya tidak menghakimi. Saya menghitung.</p>
                <p className={styles.subtitle}>Lacak pengeluaranmu. Hadapi polamu. Perbaiki kebiasaanmu.</p>
              </header>
            )}

            <main>
              {error && !isLoading && (
                <div style={{
                  padding: '1.25rem 1.5rem',
                  backgroundColor: 'rgba(255, 51, 102, 0.08)',
                  border: '1px solid rgba(255, 51, 102, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  color: '#ffb3c6',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <div style={{ flexShrink: 0, display: 'flex' }}>
                    <AlertTriangle size={24} style={{ color: 'var(--accent-red)' }} />
                  </div>
                  <p style={{ margin: 0, fontWeight: 500, lineHeight: 1.5, fontSize: '0.9rem' }}>
                    {error}
                  </p>
                </div>
              )}

              {!isLoading && !result && (
                <>
                  <section className={`${styles.inputSection} glass-panel`}>
                    <label htmlFor="finance-input" className={styles.promptLabel}>
                      Masukkan pemasukan & pengeluaran bulanan Anda. Biar saya yang urus.
                    </label>
                    <textarea
                      id="finance-input"
                      className={styles.textarea}
                      placeholder="Contoh: Gaji 8 juta. Kos 3 juta, ngopi 50rb/hari, nongkrong weekend 500rb, Netflix 150rb, pinjol 2 juta buat tiket konser..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                    <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                      <button
                        className={styles.button}
                        onClick={handleSubmit}
                        disabled={!input.trim() || isLoading}
                        style={{ flex: 1 }}
                      >
                        <Brain size={18} />
                        Jalankan Audit Finansial
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
                          background: isListening ? 'var(--accent-red)' : 'rgba(255, 255, 255, 0.06)',
                          color: isListening ? '#fff' : 'var(--text-secondary)'
                        }}
                      >
                        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                      </button>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => setInput("Gaji saya 8 juta sebulan. Tapi saya maksa ngekos eksklusif 3 juta biar kelihatan sukses. Tiap hari wajib beli kopi susu kekinian 50 ribu, dan weekend nongkrong habis 500 ribu. Terus kemarin khilaf pinjol 2 juta buat beli tiket konser. Sekarang sisa uang di rekening tinggal 150 ribu padahal gajian masih 2 minggu lagi.")}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'underline', cursor: 'pointer', transition: 'color 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                        onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                      >
                        Belum punya data? Gunakan data contoh →
                      </button>
                    </div>

                    {/* Trust Signals — inline inside the card */}
                    <div className={styles.trustInline}>
                      <span className={styles.trustInlineItem}>🔍 Analisis Pengeluaran</span>
                      <span className={styles.trustDivider}>·</span>
                      <span className={styles.trustInlineItem}>🧠 Insight Perilaku</span>
                      <span className={styles.trustDivider}>·</span>
                      <span className={styles.trustInlineItem}>📊 Optimasi Anggaran</span>
                    </div>
                  </section>

                  {/* Privacy & Social Proof */}
                  <div className={styles.trustFooter}>
                    <div className={styles.privacyNote}>
                      <Lock size={12} />
                      Data diproses real-time. Tidak ada yang disimpan.
                    </div>
                    <div className={styles.socialProof}>
                      Dipercaya <span className={styles.socialProofHighlight}>1.200+</span> pengguna
                    </div>
                  </div>
                </>
              )}

              {isLoading && (
                <div className={styles.loadingState}>
                  <div className={styles.spinner}></div>
                </div>
              )}

              {result && !isLoading && (
                <div className={styles.dashboard}>
                  {/* Savage Score + Risk Meter */}
                  {result.savage_score && (
                    <div className={`${styles.card} glass-panel`} style={{ textAlign: 'center', borderColor: getScoreColor(result.savage_score) }}>
                      <h3 style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Savage Score</h3>
                      <div style={{ fontSize: '1.6rem', fontWeight: '900', color: getScoreColor(result.savage_score), letterSpacing: '-0.02em' }}>
                        {result.savage_score}
                      </div>

                      {/* Risk Meter */}
                      {result.risk_level && (
                        <div className={styles.riskMeterContainer}>
                          <div className={styles.riskMeterBar}>
                            <div
                              className={styles.riskMeterFill}
                              style={{
                                width: getRiskWidth(result.risk_level),
                                background: `linear-gradient(90deg, ${getRiskColor(result.risk_level)}88, ${getRiskColor(result.risk_level)})`
                              }}
                            />
                          </div>
                          <span className={styles.riskMeterLabel} style={{ color: getRiskColor(result.risk_level) }}>
                            {getRiskLabel(result.risk_level)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Insights Panel */}
                  {result.insights && result.insights.length > 0 && (
                    <div className={`${styles.card} glass-panel`}>
                      <h2 className={styles.cardTitle}>
                        <Zap size={18} />
                        Insight Utama
                      </h2>
                      <div className={styles.insightsGrid}>
                        {result.insights.map((insight, index) => (
                          <div key={index} className={styles.insightItem}>
                            <AlertTriangle size={16} className={styles.insightIcon} />
                            <span>{insight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cash Flow Summary */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className={`${styles.card} glass-panel`}>
                      <h2 className={styles.cardTitle}>
                        <Activity size={18} />
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
                                innerRadius={55}
                                outerRadius={75}
                                paddingAngle={4}
                                dataKey="amount"
                                nameKey="category"
                              >
                                {result.expenses.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <RechartsTooltip
                                formatter={(value) => formatRupiah(value)}
                                contentStyle={{ backgroundColor: '#141418', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#f5f5f7', fontSize: '0.85rem' }}
                                itemStyle={{ color: '#f5f5f7' }}
                              />
                              <Legend wrapperStyle={{ color: '#f5f5f7', fontSize: '0.8rem' }} />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '2rem', fontSize: '0.9rem' }}>
                            Tidak ada data pengeluaran yang terdeteksi untuk divisualisasikan.
                          </div>
                        )}
                      </div>

                      {/* Needs / Wants / Savings Bar */}
                      {result.needs_wants_savings && (
                        <div className={styles.nwsContainer}>
                          <div className={styles.nwsBarTrack}>
                            <div className={styles.nwsSegment} style={{ width: `${result.needs_wants_savings.needs}%`, background: '#00C49F' }} />
                            <div className={styles.nwsSegment} style={{ width: `${result.needs_wants_savings.wants}%`, background: '#FF9933' }} />
                            <div className={styles.nwsSegment} style={{ width: `${result.needs_wants_savings.savings}%`, background: '#9966FF' }} />
                          </div>
                          <div className={styles.nwsLegend}>
                            <div className={styles.nwsLegendItem}>
                              <span className={styles.nwsDot} style={{ background: '#00C49F' }} />
                              Kebutuhan <span className={styles.nwsValue}>{result.needs_wants_savings.needs}%</span>
                            </div>
                            <div className={styles.nwsLegendItem}>
                              <span className={styles.nwsDot} style={{ background: '#FF9933' }} />
                              Keinginan <span className={styles.nwsValue}>{result.needs_wants_savings.wants}%</span>
                            </div>
                            <div className={styles.nwsLegendItem}>
                              <span className={styles.nwsDot} style={{ background: '#9966FF' }} />
                              Tabungan <span className={styles.nwsValue}>{result.needs_wants_savings.savings}%</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Opportunity Cost */}
                  {result.opportunity_cost && (
                    <div className={`${styles.card} glass-panel`} style={{ borderLeft: '3px solid #9966FF' }}>
                      <h2 className={styles.cardTitle} style={{ color: '#9966FF' }}>
                        <TrendingDown size={18} />
                        The Opportunity Cost
                      </h2>
                      <p className={styles.roastText} style={{ borderLeft: 'none', paddingLeft: 0 }}>
                        {result.opportunity_cost}
                      </p>
                    </div>
                  )}

                  {/* 30-Day Survival Plan */}
                  <div className={`${styles.card} glass-panel ${styles.glowGold}`}>
                    <h2 className={styles.cardTitle} style={{ color: 'var(--accent-gold)' }}>
                      <CheckCircle2 size={18} />
                      Rencana Anggaran Darurat (30 Hari)
                    </h2>
                    <ul className={styles.planList}>
                      {result.plan.map((item, index) => (
                        <li key={index} className={styles.planItem}>
                          <ChevronRight className={styles.planIcon} size={18} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div id="capture-buttons" style={{ display: 'flex', gap: '0.75rem', width: '100%', marginTop: '0.5rem' }}>
                    <button
                      className={`${styles.button} ${styles.resetButton}`}
                      onClick={() => {
                        setResult(null);
                        setInput('');
                      }}
                      style={{ flex: 1, margin: 0 }}
                    >
                      Audit Ulang
                    </button>

                    <button
                      className={styles.button}
                      onClick={downloadRealityCheck}
                      style={{ flex: 1, margin: 0, background: 'var(--accent-red)', color: '#fff' }}
                    >
                      <Download size={18} />
                      Unduh Laporan
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
