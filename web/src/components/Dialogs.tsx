import { AccelButton, WinWindow } from "./WinWindow";
import { useApp } from "../AppContext";
import { useState } from "react";

export function MsgBox() {
  const { msgBox } = useApp();
  if (!msgBox) return null;

  const buttons = msgBox.buttons.includes("okcancel")
    ? (["ok", "cancel"] as const)
    : msgBox.buttons.includes("cancel")
      ? (["cancel"] as const)
      : (["ok"] as const);

  return (
    <div className="msgbox-backdrop">
      <div className="msgbox">
        <div className="win-titlebar">
          <span className="win-titlebar-text">{msgBox.title}</span>
        </div>
        <div className="msgbox-body">
          <div
            className={`msgbox-icon ${msgBox.icon === "info" ? "exclamation" : msgBox.icon}`}
          >
            {msgBox.icon === "critical" ? "✕" : msgBox.icon === "info" ? "i" : "!"}
          </div>
          <div className="msgbox-text">{msgBox.message}</div>
        </div>
        <div className="msgbox-buttons">
          {buttons.map((b) => (
            <AccelButton
              key={b}
              label={b === "ok" ? "&OK" : "&Cancel"}
              isDefault={b === "ok"}
              onClick={() => msgBox.resolve(b)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function FileOpenDialog() {
  const { fileOpen } = useApp();
  const [selected, setSelected] = useState(0);

  if (!fileOpen) return null;

  return (
    <div className="fileopen-backdrop">
      <WinWindow
        title={fileOpen.title}
        width={420}
        height="auto"
        modal
        onClose={() => fileOpen.resolve(null)}
        showMinimize={false}
      >
        <div className="fileopen">
          <div>Look in: C:\Program Files\Goflow\</div>
          <div className="fileopen-list">
            {fileOpen.files.map((f, i) => (
              <div
                key={f.name}
                className={`fileopen-item ${i === selected ? "selected" : ""}`}
                onClick={() => setSelected(i)}
                onDoubleClick={() => fileOpen.resolve(f.name)}
              >
                {f.label}
              </div>
            ))}
          </div>
          <div className="field-row">
            <label>File name:</label>
            <input
              className="win-field"
              style={{ flex: 1, width: "auto", color: "#000" }}
              value={fileOpen.files[selected]?.name ?? ""}
              readOnly
            />
          </div>
          <div className="btn-row right">
            <AccelButton
              label="&Open"
              isDefault
              onClick={() =>
                fileOpen.resolve(fileOpen.files[selected]?.name ?? null)
              }
            />
            <AccelButton
              label="&Cancel"
              onClick={() => fileOpen.resolve(null)}
            />
          </div>
        </div>
      </WinWindow>
    </div>
  );
}
