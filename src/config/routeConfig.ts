
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
    path: "/printable-service",
    element: PrintableService,
  }
];
