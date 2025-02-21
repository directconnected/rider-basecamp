
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
                <p className="text-gray-600">
                  Have questions about our advertising solutions? We're here to help!
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <Card className="p-6 text-center hover-card">
                  <Mail className="w-8 h-8 mx-auto mb-4 text-theme-600" />
                  <h3 className="font-bold mb-2">Email Us</h3>
                  <p className="text-gray-600">support@motovalues.com</p>
                </Card>
                <Card className="p-6 text-center hover-card">
                  <Phone className="w-8 h-8 mx-auto mb-4 text-theme-600" />
                  <h3 className="font-bold mb-2">Call Us</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </Card>
              </div>

              <Card className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name
                    </label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="button-gradient w-full">
                    Send Message
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Contact;
