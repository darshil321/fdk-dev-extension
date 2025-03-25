import React from "react";
import "./FormCard.css";

const FormCard = ({ children, variant = "default" }) => {
  return (
    <div
      className={
        variant === "default"
          ? "card-container"
          : variant === "secondary"
          ? "card-container-secondary"
          : "card-container"
      }
    >
      {children}
    </div>
  );
};

export default FormCard;
