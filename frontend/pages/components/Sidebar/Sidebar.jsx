import React from "react";
import "./Sidebar.css";
import SvgIcon from "../Icons/LeftArrow";

const Sidebar = ({ activeTab, onTabChange }) => {
  return (
    <aside className="sidebar">
      <div className="tabs">
        <div
          className={`tab ${activeTab === "bundles" ? "active" : ""}`}
          onClick={() => onTabChange("bundles")}
          style={{
            borderTopLeftRadius: "16px",
          }}
        >
          <div>
            <SvgIcon
              name="bundle"
              color={
                activeTab === "bundles"
                  ? "var(--primary-color)"
                  : "rgba(0, 0, 0, 0.8)"
              }
            />
          </div>
          <div>Bundle Listing</div>
        </div>
        <div
          className={`tab ${activeTab === "groups" ? "active" : ""}`}
          onClick={() => onTabChange("groups")}
          style={{
            borderBottomLeftRadius: "16px",
          }}
        >
          <div>
            <SvgIcon
              name="group"
              color={activeTab === "groups" ? "#3535F3" : "rgba(0, 0, 0, 0.8)"}
            />
          </div>
          <div>Groups</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
