import React from 'react';
import { X, Check } from 'lucide-react';

export default function FilterModal({
  isOpen,
  onClose,
  filters,
  setFilters,
  onApplyFilters,
  onResetFilters
}) {
  if (!isOpen) return null;

  const jobTypes = ['All', 'Full Time', 'Internship', 'Part Time', 'Contract'];
  const experiences = ['All', 'Fresher', '0–1 years', '1–3 years', '3+ years'];
  const locations = ['All', 'Ahmedabad', 'Vadodara', 'Bangalore', 'Mumbai', 'Remote'];
  const workModes = ['All', 'Remote', 'Hybrid', 'On-site'];
  const salaries = [
    { label: 'All Packages', val: '' },
    { label: '₹3+ LPA', val: '3' },
    { label: '₹6+ LPA', val: '6' },
    { label: '₹10+ LPA', val: '10' }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="bottom-sheet" 
        style={{ maxHeight: '85%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-drag-handle" />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff' }}>Filter Jobs & Internships</h3>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Customize your opportunity search</span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            <X size={15} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '70px' }}>
          {/* Job Type */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px', display: 'block' }}>
              Job / Engagement Type
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {jobTypes.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilters({ ...filters, type: t })}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    border: `1px solid ${filters.type === t ? 'var(--primary)' : 'var(--border-subtle)'}`,
                    background: filters.type === t ? 'var(--primary-light)' : 'rgba(255, 255, 255, 0.03)',
                    color: filters.type === t ? '#fff' : 'var(--text-secondary)',
                    fontSize: '0.76rem',
                    fontWeight: filters.type === t ? '600' : '400',
                    cursor: 'pointer'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px', display: 'block' }}>
              Experience Level
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {experiences.map(exp => (
                <button
                  key={exp}
                  type="button"
                  onClick={() => setFilters({ ...filters, experience: exp })}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    border: `1px solid ${filters.experience === exp ? 'var(--primary)' : 'var(--border-subtle)'}`,
                    background: filters.experience === exp ? 'var(--primary-light)' : 'rgba(255, 255, 255, 0.03)',
                    color: filters.experience === exp ? '#fff' : 'var(--text-secondary)',
                    fontSize: '0.76rem',
                    fontWeight: filters.experience === exp ? '600' : '400',
                    cursor: 'pointer'
                  }}
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>

          {/* Work Mode */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px', display: 'block' }}>
              Work Mode
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {workModes.map(wm => (
                <button
                  key={wm}
                  type="button"
                  onClick={() => setFilters({ ...filters, workMode: wm })}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    border: `1px solid ${filters.workMode === wm ? 'var(--primary)' : 'var(--border-subtle)'}`,
                    background: filters.workMode === wm ? 'var(--primary-light)' : 'rgba(255, 255, 255, 0.03)',
                    color: filters.workMode === wm ? '#fff' : 'var(--text-secondary)',
                    fontSize: '0.76rem',
                    fontWeight: filters.workMode === wm ? '600' : '400',
                    cursor: 'pointer'
                  }}
                >
                  {wm}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px', display: 'block' }}>
              Preferred Location
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {locations.map(loc => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setFilters({ ...filters, location: loc })}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    border: `1px solid ${filters.location === loc ? 'var(--primary)' : 'var(--border-subtle)'}`,
                    background: filters.location === loc ? 'var(--primary-light)' : 'rgba(255, 255, 255, 0.03)',
                    color: filters.location === loc ? '#fff' : 'var(--text-secondary)',
                    fontSize: '0.76rem',
                    fontWeight: filters.location === loc ? '600' : '400',
                    cursor: 'pointer'
                  }}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Salary Min */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px', display: 'block' }}>
              Minimum Salary / Package
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {salaries.map(sal => (
                <button
                  key={sal.label}
                  type="button"
                  onClick={() => setFilters({ ...filters, salaryMin: sal.val })}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    border: `1px solid ${filters.salaryMin === sal.val ? 'var(--primary)' : 'var(--border-subtle)'}`,
                    background: filters.salaryMin === sal.val ? 'var(--primary-light)' : 'rgba(255, 255, 255, 0.03)',
                    color: filters.salaryMin === sal.val ? '#fff' : 'var(--text-secondary)',
                    fontSize: '0.76rem',
                    fontWeight: filters.salaryMin === sal.val ? '600' : '400',
                    cursor: 'pointer'
                  }}
                >
                  {sal.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '12px 20px 20px 20px',
          background: 'rgba(17, 24, 39, 0.95)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '10px'
        }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={onResetFilters}
            style={{ flex: 1 }}
          >
            Reset
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              onApplyFilters();
              onClose();
            }}
            style={{ flex: 2 }}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
