import React from "react";
import "./error.css";

const ErrorBox = ({message}) => {
    return (
        <div className="box">
            <p>{ message }</p>
        </div>
    );
}

export default ErrorBox;