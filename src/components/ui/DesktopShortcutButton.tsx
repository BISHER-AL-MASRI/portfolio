"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useZIndex } from "@/Contexts/ZIndexContext";

type TerminalComponentProps = {
  id: number;
  onClose: () => void;
};

export default function DesktopShortcutButton({
  name,
  icon,
  component: Component,
}: {
  name: string;
  icon: string;
  component: React.ComponentType<TerminalComponentProps>;
}) {
  const [openTerminals, setOpenTerminals] = useState<number[]>([]);
  const { bringToFront } = useZIndex();
  const [newTerminalId, setNewTerminalId] = useState<number | null>(null);

  const handleButtonClick = () => {
    const newId = Date.now();
    setOpenTerminals((prev) => [...prev, newId]);
    setNewTerminalId(newId);
  };

  useEffect(() => {
    if (newTerminalId !== null) {
      bringToFront(newTerminalId);
      setNewTerminalId(null);
    }
  }, [newTerminalId, bringToFront]);

  const handleCloseTerminal = (key: number) => {
    setOpenTerminals((prev) => prev.filter((k) => k !== key));
  };

  return (
    <>
      <Button
        size="lg"
        className="flex flex-col items-center p-4 h-auto hover:bg-gray-800"
        onClick={handleButtonClick}
      >
        <Image src={icon} alt={name} width={45} height={45} className="mb-2" />
        <span>{name}</span>
      </Button>
      {openTerminals.map((key) => (
        <Component
          key={key}
          id={key}
          onClose={() => handleCloseTerminal(key)}
        />
      ))}
    </>
  );
}
