import React, { useState, useEffect } from 'react';
import { 
  X, Calculator, IndianRupee, TrendingUp, ShieldCheck, 
  HelpCircle, ArrowRight, CheckCircle2, Building2, Sliders, 
  Layers, Percent, AlertCircle 
} from 'lucide-react';

export default function SalaryCalculatorModal({ isOpen, onClose, initialCtc = 12, jobs = [] }) {
  const [activeSubTab, setActiveSubTab] = useState('calculator'); // 'calculator' | 'compare'
  const [ctcLpa, setCtcLpa] = useState(initialCtc || 12);
  const [regime, setRegime] = useState('new'); // 'new' | 'old'
  const [metroCity, setMetroCity] = useState(true);
  const [calculation, setCalculation] = useState(null);
  const [loading, setLoading] = useState(false);

  // Offer comparison state
  const [compareOffers, setCompareOffers] = useState([
    {
      id: 1,
      company: 'ABC Technologies',
      role: 'Frontend Engineer',
      ctc: 10,
      workMode: 'Hybrid (2 days)',
      bonus: '₹1.5 Lakhs annual',
      insurance: '₹5 Lakhs cover',
      esops: '₹2 Lakhs vested over 4 yrs'
    },
    {
      id: 2,
      company: 'Razorpay',
      role: 'Backend Intern / PPO',
      ctc: 14,
      workMode: 'Remote',
      bonus: '₹2.0 Lakhs performance',
      insurance: '₹7 Lakhs family cover',
      esops: '₹3.5 Lakhs ESOPs'
    }
  ]);

  const fetchCalculation = async (ctc, selectedRegime, isMetro) => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/salary/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ctcLpa: ctc,
          regime: selectedRegime,
          metroCity: isMetro
        })
      });
      const data = await res.json();
      if (data.success) {
        setCalculation(data.calculation);
      }
    } catch (err) {
      // Local fallback calculation if offline
      const annual = ctc * 100000;
      const basic = Math.round(annual * 0.45);
      const hra = Math.round(isMetro ? basic * 0.5 : basic * 0.4);
      const pf = Math.min(21600, Math.round(basic * 0.12));
      const pt = 2400;
      let tax = 0;
      const taxable = Math.max(0, annual - 75000);
      if (taxable > 700000) {
        tax = Math.round((taxable - 700000) * 0.15);
      }
      const inHand = Math.max(0, annual - pf - pt - tax);
      setCalculation({
        ctcLpa: ctc,
        regime: selectedRegime,
        annualCTC: annual,
        monthlyGross: Math.round(annual / 12),
        monthlyInHand: Math.round(inHand / 12),
        monthlyDeductions: {
          pf: Math.round(pf / 12),
          tax: Math.round(tax / 12),
          professionalTax: 200,
          total: Math.round(pf / 12) + Math.round(tax / 12) + 200
        },
        annualBreakdown: {
          basic,
          hra,
          specialAllowance: Math.max(0, annual - basic - hra - pf),
          gratuity: Math.round(basic * 0.0481),
          employerPF: pf,
          employeePF: pf,
          professionalTax: pt,
          annualTax: tax,
          standardDeduction: 75000,
          annualInHand: inHand
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCalculation(ctcLpa, regime, metroCity);
    }
  }, [isOpen, ctcLpa, regime, metroCity]);

  if (!isOpen) return null;

  const formatINR = (val) => {
    if (val === undefined || val === null) return '₹0';
    return '₹' + Number(val).toLocaleString('en-IN');
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="bottom-sheet" 
        style={{ maxHeight: '92%', height: 'auto', display: 'flex', flexDirection: 'column' }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-drag-handle" />

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '12px',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}>
              <Calculator size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.08rem', fontWeight: '800', color: '#fff' }}>
                Salary & In-Hand Take-Home
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Indian Income Tax Slabs FY 2026-27 • Transparent CTC Breakdown
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Sub Navigation Tabs */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '10px',
          padding: '3px',
          marginBottom: '16px',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setActiveSubTab('calculator')}
            style={{
              flex: 1,
              padding: '7px 12px',
              borderRadius: '8px',
              border: 'none',
              background: activeSubTab === 'calculator' ? 'var(--primary-gradient)' : 'transparent',
              color: '#fff',
              fontSize: '0.78rem',
              fontWeight: activeSubTab === 'calculator' ? '700' : '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Calculator size={14} />
            <span>In-Hand Calculator</span>
          </button>

          <button
            onClick={() => setActiveSubTab('compare')}
            style={{
              flex: 1,
              padding: '7px 12px',
              borderRadius: '8px',
              border: 'none',
              background: activeSubTab === 'compare' ? 'var(--primary-gradient)' : 'transparent',
              color: '#fff',
              fontSize: '0.78rem',
              fontWeight: activeSubTab === 'compare' ? '700' : '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Layers size={14} />
            <span>Compare Offers Matrix ({compareOffers.length})</span>
          </button>
        </div>

        {/* TAB 1: In-Hand Calculator */}
        {activeSubTab === 'calculator' && (
          <div style={{ overflowY: 'auto', paddingRight: '2px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* CTC Slider & Quick Presets */}
            <div className="glass-card" style={{ padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                  Annual Cost to Company (CTC)
                </span>
                <span style={{
                  fontSize: '1.15rem',
                  fontWeight: '800',
                  color: '#38bdf8',
                  fontFamily: 'var(--font-display)'
                }}>
                  ₹{ctcLpa} LPA
                </span>
              </div>

              <input
                type="range"
                min="3"
                max="60"
                step="0.5"
                value={ctcLpa}
                onChange={(e) => setCtcLpa(parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: '#38bdf8',
                  cursor: 'pointer',
                  marginBottom: '10px'
                }}
              />

              {/* Quick Pills */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {[6, 10, 15, 22, 30, 45].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setCtcLpa(amt)}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: `1px solid ${ctcLpa === amt ? '#38bdf8' : 'var(--border-subtle)'}`,
                      background: ctcLpa === amt ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      color: ctcLpa === amt ? '#38bdf8' : 'var(--text-muted)',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    ₹{amt}L
                  </button>
                ))}
              </div>
            </div>

            {/* Tax Regime & Location Toggles */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="glass-card" style={{ padding: '10px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Tax Regime
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => setRegime('new')}
                    style={{
                      flex: 1,
                      padding: '5px 4px',
                      borderRadius: '6px',
                      border: `1px solid ${regime === 'new' ? '#10b981' : 'var(--border-subtle)'}`,
                      background: regime === 'new' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                      color: regime === 'new' ? '#10b981' : 'var(--text-secondary)',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    New (Default)
                  </button>
                  <button
                    onClick={() => setRegime('old')}
                    style={{
                      flex: 1,
                      padding: '5px 4px',
                      borderRadius: '6px',
                      border: `1px solid ${regime === 'old' ? '#fbbf24' : 'var(--border-subtle)'}`,
                      background: regime === 'old' ? 'rgba(251, 191, 36, 0.15)' : 'transparent',
                      color: regime === 'old' ? '#fbbf24' : 'var(--text-secondary)',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Old Regime
                  </button>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '10px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Location / Metro HRA
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => setMetroCity(true)}
                    style={{
                      flex: 1,
                      padding: '5px 4px',
                      borderRadius: '6px',
                      border: `1px solid ${metroCity ? '#818cf8' : 'var(--border-subtle)'}`,
                      background: metroCity ? 'rgba(129, 140, 248, 0.15)' : 'transparent',
                      color: metroCity ? '#818cf8' : 'var(--text-secondary)',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Metro (50%)
                  </button>
                  <button
                    onClick={() => setMetroCity(false)}
                    style={{
                      flex: 1,
                      padding: '5px 4px',
                      borderRadius: '6px',
                      border: `1px solid ${!metroCity ? '#818cf8' : 'var(--border-subtle)'}`,
                      background: !metroCity ? 'rgba(129, 140, 248, 0.15)' : 'transparent',
                      color: !metroCity ? '#818cf8' : 'var(--text-secondary)',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Non-Metro
                  </button>
                </div>
              </div>
            </div>

            {/* In-Hand Monthly Hero Card */}
            {calculation && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 78, 59, 0.25) 100%)',
                border: '1.5px solid rgba(16, 185, 129, 0.4)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                textAlign: 'center',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.1)'
              }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#6ee7b7', fontWeight: '700', marginBottom: '4px' }}>
                  Estimated Monthly In-Hand Take-Home
                </div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '800',
                  color: '#ffffff',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.5px'
                }}>
                  {formatINR(calculation.monthlyInHand)}
                  <span style={{ fontSize: '0.9rem', color: '#a7f3d0', fontWeight: '500' }}> / month</span>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Annual In-Hand: <strong style={{ color: '#fff' }}>{formatINR(calculation.annualBreakdown.annualInHand)}</strong> • Gross: {formatINR(calculation.monthlyGross)}/mo
                </div>
              </div>
            )}

            {/* Monthly Deductions Summary */}
            {calculation && (
              <div className="glass-card" style={{ padding: '14px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#fff', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <TrendingUp size={15} color="#f43f5e" /> Monthly Deductions ({formatINR(calculation.monthlyDeductions.total)}/mo)
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Employee Provident Fund (EPF 12%)</span>
                    <span style={{ fontWeight: '600', color: '#fff' }}>- {formatINR(calculation.monthlyDeductions.pf)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Income Tax TDS (Regime: {regime})</span>
                    <span style={{ fontWeight: '600', color: calculation.monthlyDeductions.tax > 0 ? '#f43f5e' : '#10b981' }}>
                      {calculation.monthlyDeductions.tax > 0 ? `- ${formatINR(calculation.monthlyDeductions.tax)}` : '₹0 (Tax Free / Rebate)'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Professional Tax (PT)</span>
                    <span style={{ fontWeight: '600', color: '#fff' }}>- {formatINR(calculation.monthlyDeductions.professionalTax)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Annual CTC Slicing Details */}
            {calculation && (
              <div className="glass-card" style={{ padding: '14px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#fff', marginBottom: '10px' }}>
                  Annual CTC Component Slicing
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.74rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Basic Salary (45%)</span>
                    <span style={{ color: '#fff', fontWeight: '600' }}>{formatINR(calculation.annualBreakdown.basic)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>House Rent Allowance (HRA)</span>
                    <span style={{ color: '#fff', fontWeight: '600' }}>{formatINR(calculation.annualBreakdown.hra)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Special & Flexibility Allowance</span>
                    <span style={{ color: '#fff', fontWeight: '600' }}>{formatINR(calculation.annualBreakdown.specialAllowance)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Employer PF (Statutory Benefit)</span>
                    <span style={{ color: '#fff', fontWeight: '600' }}>{formatINR(calculation.annualBreakdown.employerPF)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Gratuity Provision (4.81%)</span>
                    <span style={{ color: '#fff', fontWeight: '600' }}>{formatINR(calculation.annualBreakdown.gratuity)}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#38bdf8',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '6px',
                    fontWeight: '700'
                  }}>
                    <span>Standard Deduction Applied</span>
                    <span>{formatINR(calculation.annualBreakdown.standardDeduction)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Compare Offers Matrix */}
        {activeSubTab === 'compare' && (
          <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
              Evaluate your shortlisted offers side-by-side to make the smartest career decision:
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
              {compareOffers.map((offer, idx) => {
                const estInHand = Math.round((offer.ctc * 100000 * 0.76) / 12);
                return (
                  <div 
                    key={offer.id} 
                    className="glass-card" 
                    style={{
                      padding: '14px',
                      border: idx === 1 ? '1.5px solid #10b981' : '1px solid var(--border-subtle)',
                      background: idx === 1 ? 'rgba(16, 185, 129, 0.04)' : 'rgba(255,255,255,0.02)'
                    }}
                  >
                    {idx === 1 && (
                      <span style={{
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#10b981',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        borderRadius: 'var(--radius-full)',
                        padding: '2px 8px',
                        fontSize: '0.64rem',
                        fontWeight: '700',
                        display: 'inline-block',
                        marginBottom: '6px'
                      }}>
                        ⭐ Highest In-Hand Value
                      </span>
                    )}

                    <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#fff', marginBottom: '2px' }}>
                      {offer.company}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      {offer.role}
                    </div>

                    <div style={{
                      padding: '8px 10px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      borderRadius: '8px',
                      marginBottom: '10px'
                    }}>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Annual Package</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#38bdf8' }}>₹{offer.ctc} LPA</div>
                      <div style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: '600' }}>
                        ~{formatINR(estInHand)}/mo in-hand
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.72rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Mode: </span>
                        <strong style={{ color: '#fff' }}>{offer.workMode}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Bonus: </span>
                        <strong style={{ color: '#fff' }}>{offer.bonus}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Insurance: </span>
                        <strong style={{ color: '#fff' }}>{offer.insurance}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>ESOPs: </span>
                        <strong style={{ color: '#fff' }}>{offer.esops}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              fontSize: '0.74rem',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={16} color="#38bdf8" />
              <span>
                Tip: Razorpay offers higher monthly liquidity & remote work savings, while ABC Tech provides localized mentorship.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
