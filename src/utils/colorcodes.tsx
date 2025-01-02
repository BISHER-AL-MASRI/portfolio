export const parseColorCodes = (text: string) => {
  const colorMap = {
    "[red]": "text-red-400",
    "[green]": "text-green-400",
    "[blue]": "text-blue-400",
    "[yellow]": "text-yellow-400",
    "[purple]": "text-purple-400",
    "[cyan]": "text-cyan-400",
    "[gold]": "text-yellow-400",
    "[white]": "text-white",
    "[gray]": "text-gray-400",
    "[orange]": "text-orange-400",
    "[peach]": "text-peach-400",
    "[brown]": "text-brown-400",
    "[beige]": "text-beige-400",
    "[teal]": "text-teal-300",
    "[sky]": "text-sky-400",
    "[rose]": "text-rose-500",
    "[maroon]": "text-maroon-800",
    "[navy]": "text-navy-400",
    "[/]": "",
  };

  let result = text;
  Object.entries(colorMap).forEach(([code, className]) => {
    result = result.replaceAll(
      code,
      code === "[/]" ? "</span>" : `<span class="${className}">`,
    );
  });

  return result.replace(/\n/g, "<br>");
};
