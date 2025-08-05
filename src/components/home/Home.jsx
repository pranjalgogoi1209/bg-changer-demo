import React from "react";
import "./home.scss";
import bgArr from "../../utils/bg";

export default function Home({ onComponentChange }) {
  return (
    <div
      className="Home d-flex flex-column justify-content-start align-items-center gap-5 min-vh-100 vw-100 text-center pt-5"
      style={{ overflow: "hidden" }}
    >
      <h1 className="mb-4 fw-bold text-light text-shadow mt-3">
        BACKGROUND CHANGER
      </h1>
      <div className="bgContainer d-flex flex-column flex-wrap justify-content-center align-items-center gap-3 mb-4">
        {bgArr?.map((bg) => (
          <img
            key={bg.id}
            src={bg.background_b64}
            alt={bg.title}
            className={`singleBg img-thumbnail bg-dark border border-2 border-light  ${
              bg.id === 3 ? "extra" : ""
            }`}
          />
        ))}
      </div>
      <button
        className="btn btn-primary btn-lg shadow"
        style={{ fontWeight: 700 }}
        onClick={() => onComponentChange("Camera")}
      >
        START
      </button>
    </div>
  );
}
