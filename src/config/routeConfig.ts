
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

export const routeConfig: Record<string, RouteConfig> = {
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

export type { RouteConfig, BaseRouteConfig, ChildRouteConfig, ParentRouteConfig };
