
import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { 
  Newspaper, 
  Star, 
  Video, 
  Camera, 
  Rss 
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

const features = [
  {
    icon: Newspaper,
    title: "Latest News",
    description: "Stay updated with the latest motorcycle industry news.",
    link: "/latest-news"
  },
  {
    icon: Star,
    title: "Reviews",
    description: "Read comprehensive motorcycle and gear reviews.",
    link: "/reviews"
  },
  {
    icon: Video,
    title: "Video Content",
    description: "Watch motorcycle reviews, tutorials, and news coverage.",
    link: "/videos"
  },
  {
    icon: Camera,
    title: "Photo Gallery",
    description: "Browse photos of the latest motorcycles and events.",
    link: "/gallery"
  },
  {
    icon: Rss,
    title: "Subscribe",
    description: "Get the latest news delivered to your inbox.",
    link: "/news-subscribe"
  }
];

const News = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Breadcrumbs />
      
      <main className="flex-1">
        <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Motorcycle News
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Stay informed with the latest motorcycle news, reviews, and industry updates. Your source for everything two-wheeled.
              </p>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
              {features.map((feature) => (
                <Link 
                  to={feature.link}
                  key={feature.title}
                  className="block h-[300px]"
                >
                  <Card className="p-6 text-center h-full hover:shadow-lg transition-shadow duration-200">
                    <div className="h-full flex flex-col">
                      <div className="flex-none flex items-center justify-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-theme-100 text-theme-600 flex items-center justify-center">
                          <feature.icon size={24} />
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h3 className="text-lg font-bold mb-2 line-clamp-2">{feature.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-3">{feature.description}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default News;
