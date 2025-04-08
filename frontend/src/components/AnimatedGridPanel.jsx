import { useState } from "react";

export default function AnimatedGridPanel({ title = "Join our community", subtitle = "Connect with friends, share moments, and stay in touch with your loved ones." }) {
  const [hoveredTile, setHoveredTile] = useState(null);
  
  // Create a 3x3 grid
  const gridItems = Array.from({ length: 9 }, (_, index) => ({
    id: index,
    animationDelay: `${Math.random() * 2}s`
  }));

  return (
    <div className="flex flex-col items-center justify-center h-full py-8 px-4">
      <div className="grid grid-cols-3 gap-4 w-80 mb-8">
        {gridItems.map((item) => (
          <div
            key={item.id}
            className="aspect-square bg-indigo-900/40 rounded-lg cursor-pointer transition-all duration-300 hover:bg-indigo-800/60 hover:scale-105"
            style={{
              animation: `pulse 3s infinite ${item.animationDelay}`,
            }}
            onMouseEnter={() => setHoveredTile(item.id)}
            onMouseLeave={() => setHoveredTile(null)}
          />
        ))}
      </div>
      
      <div className="text-center max-w-sm">
        <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
        <p className="text-gray-300">
          {subtitle}
        </p>
      </div>
      
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.3; }
          50% { opacity: 0.7; }
          100% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}