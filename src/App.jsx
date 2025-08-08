import React, { useState } from "react";
import Home from "./components/home/Home";
import Gender from "./components/gender/Gender";
import Camera from "./components/camera/Camera";
import Bg from "./components/bg/Bg";
import Output from "./components/output/Output";
import axios from "axios";

export default function App() {
  const [currentComponent, setCurrentComponent] = useState("Home");
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedBg, setSelectedBg] = useState(null);
  const [capturedImg, setCapturedImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleComponentChange = (componentName) => {
    setCurrentComponent(componentName);
  };

  const handleGenerateBg = async () => {
    if (!selectedBg || !capturedImg) {
      alert("Please capture or Select a background first");
      return;
    }

    setIsLoading(true);

    // Helper to convert File object to base64 (returns a Promise)
    async function fetchImageAsBase64(url) {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }

    // Convert both images to base64 strings
    const [background_b64] = await Promise.all([
      fetchImageAsBase64(selectedBg.background_b64),
    ]);

    const prompts = {
      Male: "man  wearing traditional attire — an elegant cream silk kurta with intricate red .",
      Female:
        "female wearing traditional Bengali attire — an elegant silk white saree with red embroidery.",
    };

    const submitData = {
      output_format: "png",
      prompt_upsampling: false,
      safety_tolerance: 2,
      prompt: prompts[selectedGender],
      idol_safe_zone_top: selectedBg.idol_safe_zone_top,
      min_group_scale: selectedBg.min_group_scale,
      max_group_scale: selectedBg.max_group_scale,
      user_scale: selectedBg.user_scale,
      horizontal_shift: selectedBg.horizontal_shift,
      color_balance: selectedBg.color_balance,
      feather_px: selectedBg.feather_px,
      image_base64: capturedImg.split(",")[1],
      background_b64: background_b64.split(",")[1],
    };

    console.log(submitData);

    // API call
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/edit`,
        submitData
      );
      console.log("API response:", response.data);
      setIsLoading(false);
      return response.data.composited_image;
    } catch (error) {
      console.error("API error:", error);
      alert("Submission failed");
      setIsLoading(false);
    }
  };

  const components = [
    {
      name: "Home",
      component: <Home onComponentChange={handleComponentChange} />,
    },
    {
      name: "Gender",
      component: (
        <Gender
          onComponentChange={handleComponentChange}
          onSelectGender={(gender) => setSelectedGender(gender)}
        />
      ),
    },
    {
      name: "Camera",
      component: (
        <Camera
          onComponentChange={handleComponentChange}
          onCaptureImg={(img) => setCapturedImg(img)}
        />
      ),
    },
    {
      name: "Bg",
      component: (
        <Bg
          onComponentChange={handleComponentChange}
          onSelectBg={(bg) => setSelectedBg(bg)}
        />
      ),
    },
    {
      name: "Output",
      component: (
        <Output
          onComponentChange={handleComponentChange}
          onApiCall={handleGenerateBg}
          isLoading={isLoading}
        />
      ),
    },
  ];

  return (
    <>
      {components.map((comp) => {
        if (comp.name === currentComponent) {
          return <div key={comp.name}>{comp.component}</div>;
        }
      })}
    </>
  );
}
