
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

interface BaseRouteConfig {
  label: string;
}

interface ChildRouteConfig extends BaseRouteConfig {
  parent: string;
}

interface ParentRouteConfig extends BaseRouteConfig {
  parent?: never;
}

type RouteConfig = ChildRouteConfig | ParentRouteConfig;

const routeConfig: Record<string, RouteConfig> = {
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
  'tents': {
    parent: 'camping-gear',
    label: 'Tents'
  },
  'riding-gear': {
    label: 'Riding Gear'
  },
  'admin': {
    label: 'Admin'
  },
  'blog': {
    label: 'Blog'
  },
  'docs': {
    label: 'Documentation'
  },
  'terms': {
    label: 'Terms of Service'
  },
  'privacy': {
    label: 'Privacy Policy'
  }
};

const getBreadcrumbs = (pathname: string) => {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs: Array<{ label: string; url: string }> = [];
  
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const config = routeConfig[path];
    
    if (config) {
      // Check if this route has a parent and it's a child route
      if ('parent' in config && config.parent && !paths.includes(config.parent)) {
        const parentConfig = routeConfig[config.parent];
        if (parentConfig) {
          breadcrumbs.push({
            label: parentConfig.label,
            url: `/${config.parent}`
          });
        }
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
