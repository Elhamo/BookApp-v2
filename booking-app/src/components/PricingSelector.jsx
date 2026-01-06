import '../styles/PricingSelector.css';

export default function PricingSelector({ options, selected, onSelect }) {
  return (
    <div className="pricing-selector">
      {options.map((option) => (
        <div
          key={option.id}
          className={`pricing-option ${selected?.id === option.id ? 'selected' : ''}`}
          onClick={() => onSelect(option)}
        >
          <div className="option-content">
            <div className="option-icons">
              {/* Parent icons */}
              {[...Array(option.parents)].map((_, i) => (
                <svg key={`parent-${i}`} className="icon-parent" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              ))}
              {/* Plus sign */}
              <span className="icon-plus">+</span>
              {/* Child icons */}
              {[...Array(option.children)].map((_, i) => (
                <svg key={`child-${i}`} className="icon-child" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="6" r="3"/>
                  <path d="M12 11c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"/>
                </svg>
              ))}
            </div>
            <span className="option-label">{option.label}</span>
          </div>
          <div className="option-price">
            <span className="price-amount">€{option.price},-</span>
            <span className="price-info">8 Einheiten</span>
          </div>
          <div className="option-check">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}
