"use client";

import { useEffect, useRef, useState } from "react";

const COLORS = ["#0d9488", "#4f46e5", "#0284c7", "#dc2626"];

export function HeroQRPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<any>(null);
  const [activeColor, setActiveColor] = useState(COLORS[0]);

  useEffect(() => {
    if (!containerRef.current) return;
    let mounted = true;

    import("qr-code-styling").then(({ default: QRCodeStyling }) => {
      if (!mounted || !containerRef.current) return;
      const qr = new QRCodeStyling({
        width: 200,
        height: 200,
        data: "https://qr.desane.com.uy",
        dotsOptions: { color: activeColor, type: "rounded" },
        backgroundOptions: { color: "transparent" },
        qrOptions: { errorCorrectionLevel: "M" },
        cornersSquareOptions: { color: activeColor, type: "extra-rounded" },
        cornersDotOptions: { color: activeColor },
      } as any);
      qr.append(containerRef.current);
      qrRef.current = qr;
    });

    return () => {
      mounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleColorChange(color: string) {
    setActiveColor(color);
    qrRef.current?.update({
      dotsOptions: { color, type: "rounded" },
      cornersSquareOptions: { color, type: "extra-rounded" },
      cornersDotOptions: { color },
    });
  }

  return (
    <div className="relative animate-float">
      <div className="absolute -top-6 -right-6 w-32 h-32 bg-accent/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative bg-card border border-border rounded-2xl p-6 shadow-2xl w-72">
        <div className="flex items-center gap-1.5 mb-5">
          <div className="w-3 h-3 rounded-full bg-red-400/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
          <div className="w-3 h-3 rounded-full bg-green-400/70" />
          <span className="ml-2 text-xs text-muted-foreground font-mono">qr.desane.com.uy</span>
        </div>

        <div className="flex justify-center mb-5 rounded-xl overflow-hidden">
          <div ref={containerRef} className="flex items-center justify-center" />
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-xs text-muted-foreground mb-3">Personalización en tiempo real</p>
          <div className="flex items-center gap-3">
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className="w-6 h-6 rounded-full transition-all hover:scale-110 cursor-pointer"
                style={{
                  backgroundColor: color,
                  boxShadow: activeColor === color ? `0 0 0 2px white, 0 0 0 4px ${color}` : "none",
                }}
                aria-label={`Color ${color}`}
              />
            ))}
            <span className="ml-auto text-xs text-muted-foreground">PNG · SVG</span>
          </div>
        </div>
      </div>
    </div>
  );
}
