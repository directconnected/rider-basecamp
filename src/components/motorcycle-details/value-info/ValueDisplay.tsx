
import { formatCurrency } from "@/utils/motorcycleCalculations";

interface ValueDisplayProps {
  msrp: number | null;
  calculatedValue: number | null;
}

export const ValueDisplay = ({ msrp, calculatedValue }: ValueDisplayProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Value Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-gray-500 text-sm">Original MSRP</p>
          <p className="text-xl font-semibold">{formatCurrency(msrp)}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Estimated Value</p>
          <p className="text-2xl font-bold text-theme-600">
            {formatCurrency(calculatedValue)}
          </p>
        </div>
      </div>
    </div>
  );
};
