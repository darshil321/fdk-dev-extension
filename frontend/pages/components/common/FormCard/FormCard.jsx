import React from "react";
import "./FormCard.css";

const FormCard = ({ children, variant = "default", style = {} }) => {
  return (
    <div
      className={
        variant === "default"
          ? "card-container"
          : variant === "secondary"
          ? "card-container-secondary"
          : "card-container"
      }
      style={style}
    >
      {children}
    </div>
  );
};

export default FormCard;
