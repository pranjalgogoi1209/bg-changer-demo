import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { FaceDetection } from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";
import { Modal, Button } from "react-bootstrap";
import "./camera.scss";
import humanMask from "./../../assets/human-mask.png";

export default function CameraComponent({ onComponentChange, onCaptureImg }) {
  const webcamRef = useRef(null);
  const [isCentered, setIsCentered] = useState(false);
  const [base64Image, setBase64Image] = useState(null);
  const [hasCaptured, setHasCaptured] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isCounting, setIsCounting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Add this handler for copying to clipboard
  /*   const handleCopyBase64 = async () => {
    try {
      await navigator.clipboard.writeText(base64Image.split(",")[1]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      alert("Failed to copy!");
    }
  }; */

  // useEffect(() => {
  //   const faceDetection = new FaceDetection({
  //     locateFile: (file) =>
  //       `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
  //   });

  //   faceDetection.setOptions({
  //     model: "short",
  //     minDetectionConfidence: 0.5,
  //   });

  //   faceDetection.onResults((results) => {
  //     if (results.detections.length > 0) {
  //       const face = results.detections[0];
  //       const box = face.boundingBox;
  //       const faceCenterX = box.xCenter;
  //       const faceCenterY = box.yCenter;
  //       const centerTolerance = 0.1;
  //       const isXCentered = Math.abs(faceCenterX - 0.5) < centerTolerance;
  //       const isYCentered = Math.abs(faceCenterY - 0.5) < centerTolerance;
  //       setIsCentered(isXCentered && isYCentered);
  //     } else {
  //       setIsCentered(false);
  //     }
  //   });

  //   if (webcamRef.current?.video) {
  //     const camera = new Camera(webcamRef.current.video, {
  //       onFrame: async () => {
  //         await faceDetection.send({ image: webcamRef.current.video });
  //       },
  //       width: 300,
  //       height: 400,
  //     });
  //     camera.start();
  //   }
  // }, []);

  // handle capture screenshot
  const captureImage = () => {
    setCountdown(3);
    setIsCounting(true);
  };

  const handleRetake = () => {
    setBase64Image(null);
    setHasCaptured(false);
    setCountdown(3);
  };

  // countdown
  useEffect(() => {
    let countdownInterval;
    if (isCounting && countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (isCounting && countdown === 0) {
      if (webcamRef.current.getScreenshot()) {
        const imageSrc = webcamRef.current.getScreenshot();
        setBase64Image(imageSrc);
        setHasCaptured(true);
      }
      setIsCounting(false);
    }

    return () => clearInterval(countdownInterval);
  }, [isCounting, countdown]);

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
        {/* <div className="flex-row-center webcamContainer"></div> */}
        <div className=" webcamContainer flex-row-center  position-relative mb-4">
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
              {/* countdown */}
              {!hasCaptured && isCounting && (
                <span className="countdown">{countdown}</span>
              )}

              {/* human mask */}
              {/* <img src={humanMask} alt="humanMask" className="humanMask" /> */}

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
            <img src={base64Image} alt="Captured" className="caturedImg" />
          )}
        </div>

        {hasCaptured ? (
          <div className="d-flex gap-4">
            <button
              className="btn btn-secondary btn-lg "
              onClick={handleRetake}
            >
              Retake
            </button>
            <button className="btn btn-success btn-lg" onClick={handleSubmit}>
              Submit
            </button>
            {/* <button
              className="btn btn-outline-primary btn-lg"
              onClick={() => setShowModal(true)}
            >
              Get Base64 Link
            </button> */}
          </div>
        ) : (
          <button className="btn btn-success btn-lg" onClick={captureImage}>
            Capture
          </button>
        )}
      </div>

      {/* Bootstrap Modal for Copy */}
      {/*   <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Copy Base64 Link</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column align-items-center">
          <span className="mb-3">
            Press the button below to copy your base64 image string to
            clipboard.
          </span>
          <Button variant="primary" onClick={handleCopyBase64}>
            {copied ? "Copied!" : "Copy"}
          </Button>
        </Modal.Body>
      </Modal> */}
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
