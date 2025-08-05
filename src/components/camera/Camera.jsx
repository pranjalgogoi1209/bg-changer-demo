import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { FaceDetection } from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";
import "bootstrap/dist/css/bootstrap.min.css";
import "./camera.scss";

export default function CameraComponent() {
  const webcamRef = useRef(null);
  const [isCentered, setIsCentered] = useState(false);
  const [base64Image, setBase64Image] = useState(null);
  const [hasCaptured, setHasCaptured] = useState(false);

  useEffect(() => {
    const faceDetection = new FaceDetection({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    });

    faceDetection.setOptions({
      model: "short",
      minDetectionConfidence: 0.5,
    });

    faceDetection.onResults((results) => {
      if (results.detections.length > 0) {
        const face = results.detections[0];
        const box = face.boundingBox;
        const faceCenterX = box.xCenter;
        const faceCenterY = box.yCenter;
        const centerTolerance = 0.1;
        const isXCentered = Math.abs(faceCenterX - 0.5) < centerTolerance;
        const isYCentered = Math.abs(faceCenterY - 0.5) < centerTolerance;
        setIsCentered(isXCentered && isYCentered);
      } else {
        setIsCentered(false);
      }
    });

    if (webcamRef.current?.video) {
      const camera = new Camera(webcamRef.current.video, {
        onFrame: async () => {
          await faceDetection.send({ image: webcamRef.current.video });
        },
        width: 300,
        height: 400,
      });
      camera.start();
    }
  }, []);

  const captureImage = () => {
    if (isCentered) {
      const imageSrc = webcamRef.current.getScreenshot();
      setBase64Image(imageSrc);
      setHasCaptured(true);
    }
  };

  const handleRetake = () => {
    setBase64Image(null);
    setHasCaptured(false);
  };

  return (
    <div
      className="Camera d-flex flex-column justify-content-center align-items-center min-vh-100 vw-100 text-center bg-dark text-light p-4"
      style={{ overflow: "hidden" }}
    >
      <h1 className="mb-4 fw-bold text-shadow">CAPTURE YOUR IMAGE</h1>
      <div
        className="cameraContainer position-relative mb-4"
        style={{ width: "320px", height: "420px" }}
      >
        {!hasCaptured ? (
          <>
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/png"
              videoConstraints={{ facingMode: "user", width: 320, height: 420 }}
              className="rounded"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "10px",
                border: `4px solid ${isCentered ? "limegreen" : "red"}`,
                transition: "border-color 0.3s",
              }}
            />
            {/* Overlay */}
            {/*  <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "transparent",
              }}
            >
              <div
                style={{
                  border: `4px solid ${isCentered ? "limegreen" : "red"}`,
                  borderRadius: "50%",
                  width: "60%",
                  height: "60%",
                  transition: "border-color 0.3s",
                }}
              />
            </div> */}
          </>
        ) : (
          <img
            src={base64Image}
            alt="Captured"
            className="rounded img-thumbnail"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
        )}
      </div>
      {hasCaptured ? (
        <button className="btn btn-warning btn-lg" onClick={handleRetake}>
          Retake
        </button>
      ) : (
        <button
          className="btn btn-success btn-lg"
          onClick={captureImage}
          disabled={!isCentered}
        >
          Capture
        </button>
      )}
    </div>
  );
}

{
  /* 🖼 Show captured image */
}
{
  /* {base64Image && (
        <div style={{ marginTop: 10 }}>
          <p>✅ Captured Image:</p>
          <img
            src={base64Image}
            alt="Captured"
            style={{ width: "100%", borderRadius: "10px" }}
          />
        </div>
      )} */
}
