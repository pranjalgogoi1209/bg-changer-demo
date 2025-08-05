import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { FaceDetection } from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";
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
      model: "short", // Fast detection
      minDetectionConfidence: 0.5,
    });

    faceDetection.onResults((results) => {
      if (results.detections.length > 0) {
        const face = results.detections[0];
        const box = face.boundingBox;

        const faceCenterX = box.xCenter;
        const faceCenterY = box.yCenter;

        // Check if face center is near middle of screen
        const centerTolerance = 0.1; // Adjust as needed

        const isXCentered = Math.abs(faceCenterX - 0.5) < centerTolerance;
        const isYCentered = Math.abs(faceCenterY - 0.5) < centerTolerance;

        setIsCentered(isXCentered && isYCentered);
      } else {
        setIsCentered(false);
      }
    });

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
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
    const imageSrc = webcamRef.current.getScreenshot();
    setBase64Image(imageSrc);
    setHasCaptured(true);
  };

  const handleRetake = () => {
    setBase64Image(null);
    setHasCaptured(false);
  };

  return (
    <div style={{ position: "relative", width: 300, height: 400 }}>
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: "user" }}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "10px",
        }}
      />

      {/* Overlay Circle */}
      <div
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
      </div>

      {/* 🖼 Show captured image */}
      {base64Image && (
        <div style={{ marginTop: 10 }}>
          <p>✅ Captured Image:</p>
          <img
            src={base64Image}
            alt="Captured"
            style={{ width: "100%", borderRadius: "10px" }}
          />
        </div>
      )}
      {hasCaptured ? (
        <button onClick={handleRetake}>Retake</button>
      ) : (
        <button onClick={captureImage}>Capture</button>
      )}
    </div>
  );
}
