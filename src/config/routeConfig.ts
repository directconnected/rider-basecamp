import { Index } from "@/pages";
import { Auth } from "@/pages/Auth";
import { Data } from "@/pages/Data";
import { Service } from "@/pages/Service";
import { Destinations } from "@/pages/Destinations";
import { CampingHub } from "@/pages/CampingHub";
import { MotorcycleDetails } from "@/pages/MotorcycleDetails";
import { PrintableService } from "@/pages/PrintableService";

interface RouteConfig {
  path: string;
  element: React.ComponentType<any>;
}

export const routeConfig: RouteConfig[] = [
  {
    path: "/",
    element: Index,
  },
  {
    path: "/auth",
    element: Auth,
  },
  {
    path: "/data",
    element: Data,
  },
  {
    path: "/service",
    element: Service,
  },
  {
    path: "/destinations",
    element: Destinations,
  },
  {
    path: "/camping-hub",
    element: CampingHub,
  },
  {
    path: "/motorcycle/:id",
    element: MotorcycleDetails,
  },
  {
    path: "/printable-service",
    element: PrintableService,
  },
];
