
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  console.log("Breadcrumbs rendering with path:", location.pathname);

  // Special case for route-planning to show under destinations
  const isRoutePlanning = 
    pathnames.length === 1 && pathnames[0] === "route-planning";
  
  const breadcrumbItems = isRoutePlanning 
    ? ["destinations", "route-planning"] 
    : pathnames;

  return (
    <nav className="bg-gray-100 py-2" aria-label="Breadcrumb">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-2 text-sm">
          <Link to="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>

          {breadcrumbItems.map((name, index) => {
            // For route-planning, ensure we use the correct paths
            const routeTo = isRoutePlanning && index === 0 
              ? "/destinations"
              : isRoutePlanning && index === 1 
                ? "/destinations/route-planning" 
                : `/${breadcrumbItems.slice(0, index + 1).join("/")}`;
                
            const isLast = index === breadcrumbItems.length - 1;
            const formattedName = name.split("-")
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");

            return (
              <React.Fragment key={routeTo}>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                {isLast ? (
                  <span className="text-gray-900 font-medium">
                    {formattedName}
                  </span>
                ) : (
                  <Link
                    to={routeTo}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {formattedName}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
