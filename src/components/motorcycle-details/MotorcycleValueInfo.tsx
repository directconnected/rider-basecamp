
import { formatCurrency } from "@/utils/motorcycleCalculations";

interface MotorcycleValueInfoProps {
  currentValue: number | null;
  msrp: number | null;
}

export const MotorcycleValueInfo = ({ currentValue, msrp }: MotorcycleValueInfoProps) => {
  return (
    <div className="space-y-6 mb-6">
      <div>
        <p className="text-gray-500 text-sm">Estimated Current Value</p>
        <p className="text-3xl font-bold text-theme-600">
          {formatCurrency(currentValue)}
        </p>
      </div>
      
      <div>
        <p className="text-gray-500 text-sm">Original MSRP</p>
        <p className="text-xl font-semibold mb-6">
          {formatCurrency(msrp)}
        </p>
      </div>
    </div>
  );
};
