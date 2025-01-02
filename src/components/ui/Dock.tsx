import { useState, useEffect } from "react";
import Image from "next/image";
import { useZIndex } from "@/Contexts/ZIndexContext";
import Terminal from "@/app/os/apps/terminal";
import Calculator from "@/app/os/apps/calculator";
import Credits from "@/app/os/apps/Credits";

type DockItemProps = {
  name: string;
  icon: string;
  component: React.ComponentType<{ id: number; onClose: () => void }>;
};

export default function Dock() {
  const [dockItems] = useState<DockItemProps[]>([
    {
      name: "Terminal",
      icon: "/imgs/Terminal.png",
      component: Terminal,
    },
    {
      name: "Calculator",
      icon: "/imgs/Calculator.png",
      component: Calculator,
    },
    {
      name: "Credits",
      icon: "/imgs/Credits.png",
      component: Credits,
    },
  ]);
  const [openApps, setOpenApps] = useState<{ id: number; component: React.ComponentType<{ id: number; onClose: () => void }> }[]>([]);
  const { bringToFront } = useZIndex();
  const [newAppId, setNewAppId] = useState<number | null>(null);

  const handleDockItemClick = (component: React.ComponentType<{ id: number; onClose: () => void }>) => {
    const newId = Date.now();
    setOpenApps((prev) => [...prev, { id: newId, component }]);
    setNewAppId(newId);
  };

  useEffect(() => {
    if (newAppId !== null) {
      bringToFront(newAppId);
      setNewAppId(null);
    }
  }, [newAppId, bringToFront]);

  const handleCloseApp = (id: number) => {
    setOpenApps((prev) => prev.filter((app) => app.id !== id));
  };

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-90 rounded-t-lg p-2 flex space-x-4">
      {dockItems.map((item) => (
        <div key={item.name} className="flex flex-col items-center">
          <button
            className="hover:bg-gray-700 p-2 rounded-lg"
            onClick={() => handleDockItemClick(item.component)}
          >
            <Image src={item.icon} alt={item.name} width={45} height={45} />
          </button>
          <span className="text-xs text-white">{item.name}</span>
        </div>
      ))}
      {openApps.map(({ id, component: AppComponent }) => (
        <AppComponent key={id} id={id} onClose={() => handleCloseApp(id)} />
      ))}
    </div>
  );
}