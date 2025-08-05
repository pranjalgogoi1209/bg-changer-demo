import React, { useState } from "react";
import "./bg.scss";
import bgArr from "../../utils/bg";

export default function Bg({ onComponentChange, onSelectBg }) {
  const [selectedBgId, setSelectedBgId] = useState(null);

  const handleSelectBg = (id) => {
    setSelectedBgId(id);
  };

  const handleGenerate = () => {
    if (selectedBgId !== null) {
      const selectedBg = bgArr.find((bg) => bg.id === selectedBgId);
      onSelectBg(selectedBg);
      onComponentChange("Output");
    } else {
      alert("Please select a background first");
    }
  };

  return (
    <div className="Bg d-flex flex-column justify-content-start align-items-center gap-5 min-vh-100 vw-100 text-center pt-5">
      <h1 className="mb-4 fw-bold text-light text-shadow mt-3">
        SELECT A BACKGROUND
      </h1>
      <div className="bgContainer d-flex flex-column flex-wrap justify-content-center align-items-center gap-3 mb-4">
        {bgArr?.map((bg) => (
          <div
            key={bg.id}
            className={`singleBg img-thumbnail bg-dark border border-2 shadow position-relative ${
              bg.id === 3 ? "extra" : ""
            } ${selectedBgId === bg.id ? "border-primary" : "border-light"}`}
            onClick={() => handleSelectBg(bg.id)}
          >
            <img
              src={bg.background_b64}
              alt={bg.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            {selectedBgId === bg.id && (
              <span
                className="position-absolute top-0 end-0 m-1 text-white rounded-circle d-flex justify-content-center align-items-center"
                style={{
                  width: 34,
                  height: 34,
                  fontWeight: "bold",
                  fontSize: 18,
                  zIndex: 10,
                }}
                aria-label="Selected"
              >
                ✓
              </span>
            )}
          </div>
        ))}
      </div>
      <button
        className="btn btn-primary btn-lg shadow"
        style={{ fontWeight: 700 }}
        onClick={() => {
          handleGenerate();
        }}
      >
        GENERATE
      </button>
    </div>
  );
}
