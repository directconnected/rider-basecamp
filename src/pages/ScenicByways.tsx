
import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import { Route } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const scenicRoutes = [
  {
    id: 1,
    name: "Blue Ridge Parkway",
    description: "469 miles of scenic road connecting Shenandoah National Park to Great Smoky Mountains National Park.",
    state: "North Carolina & Virginia"
  },
  {
    id: 2,
    name: "Pacific Coast Highway",
    description: "655 miles of stunning coastal views along California's rugged coastline.",
    state: "California"
  },
  {
    id: 3,
    name: "Going-to-the-Sun Road",
    description: "50 miles of breathtaking views through Glacier National Park.",
    state: "Montana"
  },
  {
    id: 4,
    name: "Beartooth Highway",
    description: "68 miles of switchbacks and stunning mountain vistas.",
    state: "Montana & Wyoming"
  }
];

const ScenicByways = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Scenic Byways
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Experience America's most beautiful motorcycle roads
              </p>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-2">
              {scenicRoutes.map((route) => (
                <Card key={route.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Route className="h-5 w-5 text-theme-600" />
                      {route.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-2">{route.description}</p>
                    <p className="text-sm text-gray-500">{route.state}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ScenicByways;
