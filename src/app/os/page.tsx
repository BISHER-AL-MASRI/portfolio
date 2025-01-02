"use client";
import Calculator from "@/app/os/apps/calculator";
import Credits from "@/app/os/apps/Credits";
import Terminal from "@/app/os/apps/terminal";
import DesktopShortcutButton from "@/components/ui/DesktopShortcutButton";
import { ZIndexProvider } from "@/Contexts/ZIndexContext";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import './page.css'
// import Dock from "@/components/ui/Dock";

export default function OS() {
  return (
    <ZIndexProvider>
      <div className="bg-url text-white w-screen h-screen flex items-center justify-center font-mono overflow-hidden relative">
        <Link
          href="/"
          className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={16} />
          Portfolio
        </Link>

        <DesktopShortcutButton
          name="Terminal"
          icon="/imgs/Terminal.png"
          component={Terminal}
        />
        <DesktopShortcutButton
          name="Calculator"
          icon="/imgs/Calculator.png"
          component={Calculator}
        />
        <DesktopShortcutButton
          name="Credits"
          icon="/imgs/Credits.png"
          component={Credits}
        />
        {/* <Dock /> */}
      </div>
    </ZIndexProvider>
  );
}
