import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { generateMenuKeys } from '@/utils/routeToMenu'

/**
 * Composable to generate dynamic menu from router routes
 */
export function useDynamicMenu() {
  const router = useRouter()

  // Function to extract routes that should appear in the menu
  const getMenuFromRoutes = () => {
    const menuRoutes = []

    // Iterate through router routes to find those that should be in the menu
    router.options.routes.forEach(route => {
      if (route.children) {
        // Look for routes that have showInMenu = true among the children
        route.children.forEach(child => {
          if (child.meta && child.meta.showInMenu === true) {
            // If the child route has children that should be in menu, we'll process them
            const processedRoute = { ...child }

            // Process nested children if they exist and should be shown in menu
            if (child.children && child.children.length > 0) {
              const menuChildren = child.children
                .filter(
                  nestedChild =>
                    nestedChild.meta && nestedChild.meta.showInMenu !== false,
                )
                .map(nestedChild => ({
                  title: nestedChild.meta?.title || nestedChild.name,
                  path: nestedChild.path,
                  role: nestedChild.meta?.roles || [],
                }))

              if (menuChildren.length > 0) {
                processedRoute.children = menuChildren
              }
            }

            menuRoutes.push(processedRoute)
          }
        })
      } else if (route.meta && route.meta.showInMenu === true) {
        // Handle top-level routes that should be in the menu
        menuRoutes.push(route)
      }
    })

    return menuRoutes
  }

  // Generate the menu structure from routes
  const rawMenu = computed(() => {
    return getMenuFromRoutes().map(route => ({
      icon: route.meta?.icon || null,
      title: route.meta?.title || route.name,
      path: route.path,
      role: route.meta?.roles || [],
      children: route.children
        ? route.children.map(child => ({
            title: child.title,
            path: child.path,
            role: child.role || [],
          }))
        : undefined,
    }))
  })

  // Generate the final menu with keys
  const menus = computed(() => {
    return generateMenuKeys(rawMenu.value)
  })

  return {
    menus,
  }
}
