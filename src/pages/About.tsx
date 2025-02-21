import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Users2, History, Target } from "lucide-react";
import Navigation from "@/components/Navigation";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                About Moto Values
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Your trusted partner in motorcycle valuations since 2020
              </p>
            </div>
          </div>
        </section>

        {/* Company Overview */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  The Leading Platform for Motorcycle Valuations
                </h2>
                <p className="text-gray-600 mb-6">
                  At Moto Values, we're passionate about providing accurate, real-time motorcycle valuations to enthusiasts, dealers, and collectors worldwide. Our platform combines advanced analytics with extensive market data to deliver precise valuations you can trust.
                </p>
                <p className="text-gray-600">
                  Founded by motorcycle enthusiasts, we understand the importance of having reliable valuation data when making buying or selling decisions. Our team of experts continuously updates our database and refines our valuation algorithms to ensure you get the most accurate estimates.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { 
                    icon: Building2,
                    title: "Global Presence",
                    value: "25+ Countries"
                  },
                  {
                    icon: Users2,
                    title: "Active Users",
                    value: "100K+"
                  },
                  {
                    icon: History,
                    title: "Years of Data",
                    value: "15+ Years"
                  },
                  {
                    icon: Target,
                    title: "Accuracy Rate",
                    value: "98%"
                  }
                ].map((stat) => (
                  <Card key={stat.title} className="p-6 text-center hover-card">
                    <stat.icon className="w-8 h-8 mx-auto mb-4 text-theme-600" />
                    <h3 className="font-bold mb-2">{stat.title}</h3>
                    <p className="text-gray-600">{stat.value}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-8">
                To provide transparent, accurate, and reliable motorcycle valuations that empower our users to make informed decisions in the motorcycle market. We strive to be the most trusted source of motorcycle market data worldwide.
              </p>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Accuracy",
                    description: "Data-driven valuations you can trust"
                  },
                  {
                    title: "Transparency",
                    description: "Clear methodology and market insights"
                  },
                  {
                    title: "Innovation",
                    description: "Continuous platform improvements"
                  }
                ].map((value) => (
                  <div key={value.title}>
                    <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">About Us</h3>
              <p className="text-gray-400">
                Your trusted source for accurate motorcycle valuations and market insights.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-theme-400 transition-colors">Home</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-theme-400 transition-colors">About</Link></li>
                <li><Link to="/advertise" className="text-gray-400 hover:text-theme-400 transition-colors">Advertise</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-theme-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/blog" className="text-gray-400 hover:text-theme-400 transition-colors">Blog</Link></li>
                <li><Link to="/docs" className="text-gray-400 hover:text-theme-400 transition-colors">Documentation</Link></li>
                <li><Link to="/support" className="text-gray-400 hover:text-theme-400 transition-colors">Support</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-theme-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Newsletter</h3>
              <p className="text-gray-400 mb-4">Stay updated with our latest valuations.</p>
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter your email" 
                  className="bg-gray-800 border-gray-700"
                />
                <Button className="button-gradient">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Moto Values. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
