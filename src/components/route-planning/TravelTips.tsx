
import React from "react";

const TravelTips = () => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Travel Tips:</h3>
      <ul className="list-disc list-inside space-y-2 text-gray-700">
        <li>Plan to refuel at each suggested fuel stop to ensure you don't run low on gas</li>
        <li>Book accommodations in advance at the suggested overnight stops</li>
        <li>Take regular breaks every 2-3 hours to stay alert</li>
        <li>Check weather conditions before departing</li>
        <li>Keep emergency contacts and roadside assistance numbers handy</li>
      </ul>
    </div>
  );
};

export default TravelTips;
