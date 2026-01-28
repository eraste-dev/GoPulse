import { MenuConfig, MenuItem } from './types';
import { MENU_SIDEBAR, MENU_SIDEBAR_CUSTOM } from './menu.config';

/**
 * Find a menu item by its title
 */
export function findMenuByTitle(
  title: string,
  menu: MenuConfig = MENU_SIDEBAR
): MenuItem | undefined {
  return menu.find((item) => item.title === title);
}

/**
 * Find a menu item by path prefix
 */
export function findMenuByPathPrefix(
  pathPrefix: string,
  menu: MenuConfig = MENU_SIDEBAR
): MenuItem | undefined {
  return menu.find((item) => {
    if (item.path?.startsWith(pathPrefix)) return true;
    if (item.children) {
      return item.children.some(
        (child) =>
          child.path?.startsWith(pathPrefix) ||
          child.children?.some((c) => c.path?.startsWith(pathPrefix))
      );
    }
    return false;
  });
}

/**
 * Route to menu mapping configuration
 * Maps URL path prefixes to menu section titles
 */
export const ROUTE_TO_MENU_MAP: Record<
  string,
  { menu: MenuConfig; title: string }
> = {
  '/public-profile/': { menu: MENU_SIDEBAR, title: 'Public Profile' },
  '/account/': { menu: MENU_SIDEBAR, title: 'My Account' },
  '/network/': { menu: MENU_SIDEBAR, title: 'Network' },
  '/authentication/': { menu: MENU_SIDEBAR, title: 'Authentication' },
  '/user-management/': { menu: MENU_SIDEBAR, title: 'User Management' },
  '/store-client/': { menu: MENU_SIDEBAR_CUSTOM, title: 'Store - Client' },
  '/monitors': { menu: MENU_SIDEBAR, title: 'Monitors' },
};

/**
 * Get the appropriate menu item based on the current pathname
 */
export function getMenuForPath(pathname: string): MenuItem | undefined {
  // Find matching route
  for (const [routePrefix, config] of Object.entries(ROUTE_TO_MENU_MAP)) {
    if (pathname.includes(routePrefix) || pathname.startsWith(routePrefix)) {
      return findMenuByTitle(config.title, config.menu);
    }
  }

  // Default: return "My Account" menu
  return findMenuByTitle('My Account', MENU_SIDEBAR);
}

/**
 * Get menu children for a given pathname (for navbar menus)
 */
export function getMenuChildrenForPath(pathname: string): MenuConfig {
  const menuItem = getMenuForPath(pathname);
  return menuItem?.children || [];
}
