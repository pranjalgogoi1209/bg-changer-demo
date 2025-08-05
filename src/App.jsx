import React, { useState } from "react";
import Home from "./components/home/Home";
import Camera from "./components/camera/Camera";
import Bg from "./components/bg/Bg";
import Output from "./components/output/Output";

export default function App() {
  const [currentComponent, setCurrentComponent] = useState("Home");
  const components = [
    {
      name: "Home",
      component: <Home />,
    },
    {
      name: "Camera",
      component: <Camera />,
    },
    {
      name: "Bg",
      component: <Bg />,
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
