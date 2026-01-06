import '../styles/StepIndicator.css';

export default function StepIndicator({ steps, currentStep }) {
  return (
    <div className="step-indicator">
      <div className="steps-container">
        {steps.map((step, index) => (
          <div key={step.id} className="step-wrapper">
            <div
              className={`step ${
                currentStep === step.id
                  ? 'active'
                  : currentStep > step.id
                  ? 'completed'
                  : ''
              }`}
            >
              <div className="step-circle">
                {currentStep > step.id ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              <span className="step-label">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`step-connector ${currentStep > step.id ? 'completed' : ''}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
