import React, { useLayoutEffect } from "react";
import { KTUtil } from "../../assets/js/components/util";
import KTLayoutHeader from "../../assets/js/layout/base/header";
import KTLayoutHeaderMenu from "../../assets/js/layout/base/header-menu";
import KTLayoutHeaderTopbar from "../../assets/js/layout/base/header-topbar";
import KTLayoutBrand from "../../assets/js/layout/base/brand";
import KTLayoutAside from "../../assets/js/layout/base/aside";
import KTLayoutAsideToggle from "../../assets/js/layout/base/aside-toggle";
import KTLayoutAsideMenu from "../../assets/js/layout/base/aside-menu";
import KTLayoutContent from "../../assets/js/layout/base/content";
import KTLayoutFooter from "../../assets/js/layout/base/footer";
import KTLayoutScrolltop from "../../assets/js/layout/extended/scrolltop";

export function LayoutInit() {
  useLayoutEffect(() => {
    // Initialization
    KTUtil.ready(function() {
      ////////////////////////////////////////////////////
      // Layout Base Partials(mandatory for core layout)//
      ////////////////////////////////////////////////////
      // Init Desktop & Mobile Headers
      KTLayoutHeader.init("kt_header", "kt_header_mobile");

      // Init Header Menu
      KTLayoutHeaderMenu.init("kt_header_menu", "kt_header_menu_wrapper");
      // Init Header Topbar For Mobile Mode
      KTLayoutHeaderTopbar.init("kt_header_mobile_topbar_toggle");
      // Init Brand Panel For Logo
      KTLayoutBrand.init("kt_brand");
      // Init Aside
      KTLayoutAside.init("kt_aside");

      // Init Aside Menu Toggle
      KTLayoutAsideToggle.init("kt_aside_toggle");
      //
      // Init Aside Menu
      KTLayoutAsideMenu.init("kt_aside_menu");

      // Init Content
      KTLayoutContent.init("kt_content");

      // Init Footer
      KTLayoutFooter.init("kt_footer");

      //////////////////////////////////////////////
      // Layout Extended Partials(optional to use)//
      //////////////////////////////////////////////

      // Init Scrolltop
      KTLayoutScrolltop.init("kt_scrolltop");
    });
  }, []);
  return <></>;
}
