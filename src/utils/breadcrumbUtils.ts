
import { routeConfig } from "@/config/routeConfig";

export interface Breadcrumb {
  label: string;
  url: string;
}

// The breadcrumb utility needs to be updated to work with the route config
// Since the route config doesn't have labels, we'll derive them from the path
export const getBreadcrumbs = (pathname: string): Breadcrumb[] => {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs: Breadcrumb[] = [];
  
  // Handle home page
  if (paths.length === 0 && pathname === '/') {
    return [{ label: 'Home', url: '/' }];
  }
  
  let currentPath = '';
  
  for (let i = 0; i < paths.length; i++) {
    const pathSegment = paths[i];
    currentPath += `/${pathSegment}`;
    
    // Find matching route
    const matchingRoute = routeConfig.find(route => {
      // Handle exact matches
      if (route.path === currentPath) return true;
      
      // Handle parameter routes like /motorcycle/:id
      const routeParts = route.path.split('/').filter(Boolean);
      const currentParts = currentPath.split('/').filter(Boolean);
      
      if (routeParts.length !== currentParts.length) return false;
      
      return routeParts.every((part, index) => {
        if (part.startsWith(':')) return true;
        return part === currentParts[index];
      });
    });
    
    if (matchingRoute) {
      const label = pathSegment
        .replace(/-/g, ' ')
        .replace(/^\w/, c => c.toUpperCase());
        
      breadcrumbs.push({
        label,
        url: currentPath
      });
    }
  }
  
  return breadcrumbs;
};
