
interface MotorcycleSpecItemProps {
  label: string;
  value: string | null;
}

export const MotorcycleSpecItem = ({ label, value }: MotorcycleSpecItemProps) => {
  if (!value) return null;
  
  return (
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-base">{value}</p>
    </div>
  );
};
