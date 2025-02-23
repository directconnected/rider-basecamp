
import React from 'react';
import Navigation from "@/components/Navigation";
import UpdateMSRP from "@/components/admin/UpdateMSRP";
import UpdateDescriptions from "@/components/admin/UpdateDescriptions";
import DataScraper from "@/components/admin/DataScraper";
import Breadcrumbs from "@/components/Breadcrumbs";

const Admin = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Breadcrumbs />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          
          <div className="space-y-6">
            <DataScraper />
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Database Management</h2>
              <div className="space-y-4">
                <UpdateMSRP />
                <UpdateDescriptions />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
