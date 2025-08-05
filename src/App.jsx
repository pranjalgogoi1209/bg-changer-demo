import React, { useState } from "react";
import Home from "./components/home/Home";
import Camera from "./components/camera/Camera";
import Bg from "./components/bg/Bg";
import Output from "./components/output/Output";

export default function App() {
  const [currentComponent, setCurrentComponent] = useState("Bg");

  const handleComponentChange = (componentName) => {
    setCurrentComponent(componentName);
  };

  const components = [
    {
      name: "Home",
      component: <Home onComponentChange={handleComponentChange} />,
    },
    {
      name: "Camera",
      component: <Camera />,
    },
    {
      name: "Bg",
      component: <Bg onComponentChange={handleComponentChange} />,
    },
    {
      name: "Output",
      component: <Output />,
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
