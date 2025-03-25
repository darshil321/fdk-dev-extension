import { Input } from "paul-fds-ui";
import React from "react";
import "./Input.css";

const InputField = (props) => {
  return (
    <div className="input-container">
      <Input {...props} className="input" />
    </div>
  );
};

export default InputField;
