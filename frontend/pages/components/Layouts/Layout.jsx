import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Groups from "../Groups/Groups";
import "./Layout.css";

import DynamicBundle from "../DynamicBundle/DynamicBundle";

const Layout = ({ companyId, applicationId }) => {
  const [activeTab, setActiveTab] = useState("bundles");

  return (
    <div className="layout">
      <div>
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      <main className="main-content">
        {activeTab === "groups" ? (
          <Groups companyId={companyId} />
        ) : (
          <DynamicBundle companyId={companyId} applicationId={applicationId} />
        )}
      </main>
    </div>
  );
};

export default Layout;
