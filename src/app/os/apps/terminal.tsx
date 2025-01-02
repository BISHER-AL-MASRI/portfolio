"use client";
import { useState, useEffect, useRef } from "react";
import { Rnd, RndDragCallback, RndResizeCallback } from "react-rnd";
import { useZIndex } from "@/Contexts/ZIndexContext";
import { parseColorCodes } from "@/utils/colorcodes";

export default function Terminal({
  onClose,
  id,
}: {
  onClose: () => void;
  id: number;
}) {
  const [mounted, setMounted] = useState(false);
  const [output, setOutput] = useState([
    {
      text: "Welcome to the terminal, type 'help' for a list of commands",
      type: "system",
      timestamp: "00:00:00",
    },
  ]);
  const [currentCommand, setCurrentCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [terminalSize, setTerminalSize] = useState({ width: 0, height: 0 });
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const { zIndexes, bringToFront } = useZIndex();

  const onDragStop: RndDragCallback = (_e, d) => {
    const x = Math.max(
      0,
      Math.min(d.x, window.innerWidth - terminalSize.width),
    );
    const y = Math.max(
      0,
      Math.min(d.y, window.innerHeight - terminalSize.height),
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

    setTerminalSize({
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
        x: Math.max(0, Math.min(prev.x, newWidth - terminalSize.width)),
        y: Math.max(0, Math.min(prev.y, newHeight - terminalSize.height)),
      }));
    };

    const isMobile = window.innerWidth < 768;
    const defaultWidth = isMobile ? 320 : 600;
    const defaultHeight = isMobile ? 480 : 400;

    setTerminalSize({
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
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const commandList = [
    [
      "whoami",
      "[rose]I am Bisher Al Masri,[/] I am 13 years old, I started coding in 2019, I primarly code in [teal]Typescript,[/] [orange]Rust,[/] and [yellow]Python[/]",
      "Who am I?",
    ],
    [
      "skills",
      "I am primarily a [rose]backend developer,[/] I have experience with [blue]React,[/] [gray]Next.js,[/] and [teal]Typescript[/] for web development, I also enjoy making games in [white]Unity,[/] and for anything else i use [orange]Rust[/] or [yellow]Python[/]",
      "My Skills",
    ],
    [
      "projects",
      "[cyan]My portfolio:[/] https://bisheralmasri.vercel.app\n[cyan]Wolfarson:[/] A game made in Unity\n[cyan]Supa Shell:[/] A simple lightweight shell written in Rust\n[cyan]BigroOS:[/] A simple operating system written in C and Gnu ASM\n[cyan]http:[/] A simple HTTP server written in Rust\n[cyan]expressgtk:[/] An express vpn GUI written in rust for linux",
      "My Projects",
    ],
    [
      "learning",
      "I am currently learning [beige]C/C++[/] and [teal]Unreal Engine[/]",
      "What am I learning?",
    ],
    [
      "contact",
      "[cyan]Email:[/] bisherkhaldoun@gmail.com, [gray]Github:[/] https://github.com/bisher-al-masri",
      "Contact information",
    ],
    [
      "achievements",
      "[gold]• Second Place[/] in Stack Hacks 2023\n ",
      "My achievements",
    ],
    [
      "tech",
      "[rose]Languages:[/] [teal]TypeScript,[/] [orange]Rust,[/] [yellow]Python,[/] [blue]C[/][beige]++[/]\n[maroon]Frameworks:[/] [blue]React,[/] [gray]Next.js\n [navy]Game Engines:[/] [white]Unity,[/] Godot\n[purple]Tools:[/] [red]Git,[/] [cyan]Docker,[/] [sky]VS Code[/]\n[brown]Databases:[/] [purple]PostgreSQL,[/] [green]MongoDB",
      "Technical stack",
    ],
    [
      "languages",
      "[blue]C[/],[/] [blue]C[/][beige]++,[/] [red]Zsh/Shell Langs,[/] [yellow]Python,[/] [orange]Rust,[/] [cyan]JS,[/] [teal]TypeScript,[/] [white]C#,[/] [gray]Swift,[/] [maroon]HTML/CSS,[/] [sky]GDScript,[/] [peach]Java,[/] [navy]Lua,[/] [brown]Swift[/]",
      "Languages I know",
    ],
    ["credits", "[gold]Icons: Unicons by Rhino Linux", "Credits"],
    ["clear", "", "Clear the terminal"],
  ];

  let tabCompletions: string[] = ["help"];

  commandList.forEach(([cmd]) => tabCompletions.push(cmd));

  const handleCommand = (event: {
    key: string;
    preventDefault: () => void;
  }) => {
    if (event.key === "Enter") {
      const command = currentCommand.trim();
      if (command !== "") {
        setCommandHistory((prev) => [...prev, command]);
        setHistoryIndex(-1);
        setCurrentCommand("");

        if (command === "clear") {
          setOutput([]);
          return;
        }

        const newOutput = {
          text: command,
          type: "command",
          timestamp: new Date().toLocaleTimeString(),
        };

        const foundCommand = commandList.find(([cmd]) => cmd === command);
        if (foundCommand) {
          setOutput((prev) => [
            ...prev,
            newOutput,
            {
              text: foundCommand[1],
              type: "response",
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
        } else if (command === "help") {
          const helpText = commandList
            .map(([cmd, , desc]) => `[cyan]${cmd}[/]: ${desc}`)
            .join("\n");
          setOutput((prev) => [
            ...prev,
            newOutput,
            {
              text: helpText,
              type: "response",
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
        } else {
          setOutput((prev) => [
            ...prev,
            newOutput,
            {
              text: `Command not found: ${command}`,
              type: "error",
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
        }
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentCommand("");
      }
    } else if (event.key === "Tab") {
      event.preventDefault();
      const matches = tabCompletions.filter((cmd) =>
        cmd.startsWith(currentCommand),
      );
      if (matches.length === 1) {
        setCurrentCommand(matches[0]);
      } else if (matches.length > 1) {
        setOutput((prev) => [
          ...prev,
          {
            text: `Possible completions: ${matches.join(", ")}`,
            type: "response",
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      }
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
        width: terminalSize.width,
        height: terminalSize.height,
      }}
      position={{ x: position.x, y: position.y }}
      size={{ width: terminalSize.width, height: terminalSize.height }}
      minWidth={300}
      minHeight={185}
      bounds="parent"
      className="rounded-lg shadow-lg bg-gray-900 bg-opacity-80"
      dragHandleClassName="terminal-header"
      onDragStop={onDragStop}
      onResize={onResize}
      enableResizing={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }}
      onClick={() => {
        inputRef.current?.focus();
        bringToFront(id);
      }}
      style={{ zIndex: zIndexes.indexOf(id) + 1 }}
    >
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.8);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.8);
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(75, 85, 99, 0.8) rgba(31, 41, 55, 0.5);
        }
      `}</style>
      <div className="terminal-header flex items-center justify-between px-4 py-2 bg-gray-700 text-white rounded-t-lg">
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
          <span className="text-sm font-bold">Terminal</span>
        </div>
      </div>
      <div
        ref={outputRef}
        className="p-4 bg-gray-800 bg-opacity-90 h-[calc(100%-2.5rem)] overflow-y-auto custom-scrollbar"
        onClick={() => {
          inputRef.current?.focus();
          bringToFront(id);
        }}
      >
        <div className="space-y-2">
          {output.map((item, index) => (
            <div key={index} className="flex flex-col text-sm">
              <div className="flex items-center space-x-2 opacity-50 text-xs text-gray-400">
                <span>{item.timestamp}</span>
              </div>
              <div
                className={`
                  ${item.type === "command" ? "text-white" : ""}
                  ${item.type === "response" ? "text-green-400" : ""}
                  ${item.type === "error" ? "text-red-400" : ""}
                  ${item.type === "system" ? "text-blue-400" : ""}
                `}
                dangerouslySetInnerHTML={{
                  __html:
                    item.type === "response"
                      ? parseColorCodes(item.text)
                      : item.text,
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center mt-4 text-white">
          <span className="text-green-400">$</span>
          <input
            id={`terminal-input-${id}`}
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleCommand}
            className="flex-1 bg-transparent focus:outline-none ml-2"
            autoFocus
            autoComplete="off"
            onClick={() => bringToFront(id)}
          />
        </div>
      </div>
    </Rnd>
  );
}
