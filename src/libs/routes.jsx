import React from 'react'
import { generatePath, matchPath } from 'react-router-dom'
import AppBody from '../components/AppBody'
import AppFrame from '../components/AppFrame'

/**
 * Compile path with parameters like /:param to a real path
 * @param {string} path Path to compile
 * @returns Compiled path with current pathname
 */
export function compiledPath(path) {
  const match = matchPath(`${path}/*`, window.location.pathname)
  return path && match ? generatePath(path, match.params) : path
}

/**
 * Compile React router routes to app routes with frames and protected components
 * @param {array} routes Array of React router routes
 * @param {object} frameProps Additional properties for AppFrame
 * @returns
 */
export function compileRoutes(routes, frameProps) {
  const menuMap = [] // Global menu

  // Recurrence function to parse all children routes
  function recurrence(
    routesMap,
    parentContext = {
      title: '',
      subMenuMap: [],
      basename: '',
    }
  ) {
    for (const routeMap of routesMap) {
      routeMap.path = routeMap.path ? routeMap.path : ''
      if (routeMap?.menu?.title) {
        // If menu title is set
        menuMap.push({
          // Add menu object
          title: routeMap.menu.title,
          logo: routeMap.menu?.logo,
          path: routeMap.path,
          basename: compiledPath(parentContext.basename ? parentContext.basename : ''),
        })
      }

      if (routeMap?.submenu?.title) {
        // If sub-menu title is set
        parentContext.subMenuMap.push({
          // Add sub-menu object
          title: routeMap.submenu.title,
          logo: routeMap.submenu?.logo,
          path: routeMap.path,
          basename: compiledPath(parentContext.basename ? parentContext.basename : ''),
        })
      }

      const context = {
        // Create context shared with children routes
        title: routeMap?.title ?? routeMap?.menu?.title ?? parentContext.title,
        subMenuMap: [],
        basename: (parentContext.basename ? parentContext.basename + '/' : '') + routeMap.path,
      }

      if (Array.isArray(routeMap?.children)) {
        // Parse children routes
        recurrence(routeMap.children, context)
      }

      if (routeMap?.element) {
        if (routeMap?.wrapFrame === undefined || routeMap?.wrapFrame) {
          // Add frame is not defined or enabled
          const showMenu = routeMap?.showMenu === undefined || routeMap?.showMenu

          routeMap.element = (
            <AppFrame menuMap={showMenu ? menuMap : []} {...frameProps}>
              <AppBody title={context.title} subMenuMap={parentContext.subMenuMap}>
                {routeMap.element}
              </AppBody>
            </AppFrame>
          )
        }

        if (routeMap?.isProtected === undefined || routeMap?.isProtected) {
          // Add protected is not defined or enabled
          routeMap.element = <>{routeMap.element}</>
        }
      }
    }
  }

  // Route parsing
  recurrence(routes, {})
  return routes
}
