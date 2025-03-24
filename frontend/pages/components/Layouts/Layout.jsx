import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Groups from "../Groups/Groups";
import "./Layout.css";

import DynamicBundle from "../DynamicBundle/DynamicBundle";

const Layout = ({ companyId }) => {
  const [activeTab, setActiveTab] = useState("bundles"); // 'groups' or 'bundles'

  return (
    <div className="layout">
      <div>
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      <main className="main-content">
        {activeTab === "groups" ? (
          <Groups companyId={companyId} />
        ) : (
          <DynamicBundle />
        )}
      </main>
    </div>
  );
};

export default Layout;
