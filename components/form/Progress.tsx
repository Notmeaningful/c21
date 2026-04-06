'use client';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = ((current + 1) / total) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm font-semibold text-c21-black">
          Step {current + 1} of {total}
        </p>
        <p className="text-sm font-semibold text-c21-gold">{Math.round(percentage)}%</p>
      </div>
      <div className="w-full h-2 bg-c21-gray rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-c21-gold to-c21-gold-accent rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

interface StepIndicatorProps {
  steps: { id: string; title: string }[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="hidden lg:flex justify-between mb-12">
      {steps.map((step, index) => (
        <div
          key={index}
          className="flex flex-col items-center cursor-pointer"
          onClick={() => onStepClick(index)}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-all duration-300 ${
              index === currentStep
                ? 'bg-c21-gold text-c21-black shadow-lg scale-110'
                : index < currentStep
                ? 'bg-c21-gold text-c21-black opacity-70'
                : 'bg-c21-gray text-c21-dark-gray border-2 border-c21-dark-gray'
            }`}
          >
            {index < currentStep ? '✓' : index + 1}
          </div>
          <p
            className={`text-xs font-semibold text-center max-w-20 transition-colors duration-300 ${
              index === currentStep ? 'text-c21-gold' : index < currentStep ? 'text-c21-gold opacity-70' : 'text-c21-dark-gray'
            }`}
          >
            {step.title}
          </p>
        </div>
      ))}
    </div>
  );
}
