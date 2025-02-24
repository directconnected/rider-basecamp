
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
  'camping-hub': {
    label: 'Camping Hub'
  },
  'riding-gear': {
    label: 'Riding Gear'
  },
  'tents': {
    parent: 'riding-gear',
    label: 'Motorcycle Tents'
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
  },
  'dealers': {
    label: 'Dealers'
  },
  'parts': {
    label: 'Parts'
  },
  'part-search': {
    parent: 'parts',
    label: 'Part Search'
  },
  'compatibility': {
    parent: 'parts',
    label: 'Compatibility'
  },
  'price-compare': {
    parent: 'parts',
    label: 'Price Compare'
  },
  'installation-guides': {
    parent: 'parts',
    label: 'Installation Guides'
  },
  'catalog': {
    parent: 'parts',
    label: 'Parts Catalog'
  },
  'group-rides': {
    label: 'Group Rides'
  },
  'find-groups': {
    parent: 'group-rides',
    label: 'Find Groups'
  },
  'events': {
    parent: 'group-rides',
    label: 'Events'
  },
  'discussions': {
    parent: 'group-rides',
    label: 'Discussions'
  },
  'share-rides': {
    parent: 'group-rides',
    label: 'Share Rides'
  },
  'rentals': {
    label: 'Rentals'
  },
  'browse-rentals': {
    parent: 'rentals',
    label: 'Browse Rentals'
  },
  'rental-locations': {
    parent: 'rentals',
    label: 'Locations'
  },
  'availability': {
    parent: 'rentals',
    label: 'Availability'
  },
  'rental-prices': {
    parent: 'rentals',
    label: 'Price Compare'
  },
  'rental-insurance': {
    parent: 'rentals',
    label: 'Insurance'
  },
  'news': {
    label: 'News'
  },
  'latest-news': {
    parent: 'news',
    label: 'Latest News'
  },
  'reviews': {
    parent: 'news',
    label: 'Reviews'
  },
  'videos': {
    parent: 'news',
    label: 'Videos'
  },
  'gallery': {
    parent: 'news',
    label: 'Photo Gallery'
  },
  'news-subscribe': {
    parent: 'news',
    label: 'Subscribe'
  }
};

const getBreadcrumbs = (pathname: string) => {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs: Array<{ label: string; url: string }> = [];
  
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const config = routeConfig[path];
    
    if (config) {
      if ('parent' in config && config.parent && !paths.includes(config.parent)) {
        const parentConfig = routeConfig[config.parent];
        if (parentConfig) {
          breadcrumbs.push({
            label: parentConfig.label,
            url: `/${config.parent}`
          });
        }
      }
      
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
