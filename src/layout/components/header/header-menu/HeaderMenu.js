/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router-dom";

export function HeaderMenu({ layoutProps }) {
  const location = useLocation();
  let route = "";

  switch (
    location.pathname
      .split("/")
      .slice(0, 2)
      .join("/")
  ) {
    case "/letestNews":
      route = "Letest News";
      break;
    case "/branches":
      route = "Branches";
      break;
    case "/product":
      route = "Product List";
      break;
    default:
      route = "";
      break;
  }

  return (
    <div
      id="kt_header_menu"
      className={`header-menu header-menu-mobile ${layoutProps.ktMenuClasses}`}
      {...layoutProps.headerMenuAttributes}
    >
      {route}
    </div>
  );
}
