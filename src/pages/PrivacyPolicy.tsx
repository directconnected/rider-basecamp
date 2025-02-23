
import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import Breadcrumbs from "@/components/Breadcrumbs";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Breadcrumbs />
      <main className="flex-1">
        <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Privacy Policy
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                How we collect, use, and protect your information
              </p>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-8">
                <div className="prose prose-gray max-w-none">
                  <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                  <p className="mb-6">
                    We collect information that you provide directly to us, including but not limited
                    to your name, email address, and any other information you choose to provide.
                  </p>

                  <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
                  <p className="mb-6">
                    We use the information we collect to provide, maintain, and improve our services,
                    to communicate with you, and to personalize your experience.
                  </p>

                  <h2 className="text-2xl font-bold mb-4">3. Information Sharing</h2>
                  <p className="mb-6">
                    We do not share your personal information with third parties except as described
                    in this privacy policy. We may share your information with service providers who
                    assist us in operating our website and conducting our business.
                  </p>

                  <h2 className="text-2xl font-bold mb-4">4. Security</h2>
                  <p className="mb-6">
                    We take reasonable measures to help protect information about you from loss, theft,
                    misuse, and unauthorized access, disclosure, alteration, and destruction.
                  </p>

                  <h2 className="text-2xl font-bold mb-4">5. Cookies</h2>
                  <p className="mb-6">
                    We use cookies and similar tracking technologies to track the activity on our
                    service and hold certain information. You can instruct your browser to refuse all
                    cookies or to indicate when a cookie is being sent.
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

export default PrivacyPolicy;
