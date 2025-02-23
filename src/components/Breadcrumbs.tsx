
import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const routeConfig = {
  'top-roads': {
    parent: 'destinations',
    label: 'Top Roads'
  },
  'scenic-byways': {
    parent: 'destinations',
    label: 'Scenic Byways'
  },
  'gpx-downloads': {
    parent: 'destinations',
    label: 'GPX Downloads'
  },
  'featured-destinations': {
    parent: 'destinations',
    label: 'Featured Destinations'
  },
  'route-planning': {
    parent: 'destinations',
    label: 'Route Planning'
  },
  'destinations': {
    label: 'Destinations'
  },
  'data': {
    label: 'Motorcycle Data'
  },
  'service': {
    label: 'Service Records'
  },
  'camping-gear': {
    label: 'Camping Gear'
  },
  'riding-gear': {
    label: 'Riding Gear'
  },
  'admin': {
    label: 'Admin'
  }
};

const getBreadcrumbs = (pathname: string) => {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs = [];
  
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const config = routeConfig[path as keyof typeof routeConfig];
    
    if (config) {
      // If this route has a parent, add it first
      if (config.parent && !paths.includes(config.parent)) {
        breadcrumbs.push({
          label: routeConfig[config.parent as keyof typeof routeConfig].label,
          url: `/${config.parent}`
        });
      }
      
      // Add the current route
      breadcrumbs.push({
        label: config.label,
        url: `/${paths.slice(0, i + 1).join('/')}`
      });
    }
  }
  
  return breadcrumbs;
};

const Breadcrumbs = () => {
  const location = useLocation();
  const breadcrumbs = getBreadcrumbs(location.pathname);

  if (location.pathname === '/') return null;

  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4">
        <Breadcrumb className="py-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="flex items-center">
                  <Home className="h-4 w-4" />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>

            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.url}>
                <BreadcrumbItem>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={crumb.url}>{crumb.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && (
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4" />
                  </BreadcrumbSeparator>
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};

export default Breadcrumbs;
