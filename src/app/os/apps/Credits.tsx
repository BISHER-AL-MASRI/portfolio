"use client";
import { useState, useEffect } from "react";
import { Rnd, RndDragCallback, RndResizeCallback } from "react-rnd";
import { useZIndex } from "@/Contexts/ZIndexContext";

export default function Credits({
  onClose,
  id,
}: {
  onClose: () => void;
  id: number;
}) {
  const [mounted, setMounted] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [creditsSize, setCreditsSize] = useState({ width: 0, height: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const { zIndexes, bringToFront } = useZIndex();

  const onDragStop: RndDragCallback = (_e, d) => {
    const x = Math.max(0, Math.min(d.x, window.innerWidth - creditsSize.width));
    const y = Math.max(
      0,
      Math.min(d.y, window.innerHeight - creditsSize.height),
    );
    setPosition({ x, y });
  };

  const onResize: RndResizeCallback = (
    _e,
    _direction,
    ref,
    _delta,
    position,
  ) => {
    const newWidth = ref.offsetWidth;
    const newHeight = ref.offsetHeight;
    const x = Math.max(0, Math.min(position.x, window.innerWidth - newWidth));
    const y = Math.max(0, Math.min(position.y, window.innerHeight - newHeight));
    setCreditsSize({ width: newWidth, height: newHeight });
    setPosition({ x, y });
  };

  useEffect(() => {
    setMounted(true);

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      setWindowSize({ width: newWidth, height: newHeight });
      setPosition((prev) => ({
        x: Math.max(0, Math.min(prev.x, newWidth - creditsSize.width)),
        y: Math.max(0, Math.min(prev.y, newHeight - creditsSize.height)),
      }));
    };

    const isMobile = window.innerWidth < 768;
    const defaultWidth = 320;
    const defaultHeight = 150;

    setCreditsSize({ width: defaultWidth, height: defaultHeight });

    const defaultX = Math.max(0, (window.innerWidth - defaultWidth) / 2);
    const defaultY = Math.max(0, (window.innerHeight - defaultHeight) / 2);

    setPosition({ x: defaultX, y: defaultY });

    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isVisible) return null;

  if (!mounted) {
    return <div className="bg-gray-900 min-h-screen"></div>;
  }

  return (
    <Rnd
      default={{
        x: position.x,
        y: position.y,
        width: creditsSize.width,
        height: creditsSize.height,
      }}
      position={{ x: position.x, y: position.y }}
      size={{ width: creditsSize.width, height: creditsSize.height }}
      minHeight={200}
      minWidth={320}
      bounds="parent"
      className="rounded-lg shadow-lg bg-gray-800 bg-opacity-90 text-white"
      dragHandleClassName="credits-header"
      onDragStop={onDragStop}
      onResize={onResize}
      onClick={() => bringToFront(id)}
      style={{ zIndex: zIndexes.indexOf(id) + 1 }}
    >
      <div className="credits-header flex items-center justify-between px-4 py-2 bg-gray-800 text-gray-300 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <span
            className="w-3 h-3 bg-red-500 rounded-full"
            onClick={onClose}
          ></span>
          <span
            className="w-3 h-3 bg-yellow-500 rounded-full"
            onClick={() => setIsVisible(false)}
          ></span>
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <span className="text-sm font-bold">Credits</span>
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">Credits</h2>
        <ul className="list-disc list-inside">
          <li>
            <span className="text-yellow-400">Icons:</span> Unicons by Rhino
            Linux
          </li>
        </ul>
      </div>
    </Rnd>
  );
}
