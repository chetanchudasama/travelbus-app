import React, { useMemo } from "react";
import objectPath from "object-path";
import { useHtmlClassService } from "../../core/MetronicLayout";
import { HeaderMenu } from "./header-menu/HeaderMenu";

export function Topbar() {
  const uiService = useHtmlClassService();
  const layoutProps = useMemo(() => {
    return {
      viewSearchDisplay: objectPath.get(
        uiService.config,
        "extras.search.display"
      ),
      viewNotificationsDisplay: objectPath.get(
        uiService.config,
        "extras.notifications.display"
      ),
      viewQuickActionsDisplay: objectPath.get(
        uiService.config,
        "extras.quick-actions.display"
      ),
      viewCartDisplay: objectPath.get(uiService.config, "extras.cart.display"),
      viewQuickPanelDisplay: objectPath.get(
        uiService.config,
        "extras.quick-panel.display"
      ),
      viewLanguagesDisplay: objectPath.get(
        uiService.config,
        "extras.languages.display"
      ),
      viewUserDisplay: objectPath.get(uiService.config, "extras.user.display"),
    };
  }, [uiService]);

  return (
    <div className="topbar w-100">
      <div className="d-flex align-items-center justify-content-between w-100">
        <div>
          <HeaderMenu layoutProps={layoutProps} />
        </div>
        <div>Hi, Admin</div>
      </div>
    </div>
  );
}
