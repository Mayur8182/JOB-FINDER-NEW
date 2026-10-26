import React, { useState } from 'react';
import { 
  FileText, CheckCircle2, XCircle, Download, X, 
  Building2, ShieldCheck, Award, Briefcase, Calendar, MapPin
} from 'lucide-react';

export default function OfferLetterModal({
  application,
  onClose,
  onAccept,
  onDecline
}) {
  if (!application) return null;

  const [accepted, setAccepted] = useState(application.offerStatus === 'accepted');
  const [declined, setDeclined] = useState(application.offerStatus === 'declined');

  const company = application.company || 'Enterprise Solutions Ltd.';
  const jobTitle = application.jobTitle || 'Software Engineer';
  const salary = application.salary || '₹10,00,000 LPA';
  const location = application.location || 'Bangalore, India';
  const candidateName = application.applicantName || 'Candidate';
  const refNumber = `REF: ${company.replace(/[^A-Za-z]/g, '').slice(0, 4).toUpperCase()}/2026/OFF-${(application.id || '9876').slice(-4)}`;
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const handleAcceptClick = () => {
    setAccepted(true);
    setDeclined(false);
    if (onAccept) onAccept(application.id);
  };

  const handleDeclineClick = () => {
    setDeclined(true);
    setAccepted(false);
    if (onDecline) onDecline(application.id);
  };

  const handleDownloadPDF = () => {
    alert(`Downloading Official Offer Letter: ${company.replace(/\s+/g, '_')}_Offer_Letter.pdf`);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="bottom-sheet" 
        style={{ maxHeight: '92%', maxWidth: '420px', background: '#0d0d0d', border: '1px solid #333' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-drag-handle" />

        {/* Modal Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #262626', paddingBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: '900' }}>
              📄
            </div>
            <div>
              <div style={{ fontSize: '0.94rem', fontWeight: '800', color: '#fff' }}>Official Offer Letter</div>
              <div style={{ fontSize: '0.72rem', color: '#a3a3a3' }}>Issued by {company}</div>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Official Letterhead Paper Container */}
        <div style={{
          background: '#ffffff',
          color: '#111111',
          borderRadius: '12px',
          padding: '20px 18px',
          maxHeight: '60vh',
          overflowY: 'auto',
          boxShadow: '0 8px 30px rgba(0,0,0,0.7)',
          fontFamily: 'serif'
        }}>
          {/* Header & Logo */}
          <div style={{ borderBottom: '2px solid #111111', paddingBottom: '12px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#000', letterSpacing: '-0.5px', textTransform: 'uppercase', margin: 0, fontFamily: 'sans-serif' }}>
                {company}
              </h2>
              <div style={{ fontSize: '0.7rem', color: '#555', marginTop: '2px', fontFamily: 'sans-serif' }}>
                Human Capital & Global Talent Acquisition
              </div>
              <div style={{ fontSize: '0.66rem', color: '#777', fontFamily: 'sans-serif' }}>
                Corporate Towers, Tech Campus • {location}
              </div>
            </div>

            <div style={{ textAlign: 'right', fontFamily: 'sans-serif' }}>
              <div style={{ fontSize: '0.64rem', fontWeight: '700', color: '#000' }}>{refNumber}</div>
              <div style={{ fontSize: '0.64rem', color: '#666', marginTop: '2px' }}>Date: {dateStr}</div>
            </div>
          </div>

          {/* Recipient */}
          <div style={{ marginBottom: '14px', fontFamily: 'sans-serif', fontSize: '0.78rem', lineHeight: '1.4' }}>
            <div><strong>To:</strong> {candidateName}</div>
            <div><strong>Position:</strong> {jobTitle}</div>
            <div><strong>Location:</strong> {location}</div>
          </div>

          {/* Letter Body */}
          <div style={{ fontSize: '0.78rem', lineHeight: '1.6', color: '#222', marginBottom: '16px', textAlign: 'justify' }}>
            <p style={{ marginBottom: '8px' }}>
              Dear <strong>{candidateName}</strong>,
            </p>
            <p style={{ marginBottom: '8px' }}>
              On behalf of <strong>{company}</strong>, we are delighted to formally extend this offer of employment for the position of <strong>{jobTitle}</strong>. 
              Following your interviews and skill assessments, our leadership was thoroughly impressed with your problem-solving abilities and potential to contribute to our mission.
            </p>
            
            {/* Compensation Box */}
            <div style={{
              background: '#f4f4f5',
              border: '1px solid #d4d4d8',
              borderRadius: '8px',
              padding: '10px 14px',
              margin: '12px 0',
              fontFamily: 'sans-serif'
            }}>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#555', fontWeight: '700' }}>
                Annual Compensation & CTC Package
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#000', marginTop: '2px' }}>
                {salary}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#666', marginTop: '4px' }}>
                • Fixed Annual CTC + Performance Incentive + Group Comprehensive Health Cover
              </div>
            </div>

            <p style={{ marginBottom: '8px' }}>
              Your proposed joining period is within 15 days of offer acceptance. Please review the terms herein and execute your acceptance below.
            </p>
            <p>
              We look forward to welcoming you to the <strong>{company}</strong> team and achieving great milestones together.
            </p>
          </div>

          {/* Signatures & Corporate Seal */}
          <div style={{ borderTop: '1px solid #e4e4e7', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontFamily: 'sans-serif' }}>
            <div>
              <div style={{ fontStyle: 'italic', fontSize: '0.95rem', fontWeight: '700', color: '#111', fontFamily: 'cursive' }}>
                Sarah Jenkins
              </div>
              <div style={{ fontSize: '0.68rem', fontWeight: '700', color: '#000', marginTop: '2px' }}>Authorized HR Officer</div>
              <div style={{ fontSize: '0.62rem', color: '#666' }}>{company} Talent Board</div>
            </div>

            {/* Seal */}
            <div style={{
              border: '2px solid #000',
              borderRadius: '50%',
              width: '64px',
              height: '64px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '4px',
              transform: 'rotate(-8deg)'
            }}>
              <div style={{ fontSize: '0.5rem', fontWeight: '900', textTransform: 'uppercase' }}>SEAL</div>
              <div style={{ fontSize: '0.45rem', fontWeight: '700' }}>VERIFIED</div>
              <div style={{ fontSize: '0.4rem', color: '#444' }}>OFFICIAL</div>
            </div>
          </div>
        </div>

        {/* Status Callout if Accepted or Declined */}
        {accepted && (
          <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.4)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="#34d399" />
            <span style={{ fontSize: '0.78rem', color: '#fff', fontWeight: '700' }}>
              Offer Accepted! The HR team at {company} has been notified.
            </span>
          </div>
        )}

        {declined && (
          <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.4)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <XCircle size={16} color="#f43f5e" />
            <span style={{ fontSize: '0.78rem', color: '#fff', fontWeight: '700' }}>
              Offer Declined. Thank you for notifying {company}.
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
          {!accepted && !declined ? (
            <>
              <button
                onClick={handleAcceptClick}
                className="btn-primary"
                style={{ flex: 1, padding: '10px', fontSize: '0.82rem', gap: '6px' }}
              >
                <CheckCircle2 size={15} /> Accept Offer
              </button>

              <button
                onClick={handleDeclineClick}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid #333',
                  color: '#a3a3a3',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Decline
              </button>
            </>
          ) : (
            <button
              onClick={handleDownloadPDF}
              className="btn-primary"
              style={{ flex: 1, padding: '10px', fontSize: '0.82rem', gap: '6px' }}
            >
              <Download size={15} /> Download PDF Offer Letter
            </button>
          )}

          <button
            onClick={handleDownloadPDF}
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid #333',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Download PDF Copy"
          >
            <Download size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
