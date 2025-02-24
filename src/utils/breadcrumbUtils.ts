
import { routeConfig } from "@/config/routeConfig";

export interface Breadcrumb {
  label: string;
  url: string;
}

export const getBreadcrumbs = (pathname: string): Breadcrumb[] => {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs: Breadcrumb[] = [];
  
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
