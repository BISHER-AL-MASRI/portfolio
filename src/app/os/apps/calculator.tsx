"use client";
import { useState, useEffect } from "react";
import { Rnd, RndDragCallback, RndResizeCallback } from "react-rnd";
import { useZIndex } from "@/Contexts/ZIndexContext";
import { evaluate } from "mathjs";

type CalculatorProps = {
  onClose: () => void;
  id: number;
};

type WindowSize = {
  width: number;
  height: number;
};

type Position = {
  x: number;
  y: number;
};

type CalculatorSize = {
  width: number;
  height: number;
};

export default function Calculator({ onClose, id }: CalculatorProps) {
  const [mounted, setMounted] = useState(false);
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  });
  const [calculatorSize, setCalculatorSize] = useState<CalculatorSize>({
    width: 0,
    height: 0,
  });
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const { zIndexes, bringToFront } = useZIndex();
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<string>("");

  const onDragStop: RndDragCallback = (_e, d) => {
    const x = Math.max(
      0,
      Math.min(d.x, window.innerWidth - calculatorSize.width),
    );
    const y = Math.max(
      0,
      Math.min(d.y, window.innerHeight - calculatorSize.height),
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

    setCalculatorSize({
      width: newWidth,
      height: newHeight,
    });

    setPosition({ x, y });
  };

  useEffect(() => {
    setMounted(true);

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      setWindowSize({
        width: newWidth,
        height: newHeight,
      });

      setPosition((prev) => ({
        x: Math.max(0, Math.min(prev.x, newWidth - calculatorSize.width)),
        y: Math.max(0, Math.min(prev.y, newHeight - calculatorSize.height)),
      }));
    };

    const isMobile = window.innerWidth < 768;
    const defaultWidth = isMobile ? 320 : 550;
    const defaultHeight = 400;

    setCalculatorSize({
      width: defaultWidth,
      height: defaultHeight,
    });

    const defaultX = Math.max(0, (window.innerWidth - defaultWidth) / 2);
    const defaultY = Math.max(0, (window.innerHeight - defaultHeight) / 2);

    setPosition({
      x: defaultX,
      y: defaultY,
    });

    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      if (key >= "0" && key <= "9") {
        handleButtonClick(key);
      } else if (key === "+" || key === "-" || key === "*" || key === "/") {
        handleButtonClick(key);
      } else if (key === "Enter") {
        handleButtonClick("=");
      } else if (key === "Escape") {
        handleButtonClick("C");
      } else if (key === "Backspace") {
        setInput(input.slice(0, -1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [input]);

  const handleButtonClick = (value: string) => {
    if (value === "C") {
      setInput("");
      setResult("");
    } else if (value === "=") {
      try {
        const evalResult = evaluate(input);
        setResult(evalResult.toString());
      } catch {
        setResult("Error");
      }
    } else {
      setInput(input + value);
    }
  };

  if (!isVisible) return null;

  if (!mounted) {
    return <div className="bg-gray-900 min-h-screen"></div>;
  }

  return (
    <Rnd
      default={{
        x: position.x,
        y: position.y,
        width: calculatorSize.width,
        height: calculatorSize.height,
      }}
      position={{ x: position.x, y: position.y }}
      size={{ width: calculatorSize.width, height: calculatorSize.height }}
      minHeight={400}
      minWidth={320}
      bounds="parent"
      className="rounded-lg shadow-lg bg-gray-800 bg-opacity-90 text-white"
      dragHandleClassName="calculator-header"
      onDragStop={onDragStop}
      onResize={onResize}
      onClick={() => {
        bringToFront(id);
      }}
      style={{ zIndex: zIndexes.indexOf(id) + 1 }}
    >
      <div className="calculator-header flex items-center justify-between px-4 py-2 bg-gray-800 text-gray-300 rounded-t-lg">
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
          <span className="text-sm font-bold">Calculator</span>
        </div>
      </div>
      <div className="p-4">
        <div className="bg-gray-700 text-gray-200 p-2 rounded mb-4">
          <div className="text-right text-lg font-mono">{input || 0}</div>
          <div className="text-right text-2xl font-bold text-green-400">
            {result}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            "7",
            "8",
            "9",
            "/",
            "4",
            "5",
            "6",
            "*",
            "1",
            "2",
            "3",
            "-",
            "0",
            "C",
            "+",
            "=",
          ].map((value) => (
            <button
              key={value}
              className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded font-mono"
              onClick={() => handleButtonClick(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
    </Rnd>
  );
}
