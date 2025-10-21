import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ConfidenceDisplayProps {
  confidence: number | null;
  isProcessing: boolean;
}

export const ConfidenceDisplay = ({ confidence, isProcessing }: ConfidenceDisplayProps) => {
  if (!confidence && !isProcessing) return null;

  const isHighConfidence = confidence !== null && confidence > 55;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-card rounded-xl p-6 border border-border shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Analysis Results
          </h3>
          {confidence !== null && (
            <div className="flex items-center gap-2">
              {isHighConfidence ? (
                <CheckCircle2 className="w-5 h-5 text-accent" />
              ) : (
                <AlertCircle className="w-5 h-5 text-destructive" />
              )}
            </div>
          )}
        </div>

        {isProcessing ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Processing image...</span>
              <span className="text-foreground font-medium">---%</span>
            </div>
            <Progress value={undefined} className="h-2" />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Confidence Level</span>
              <span className="text-2xl font-bold text-foreground">{confidence}%</span>
            </div>
            <Progress value={confidence || 0} className="h-2" />
            <p className={`text-sm ${isHighConfidence ? 'text-accent' : 'text-destructive'}`}>
              {isHighConfidence
                ? '✓ Confidence threshold met - Displaying 3D model'
                : '✗ Confidence below 55% threshold'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
