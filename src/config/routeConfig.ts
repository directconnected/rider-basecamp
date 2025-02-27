
import Index from "@/pages/Index";
import MotorcycleDetails from "@/pages/MotorcycleDetails";
import CampingHub from "@/pages/CampingHub";
import CampingGear from "@/pages/CampingGear";
import Data from "@/pages/Data";
import Auth from "@/pages/Auth";
import Service from "@/pages/Service";
import Destinations from "@/pages/Destinations";
import PrintableService from "@/pages/PrintableService";
import TopRoads from "@/pages/TopRoads";
import ScenicByways from "@/pages/ScenicByways";
import FeaturedDestinations from "@/pages/FeaturedDestinations";
import Tents from "@/pages/Tents";
import RoutePlanning from "@/pages/RoutePlanning";
import GroupRides from "@/pages/GroupRides";
import GpxDownloads from "@/pages/GpxDownloads";

export const routeConfig = [
  {
    path: "/",
    element: Index,
  },
  {
    path: "/motorcycle/:id",
    element: MotorcycleDetails,
  },
  {
    path: "/camping-hub",
    element: CampingHub,
  },
  {
    path: "/camping",
    element: CampingHub,
  },
  {
    path: "/camping-gear",
    element: CampingGear,
  },
  {
    path: "/data",
    element: Data,
  },
  {
    path: "/auth",
    element: Auth,
  },
  {
    path: "/service-records",
    element: Service,
  },
  {
    path: "/destinations",
    element: Destinations,
  },
  {
    path: "/destinations/top-roads",
    element: TopRoads,
  },
  {
    path: "/destinations/scenic-byways",
    element: ScenicByways,
  },
  {
    path: "/destinations/featured-destinations",
    element: FeaturedDestinations,
  },
  {
    path: "/destinations/route-planning",
    element: RoutePlanning,
  },
  {
    path: "/camping-hub/tents",
    element: Tents,
  },
  {
    path: "/tents",
    element: Tents,
  },
  {
    path: "/route-planning",
    element: RoutePlanning,
  },
  {
    path: "/group-rides",
    element: GroupRides,
  },
  {
    path: "/gpx-downloads",
    element: GpxDownloads,
  },
  {
    path: "/printable-service",
    element: PrintableService,
  }
];
