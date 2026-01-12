/**
 * Converts router routes to menu structure
 * @param {Array} routes - Array of router route objects
 * @returns {Array} - Menu structure with keys generated
 */
export function convertRoutesToMenu(routes) {
  // Filter routes that have showInMenu property set to true
  const menuRoutes = routes.filter(
    route => route.meta && route.meta.showInMenu === true,
  )

  // Process each route to create menu structure
  return menuRoutes.map((route, index) => {
    const menuKey = `${index + 1}`

    // Create basic menu item structure
    const menuItem = {
      key: menuKey,
      title: route.meta?.title || route.name,
      path: route.path,
      role: route.meta?.roles || [],
      icon: route.meta?.icon || null,
    }

    // Process children if they exist
    if (route.children && route.children.length > 0) {
      // Recursively process children that should show in menu
      const childRoutes = route.children.filter(
        child => child.meta && child.meta.showInMenu !== false,
      )
      if (childRoutes.length > 0) {
        menuItem.children = childRoutes.map((child, childIndex) => ({
          key: `${menuKey}-${childIndex + 1}`,
          title: child.meta?.title || child.name,
          path: child.path,
          role: child.meta?.roles || [],
        }))
      } else {
        // If no children should be shown, remove the children property
        delete menuItem.children
      }
    }

    return menuItem
  })
}

/**
 * Generates menu keys recursively (preserving the existing function from sider.js)
 * @param {Array} menus - Menu array
 * @param {string} parentKey - Parent key for nested items
 * @returns {Array} - Menu array with generated keys
 */
export function generateMenuKeys(menus, parentKey = '') {
  return menus.map((menu, index) => {
    const newKey = parentKey ? `${parentKey}-${index + 1}` : `${index + 1}`

    return {
      ...menu,
      key: newKey,
      children: menu.children
        ? generateMenuKeys(menu.children, newKey)
        : undefined,
    }
  })
}
