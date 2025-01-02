import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Terminal,
  Code2,
  Gamepad2,
  Book,
  Mail,
  Trophy,
  Layers,
  Code,
  Monitor,
} from "lucide-react";
import Link from "next/link";
import { parseColorCodes } from "@/utils/colorcodes";

export default function Portfolio() {
  const projects = [
    {
      name: "Operating System portfolio",
      desc: "An OS version of my portfolio with a terminal and calculator app",
      url: "/os",
    },
    {
      name: "Wolfarson",
      desc: "A game made in Unity inspired by DaniDev's game Karlson",
      url: "https://github.com/bisher-al-masri/wolfarson",
    },
    {
      name: "Supa Shell",
      desc: "A lightweight shell written in Rust inspired by the Z shell",
      url: "https://github.com/bisher-al-masri/supa-shell",
    },
    {
      name: "BigroOS",
      desc: "A simple OS written in C and Gnu ASM inspired by the Linux kernel",
      url: "https://github.com/bisher-al-masri/bigro-os",
    },
    {
      name: "http",
      desc: "A simple HTTP server written in Rust that supports static files and dynamic content",
      url: "https://github.com/bisher-al-masri/http",
    },
    {
      name: "expressgtk",
      desc: "An express vpn GUI written in rust for linux since there was no official GUI for it",
      url: "https://github.com/bisher-al-masri/expressgtk",
    },
  ];

  const techStack = {
    best_languages: ["C/C++", "Python", "Rust", "TypeScript"],
    frameworks: ["React", "Next.js"],
    game_engines: ["Unity", "Godot"],
    tools: ["Git", "Docker", "VS Code"],
    databases: ["PostgreSQL", "MongoDB"],
    editors: ["VS Code", "Neovim"],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
            Bisher Al Masri
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            13-year-old Developer & Game Creator
          </p>
          <Button
            asChild
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            <Link href="/os">
              <Monitor className="mr-2 h-4 w-4" />
              View OS Version
            </Link>
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal size={24} className="text-blue-500" />
                About Me
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <div
                dangerouslySetInnerHTML={{
                  __html: parseColorCodes(
                    "I am [rose]Bisher Al Masri,[/] I am 13 years old, I started coding in 2019, I primarly code in [teal]Typescript,[/] [orange]Rust,[/] and [yellow]Python[/]",
                  ),
                }}
              />
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book size={24} className="text-green-500" />
                Currently Learning
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <div
                dangerouslySetInnerHTML={{
                  __html: parseColorCodes(
                    "I am currently learning [beige]C/C++[/] and [teal]Unreal Engine[/]",
                  ),
                }}
              />
            </CardContent>
          </Card>
        </div>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Code2 size={28} className="text-purple-500" />
            Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <Card
                key={i}
                className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors"
              >
                <CardContent className="pt-6">
                  <h3 className="font-bold text-xl mb-2">{project.name}</h3>
                  <p className="text-gray-300">{project.desc}</p>
                  {project.url && (
                    <Link
                      href={project.url}
                      className="text-blue-400 hover:text-blue-300 mt-2 inline-block"
                    >
                      View Project →
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Layers size={28} className="text-yellow-500" />
            Tech Stack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center items-center">
            {Object.entries(techStack).map(([category, items]) => (
              <Card key={category} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="capitalize">
                    {category.replace("_", " ")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1 bg-gray-700 rounded-full text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Trophy size={28} className="text-yellow-500" />
            Achievements
          </h2>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div
                dangerouslySetInnerHTML={{
                  __html: parseColorCodes(
                    "[gold]• Second Place in Stack Hacks 2023 [/] [gray] <br> • 5500 extenstion installs in VS Code [/] [brown] <br> • 2200 npm package installs",
                  ),
                }}
              />
            </CardContent>
          </Card>
        </section>

        <footer className="text-center">
          <h2 className="text-3xl font-bold mb-6 flex items-center justify-center gap-2">
            <Mail size={28} className="text-blue-500" />
            Contact
          </h2>
          <div className="flex justify-center gap-4">
            <Button asChild variant="outline">
              <a href="mailto:bisherkhaldoun@gmail.com">Email</a>
            </Button>
            <Button asChild variant="outline">
              <a
                href="https://github.com/bisher-al-masri"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}
