import { createContext, useContext, useState } from "react";

const ZIndexContext = createContext<{
  zIndexes: number[];
  bringToFront: (id: number) => void;
}>({
  zIndexes: [],
  bringToFront: () => {},
});

export const ZIndexProvider = ({ children }: { children: React.ReactNode }) => {
  const [zIndexes, setZIndexes] = useState<number[]>([]);

  const bringToFront = (id: number) => {
    setZIndexes((prev) => {
      const newZIndexes = prev.filter((z) => z !== id);
      newZIndexes.push(id);
      return newZIndexes;
    });
  };

  return (
    <ZIndexContext.Provider value={{ zIndexes, bringToFront }}>
      {children}
    </ZIndexContext.Provider>
  );
};

export const useZIndex = () => useContext(ZIndexContext);
