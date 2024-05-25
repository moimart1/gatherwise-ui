import AppFrame from './AppFrame'

/**
 * @param {{sitePreferences: import('./AppFrame').SitePreferences, menuMap: import('./NavBar').MenuItemMap[]}}
 * @returns {function(BaseComponent:JSX.Element)}
 */
export const withAppLayout =
  ({ sitePreferences, menuMap }) =>
  (BaseComponent) =>
  (props) => {
    return (
      <AppFrame sitePreferences={sitePreferences} menuMap={menuMap}>
        <BaseComponent {...props} />
      </AppFrame>
    )
  }
