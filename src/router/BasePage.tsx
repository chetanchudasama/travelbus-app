import React, { Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { LayoutSplashScreen } from "../layout";
import Admin from "../view/dashboard/admin";
import AddAdmin from "../view/dashboard/admin/addAdmin";
import Car from "../view/dashboard/car";
import AddCar from "../view/dashboard/car/addCar";
import LateReport from "../view/dashboard/lateReport";
import EditReport from "../view/dashboard/lateReport/editLateReport";
import Location from "../view/dashboard/location";
import AddLocation from "../view/dashboard/location/addlocation";
import News from "../view/dashboard/news";
import AddNews from "../view/dashboard/news/addnews";
import AddNotification from "../view/dashboard/notification";
import ReachedValue from "../view/dashboard/reachedValue";
import Path from "../view/dashboard/path";
import AddPath from "../view/dashboard/path/addPath";
import PathGroup from "../view/dashboard/pathGroup";
import AddPathGroup from "../view/dashboard/pathGroup/addPathGroup";
import privacyPolicy from "../view/dashboard/privacyPolicy";
import SiteDB from "../view/dashboard/siteDB";
import AddSite from "../view/dashboard/siteDB/addsite";
import Template from "../view/dashboard/template";
import AddTemplate from "../view/dashboard/template/addTemlate";
import SetSchedule from "../view/dashboard/template/setSchedule";
import TermsandCondition from "../view/dashboard/termsCondition";
import UserManual from "../view/dashboard/userManual";
import User from "../view/dashboard/user";
import AddUser from "../view/dashboard/user/adduser";
import ScheduleDaily from "../view/dashboard/scheduleDaily";
import ScheduleDailyTemplate from "../view/dashboard/scheduleDaily/ScheduleDailyTemplate";
import LogoImage from "../view/dashboard/logoImage";

export default function BasePage() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact from="/" to="/site" />}
        {/* // {
        //   <Redirect exact from="/dashboard" to="/article" />
        // }  */}

        {/* <Route exact path="/auth/login" component={Login} /> */}
        <Route exact path="/site" component={SiteDB} />
        <Route exact path="/site/update/:id" component={AddSite} />
        <Route exact path="/site/add" component={AddSite} />
        <Route exact path="/car" component={Car} />
        <Route exact path="/car/add" component={AddCar} />
        <Route exact path="/car/update/:id" component={AddCar} />
        <Route exact path="/location" component={Location} />
        <Route exact path="/location/update/:id" component={AddLocation} />
        <Route exact path="/location/add" component={AddLocation} />
        <Route exact path="/path" component={Path} />
        <Route exact path="/path/update/:id" component={AddPath} />
        <Route exact path="/path/add" component={AddPath} />
        <Route exact path="/PathGroup" component={PathGroup} />
        <Route exact path="/PathGroup/update/:id" component={AddPathGroup} />
        <Route exact path="/PathGroup/add" component={AddPathGroup} />
        <Route exact path="/template" component={Template} />
        <Route exact path="/template/update/:id" component={AddTemplate} />
        <Route
          exact
          path="/template/update/:id/set/schedule"
          component={SetSchedule}
        />
        <Route exact path="/template/add" component={AddTemplate} />
        <Route
          exact
          path="/template/add/:id/set/schedule"
          component={SetSchedule}
        />
        <Route exact path="/schedule/daily" component={ScheduleDaily} />
        <Route
          exact
          path="/schedule/daily/:siteId/template"
          component={ScheduleDailyTemplate}
        />
        <Route exact path="/user" component={User} />
        <Route exact path="/user/update/:id" component={AddUser} />
        <Route exact path="/user/add" component={AddUser} />
        <Route exact path="/admin" component={Admin} />
        <Route exact path="/admin/update/:id" component={AddAdmin} />
        <Route exact path="/admin/add" component={AddAdmin} />
        <Route exact path="/notification" component={AddNotification} />
        <Route exact path="/reachedValue" component={ReachedValue} />
        <Route exact path="/news" component={News} />
        <Route exact path="/news/update/:id" component={AddNews} />
        <Route exact path="/news/add" component={AddNews} />
        <Route exact path="/lateReport" component={LateReport} />
        <Route exact path="/lateReport/edit/:id" component={EditReport} />
        <Route exact path="/privacyPolicy" component={privacyPolicy} />
        <Route exact path="/termsCondition" component={TermsandCondition} />
        <Route exact path="/logoImage" component={LogoImage} />
        <Route exact path="/userManual" component={UserManual} />
      </Switch>
    </Suspense>
  );
}
