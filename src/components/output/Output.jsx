import React, { useEffect, useState } from "react";
import "./output.scss";

export default function Output({ onComponentChange, onApiCall, isLoading }) {
  const [output, setOutput] = useState(null);

  useEffect(() => {
    const handleCallApi = async () => {
      const result = await onApiCall();
      if (result) {
        setOutput(`data:image/png;base64,${result}`);
      }
    };

    handleCallApi();
  }, []);

  return (
    <>
      {isLoading && !output ? (
        <div className="Output d-flex flex-column justify-content-center align-items-center gap-5 min-vh-100 vw-100 text-center pt-5">
          <div
            className="spinner-border bg-white"
            role="status"
            style={{
              borderColor: "white",
              borderRightColor: "transparent",
            }}
          >
            <span className="visually-hidden"></span>
          </div>
          <h3 className="mb-4 fw-semi-bold text-light text-shadow mt-3">
            Please Wait We are Generating Your Image...
          </h3>
        </div>
      ) : (
        <div className="Output d-flex flex-column justify-content-start align-items-center gap-5 min-vh-100 vw-100 text-center pt-5">
          <h1 className="mb-4 fw-bold text-light text-shadow mt-3">
            HAPPY DURGA PUJA
          </h1>

          <img
            src={output}
            alt={`output`}
            className={`singleBg img-thumbnail bg-dark border border-2 border-light shadow `}
          />

          <button
            className="btn btn-primary btn-lg shadow"
            style={{ fontWeight: 700 }}
            onClick={() => onComponentChange("Home")}
          >
            RETRY
          </button>
        </div>
      )}
    </>
  );
}
