import { useEffect, useState } from "react";
import { useApp } from "../AppContext";
import type { ProgramId } from "../types";

const ICONS: { id: ProgramId; label: string; glyph: string }[] = [
  { id: "goflow", label: "GoFlow", glyph: "GF" },
  { id: "prepflow", label: "PrepFlow", glyph: "PF" },
  { id: "heatflow", label: "HeatFlow", glyph: "HF" },
  { id: "wellflow", label: "WellFlow", glyph: "WF" },
];

export function Desktop() {
  const { activeProgram, launchProgram, closeProgram } = useApp();
  const [selected, setSelected] = useState<ProgramId | null>(null);
  const [clock, setClock] = useState(formatTime());

  useEffect(() => {
    const t = setInterval(() => setClock(formatTime()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="desktop" onClick={() => setSelected(null)}>
      <div className="museum-banner">
        Multiflow museum replica — canned physics
      </div>
      <div className="desktop-icons">
        {ICONS.map((icon) => (
          <button
            key={icon.id}
            type="button"
            className={`desktop-icon ${selected === icon.id ? "selected" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setSelected(icon.id);
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              launchProgram(icon.id);
            }}
          >
            <div className="desktop-icon-glyph">{icon.glyph}</div>
            <div className="desktop-icon-label">{icon.label}</div>
          </button>
        ))}
      </div>
      <div className="taskbar">
        <button type="button" className="start-button">
          <span style={{ fontSize: 14 }}>🪟</span> Start
        </button>
        {activeProgram && (
          <button
            type="button"
            className="taskbar-app active"
            onClick={() => closeProgram()}
            title="Click to close program"
          >
            {labelFor(activeProgram)}
          </button>
        )}
        <div className="taskbar-clock">{clock}</div>
      </div>
    </div>
  );
}

function labelFor(id: ProgramId): string {
  return ICONS.find((i) => i.id === id)?.label ?? id;
}

function formatTime(): string {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
