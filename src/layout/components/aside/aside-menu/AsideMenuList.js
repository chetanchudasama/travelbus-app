/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../helpers";
import { Logout } from "../../../../common/api/logout";

export function AsideMenuList({ layoutProps }) {
  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu &&
          "menu-item-active"} menu-item-open menu-item-not-hightlighted`
      : "";
  };

  return (
    <>
      {/* begin::Menu Nav */}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {/*begin::1 Level*/}

        <li
          className={`menu-item ${getMenuItemActive("/site", true)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/site">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Shopping/Box2.svg")} />
            </span>
            <span className="menu-text">Site</span>
          </NavLink>
        </li>

        <li
          className={`menu-item ${getMenuItemActive("/car", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/car">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Shopping/Box2.svg")} />
            </span>
            <span className="menu-text">Car</span>
          </NavLink>
        </li>

        <li
          className={`menu-item ${getMenuItemActive("/location", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/location">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Shopping/Box2.svg")} />
            </span>
            <span className="menu-text">Location</span>
          </NavLink>
        </li>

        {/* <li
          className={`menu-item ${getMenuItemActive("/path", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/path">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Shopping/Box2.svg")} />
            </span>
            <span className="menu-text">Path</span>
          </NavLink>
        </li> */}

        {/* <li
          className={`menu-item ${getMenuItemActive("/PathGroup", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/PathGroup">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Shopping/Box2.svg")} />
            </span>
            <span className="menu-text">Path Group</span>
          </NavLink>
        </li> */}

        <li
          className={`menu-item ${getMenuItemActive("/template", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/template">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Shopping/Box2.svg")} />
            </span>
            <span className="menu-text">Template</span>
          </NavLink>
        </li>

        {/* user */}
        <li
          className={`menu-item ${getMenuItemActive("/schedule/daily", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/schedule/daily">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Shopping/Box2.svg")} />
            </span>
            <span className="menu-text">Schedule</span>
          </NavLink>
        </li>
        <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/user",
            false
          )}`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
          <NavLink className="menu-link menu-toggle" to="#">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Shopping/Box2.svg")} />
            </span>
            <span className="menu-text">User</span>
            <i className="menu-arrow" />
          </NavLink>
          <div className="menu-submenu ">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li
                className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/user",
                  true
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink className="menu-link menu-toggle" to="/user">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Driver</span>
                </NavLink>
              </li>
              <li
                className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/admin",
                  true
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink className="menu-link menu-toggle" to="/admin">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Admin</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </li>

        {/* notification */}
        <li
          className={`menu-item ${getMenuItemActive("/notification", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/notification">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Shopping/Box2.svg")} />
            </span>
            <span className="menu-text">Notification</span>
          </NavLink>
        </li>

        {/* news */}
        <li
          className={`menu-item ${getMenuItemActive("/news", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/news">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Shopping/Box2.svg")} />
            </span>
            <span className="menu-text">News</span>
          </NavLink>
        </li>

        {/* lateReport */}
        <li
          className={`menu-item ${getMenuItemActive("/lateReport", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/lateReport">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Shopping/Box2.svg")} />
            </span>
            <span className="menu-text">Late Report</span>
          </NavLink>
        </li>

        {/* settings */}
        <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/settings",
            false
          )}`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
          <NavLink className="menu-link menu-toggle" to="#">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Shopping/Box2.svg")} />
            </span>
            <span className="menu-text">Setting</span>
            <i className="menu-arrow" />
          </NavLink>
          <div className="menu-submenu ">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li
                className={`menu-item ${getMenuItemActive(
                  "/privacyPolicy",
                  false
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/privacyPolicy">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Privacy Policy</span>
                </NavLink>
              </li>
              <li
                className={`menu-item ${getMenuItemActive(
                  "/termsCondition",
                  false
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/termsCondition">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Terms & Conditions</span>
                </NavLink>
              </li>
              <li
                className={`menu-item ${getMenuItemActive(
                  "/userManual",
                  false
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/userManual">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">User Manual</span>
                </NavLink>
              </li>
              <li
                className={`menu-item ${getMenuItemActive(
                  "/reachedValue",
                  false
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/reachedValue">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Arrived Line</span>
                </NavLink>
              </li>
              <li
                className={`menu-item ${getMenuItemActive(
                  "/logoImage",
                  false
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/logoImage">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Logo Image</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </li>

        {/* logout */}
        {/*begin::1 Level*/}
        <li
          className={`menu-item ${getMenuItemActive("#", false)}`}
          aria-haspopup="true"
          onClick={Logout}
        >
          <NavLink className="menu-link" to="/auth/login">
            {/* <span className="svg-icon menu-icon"> */}
            <span className="menu-icon">
              {/* <SVG src={toAbsoluteUrl("/media/svg/icons/Shopping/Box2.svg")} /> */}
              <i className="fa fa-power-off" aria-hidden="true"></i>
            </span>
            <span className="menu-text">LOG OUT</span>
          </NavLink>
        </li>

        {/*end::1 Level*/}
      </ul>
      {/* end::Menu Nav */}
    </>
  );
}
