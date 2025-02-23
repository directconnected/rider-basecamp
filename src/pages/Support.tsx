
import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Mail, Phone, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Breadcrumbs from "@/components/Breadcrumbs";

const Support = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Breadcrumbs />
      <main className="flex-1">
        <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Support Center
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                We're here to help with any questions you may have
              </p>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <MessageCircle className="h-5 w-5 text-theme-600" />
                          <span className="font-medium">Live Chat</span>
                        </div>
                        <p className="text-gray-600">Available Monday to Friday, 9am-5pm PST</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-theme-600" />
                          <span className="font-medium">Email Support</span>
                        </div>
                        <p className="text-gray-600">support@riderbasecamp.com</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-theme-600" />
                          <span className="font-medium">Phone Support</span>
                        </div>
                        <p className="text-gray-600">1-800-RIDER-HELP</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                <Card>
                  <CardContent className="p-6">
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Name</label>
                        <Input placeholder="Your name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <Input type="email" placeholder="Your email" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Message</label>
                        <Textarea 
                          placeholder="How can we help?"
                          className="min-h-[150px]"
                        />
                      </div>
                      <Button className="w-full">Send Message</Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Support;
