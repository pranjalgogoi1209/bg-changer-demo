import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { FaceDetection } from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";
import "./camera.scss";

export default function CameraComponent({ onComponentChange, onCaptureImg }) {
  const webcamRef = useRef(null);
  const cameraRef = useRef(null);
  const faceDetectionRef = useRef(null); // store face detection instance

  const [isCentered, setIsCentered] = useState(false);
  const [base64Image, setBase64Image] = useState(null);
  const [hasCaptured, setHasCaptured] = useState(false);

  // function to start camera
  const startCamera = () => {
    if (webcamRef.current?.video && webcamRef.current.video.readyState === 4) {
      cameraRef.current = new Camera(webcamRef.current.video, {
        onFrame: async () => {
          if (webcamRef.current?.video) {
            await faceDetectionRef.current.send({
              image: webcamRef.current.video,
            });
          }
        },
        width: 720,
        height: 720,
      });
      cameraRef.current.start();
      console.log("Camera started");
    } else {
      setTimeout(startCamera, 100);
    }
  };

  // Initial setup
  useEffect(() => {
    faceDetectionRef.current = new FaceDetection({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    });

    faceDetectionRef.current.setOptions({
      model: "short",
      minDetectionConfidence: 0.5,
    });

    faceDetectionRef.current.onResults((results) => {
      if (results.detections.length > 0) {
        const face = results.detections[0];
        const box = face.boundingBox;
        const centerTolerance = 0.1;
        const isXCentered = Math.abs(box.xCenter - 0.5) < centerTolerance;
        const isYCentered = Math.abs(box.yCenter - 0.5) < centerTolerance;
        setIsCentered(isXCentered && isYCentered);
      } else {
        setIsCentered(false);
      }
    });

    startCamera();

    return () => {
      cameraRef.current?.stop?.();
    };
  }, []);

  // Capture image
  const captureImage = () => {
    if (!isCentered) {
      alert("Please keep your face in the center!");
      return;
    }
    if (webcamRef.current?.getScreenshot()) {
      const imageSrc = webcamRef.current.getScreenshot();
      setBase64Image(imageSrc);
      setHasCaptured(true);
      cameraRef.current?.stop?.();
    }
  };

  // Retake image
  const handleRetake = () => {
    setBase64Image(null);
    setHasCaptured(false);
    setIsCentered(false);

    setTimeout(() => {
      cameraRef.current?.stop?.();
      startCamera();
    }, 200);
  };

  const handleSubmit = () => {
    onCaptureImg(base64Image);
    onComponentChange("Bg");
  };

  return (
    <div
      className="CameraPage d-flex flex-column justify-content-center align-items-center min-vh-100 vw-100 text-center text-light p-4"
      style={{ overflow: "hidden" }}
    >
      <div className="camera d-flex flex-column justify-content-center align-items-center">
        <h1 className="mb-4 fw-bold text-shadow">CAPTURE YOUR IMAGE</h1>
        <div className="webcamContainer flex-row-center position-relative mb-4">
          {!hasCaptured ? (
            <>
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/png"
                videoConstraints={{
                  width: 720,
                  height: 720,
                  aspectRatio: 1,
                  facingMode: "user",
                }}
                id="webcam"
                forceScreenshotSourceSize={true}
                screenshotQuality={1}
                mirrored={true}
              />

              {/* Overlay */}
              <div className="scan-overlay">
                <div
                  className={`scan-circle ${
                    isCentered ? "centered" : "scanning"
                  }`}
                  style={{
                    border: `4px solid ${isCentered ? "limegreen" : "red"}`,
                  }}
                />
              </div>
            </>
          ) : (
            <img src={base64Image} alt="Captured" className="caturedImg" />
          )}
        </div>

        {hasCaptured ? (
          <div className="d-flex gap-4">
            <button className="btn btn-secondary btn-lg" onClick={handleRetake}>
              Retake
            </button>
            <button className="btn btn-success btn-lg" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        ) : (
          <button className="btn btn-success btn-lg" onClick={captureImage}>
            Capture
          </button>
        )}
      </div>
    </div>
  );
}
