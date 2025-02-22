
import { Motorcycle } from "@/types/motorcycle";
import { MotorcycleSpecItem } from "./MotorcycleSpecItem";

interface MotorcycleSpecificationsProps {
  motorcycle: Motorcycle;
}

export const MotorcycleSpecifications = ({ motorcycle }: MotorcycleSpecificationsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
      <MotorcycleSpecItem label="Engine Type" value={motorcycle.engine_type} />
      <MotorcycleSpecItem label="Transmission" value={motorcycle.transmission} />
      <MotorcycleSpecItem label="Clutch" value={motorcycle.clutch} />
      <MotorcycleSpecItem label="Front Suspension" value={motorcycle.front_suspension} />
      <MotorcycleSpecItem label="Rear Suspension" value={motorcycle.rear_suspension} />
      <MotorcycleSpecItem label="Front Brakes" value={motorcycle.front_brakes} />
      <MotorcycleSpecItem label="Rear Brakes" value={motorcycle.rear_brakes} />
      <MotorcycleSpecItem label="Front Tire" value={motorcycle.front_tire} />
      <MotorcycleSpecItem label="Rear Tire" value={motorcycle.rear_tire} />
      <MotorcycleSpecItem label="Rake" value={motorcycle.rake} />
      <MotorcycleSpecItem label="Trail" value={motorcycle.trail} />
      <MotorcycleSpecItem label="Wheelbase" value={motorcycle.wheelbase} />
      <MotorcycleSpecItem label="Seat Height" value={motorcycle.seat_height} />
      <MotorcycleSpecItem label="Ground Clearance" value={motorcycle.ground_clearance} />
      <MotorcycleSpecItem label="Fuel Capacity" value={motorcycle.fuel_capacity} />
      <MotorcycleSpecItem label="Curb Weight" value={motorcycle.curb_weight} />
      <MotorcycleSpecItem label="Colors" value={motorcycle.colors} />
    </div>
  );
};
