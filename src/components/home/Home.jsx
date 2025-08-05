import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./home.scss";

export default function Home() {
  return (
    <div className="Home container p-5 text-center">
      <h1 className="mb-4">Background Changer</h1>
      <div className="d-flex justify-content-center gap-3 mb-4">
        <img
          src="image1.jpg"
          alt="Image 1"
          className="img-thumbnail"
          width={100}
        />
        <img
          src="image2.jpg"
          alt="Image 2"
          className="img-thumbnail"
          width={100}
        />
        <img
          src="image3.jpg"
          alt="Image 3"
          className="img-thumbnail"
          width={100}
        />
        <img
          src="image4.jpg"
          alt="Image 4"
          className="img-thumbnail"
          width={100}
        />
      </div>
      <button className="btn btn-primary btn-lg">START</button>
    </div>
  );
}
