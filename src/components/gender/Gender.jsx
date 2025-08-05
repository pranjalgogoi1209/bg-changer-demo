import React, { useState } from "react";
import { FaMale, FaFemale } from "react-icons/fa";
import "./gender.scss";

export default function Gender({ onComponentChange, onSelectGender }) {
  const [selectedGender, setSelectedGender] = useState(null);

  const handleSelect = (gender) => {
    setSelectedGender(gender);
    onSelectGender(gender);
  };

  const genders = [
    { label: "Male", icon: <FaMale size={48} /> },
    { label: "Female", icon: <FaFemale size={48} /> },
  ];

  return (
    <div
      className="Home d-flex flex-column justify-content-start align-items-center gap-5 min-vh-100 vw-100 text-center pt-5"
      style={{ overflow: "hidden" }}
    >
      <h1 className="mb-4 fw-bold text-light text-shadow mt-3">
        SELECT YOUR GENDER
      </h1>
      <div className="gender-options d-flex gap-4 mb-4 mt-4">
        {genders.map(({ label, icon }) => (
          <div
            key={label}
            role="button"
            tabIndex={0}
            onClick={() => handleSelect(label)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleSelect(label);
              }
            }}
            className={`gender-box d-flex flex-column justify-content-center align-items-center p-4 rounded border border-3 shadow-sm cursor-pointer text-light ${
              selectedGender === label
                ? "border-primary bg-primary bg-opacity-25"
                : "border-secondary"
            }`}
            style={{ width: 150, height: 150 }}
          >
            {icon}
            <span className="mt-2 fs-5 fw-semibold">{label}</span>
          </div>
        ))}
      </div>

      <button
        className="btn btn-primary btn-lg shadow mb-4 mt-4"
        style={{ fontWeight: 700 }}
        onClick={() => onComponentChange("Camera")}
        disabled={!selectedGender}
      >
        CONTINUE
      </button>
    </div>
  );
}
