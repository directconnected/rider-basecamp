
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { MotorcycleCondition } from "@/utils/motorcycleCalculations";

interface ValueAdjustmentProps {
  mileage: string;
  condition: MotorcycleCondition;
  onMileageChange: (value: string) => void;
  onConditionChange: (value: MotorcycleCondition) => void;
  onCalculate: () => void;
}

export const ValueAdjustment = ({
  mileage,
  condition,
  onMileageChange,
  onConditionChange,
  onCalculate
}: ValueAdjustmentProps) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium">Adjust Value Estimate</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="motorcycle-mileage" className="text-sm text-gray-600">
            Current Mileage
          </label>
          <Input
            id="motorcycle-mileage"
            name="motorcycle-mileage"
            type="number"
            placeholder="Enter current mileage"
            value={mileage}
            onChange={(e) => onMileageChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="motorcycle-condition" className="text-sm text-gray-600">
            Condition
          </label>
          <Select 
            value={condition} 
            onValueChange={onConditionChange}
            name="motorcycle-condition"
          >
            <SelectTrigger id="motorcycle-condition">
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excellent">Excellent</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="poor">Poor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button 
        onClick={onCalculate} 
        className="w-full"
        id="recalculate-button"
        name="recalculate"
      >
        Recalculate Value
      </Button>
    </div>
  );
};
