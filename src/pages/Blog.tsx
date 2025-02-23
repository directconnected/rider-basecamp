
import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import Breadcrumbs from "@/components/Breadcrumbs";

const Blog = () => {
  const posts = [
    {
      title: "Essential Motorcycle Maintenance Tips",
      date: "March 15, 2024",
      excerpt: "Keep your motorcycle in top condition with these maintenance tips...",
    },
    {
      title: "Best Scenic Routes in California",
      date: "March 10, 2024",
      excerpt: "Discover the most breathtaking motorcycle routes in California...",
    },
    {
      title: "Choosing the Right Riding Gear",
      date: "March 5, 2024",
      excerpt: "A comprehensive guide to selecting the perfect motorcycle gear...",
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Breadcrumbs />
      <main className="flex-1">
        <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Motorcycle Blog
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Latest news, tips, and stories from the road
              </p>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 max-w-4xl mx-auto">
              {posts.map((post, index) => (
                <Card key={index} className="hover-card">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="text-sm text-gray-500">{post.date}</div>
                      <h2 className="text-2xl font-bold">{post.title}</h2>
                      <p className="text-gray-600">{post.excerpt}</p>
                      <button className="text-theme-600 font-medium hover:text-theme-700">
                        Read more →
                      </button>
                    </div>
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

export default Blog;
