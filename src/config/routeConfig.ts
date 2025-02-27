
import Index from "@/pages/Index";
import MotorcycleDetails from "@/pages/MotorcycleDetails";
import CampingHub from "@/pages/CampingHub";
import CampingGear from "@/pages/CampingGear";
import Data from "@/pages/Data";
import Auth from "@/pages/Auth";
import Service from "@/pages/Service";
import Destinations from "@/pages/Destinations";
import PrintableService from "@/pages/PrintableService";

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
    path: "/printable-service",
    element: PrintableService,
  }
];
