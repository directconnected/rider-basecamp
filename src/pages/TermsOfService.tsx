
import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import Breadcrumbs from "@/components/Breadcrumbs";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Breadcrumbs />
      <main className="flex-1">
        <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Terms of Service
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Please read these terms carefully before using our service
              </p>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-8">
                <div className="prose prose-gray max-w-none">
                  <h2 className="text-2xl font-bold mb-4">1. Terms</h2>
                  <p className="mb-6">
                    By accessing this website, you are agreeing to be bound by these terms of service,
                    all applicable laws and regulations, and agree that you are responsible for compliance
                    with any applicable local laws.
                  </p>

                  <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
                  <p className="mb-6">
                    Permission is granted to temporarily download one copy of the materials (information
                    or software) on Rider Basecamp's website for personal, non-commercial transitory
                    viewing only.
                  </p>

                  <h2 className="text-2xl font-bold mb-4">3. Disclaimer</h2>
                  <p className="mb-6">
                    The materials on Rider Basecamp's website are provided on an 'as is' basis.
                    Rider Basecamp makes no warranties, expressed or implied, and hereby disclaims and
                    negates all other warranties including, without limitation, implied warranties or
                    conditions of merchantability, fitness for a particular purpose, or non-infringement
                    of intellectual property or other violation of rights.
                  </p>

                  <h2 className="text-2xl font-bold mb-4">4. Limitations</h2>
                  <p className="mb-6">
                    In no event shall Rider Basecamp or its suppliers be liable for any damages
                    (including, without limitation, damages for loss of data or profit, or due to
                    business interruption) arising out of the use or inability to use the materials on
                    Rider Basecamp's website.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
