import { useEffect, type ReactNode } from "react";

interface WinWindowProps {
  title: string;
  width?: number;
  height?: number | "auto";
  left?: number | string;
  top?: number | string;
  children: ReactNode;
  onClose?: () => void;
  showMaximize?: boolean;
  showMinimize?: boolean;
  modal?: boolean;
  className?: string;
  clientClassName?: string;
  noPadding?: boolean;
}

export function WinWindow({
  title,
  width = 460,
  height = "auto",
  left = "50%",
  top = "48%",
  children,
  onClose,
  showMaximize = false,
  showMinimize = true,
  modal = false,
  className = "",
  clientClassName = "",
  noPadding = false,
}: WinWindowProps) {
  const centered =
    left === "50%" && top === "48%"
      ? {
          left: "50%",
          top: "48%",
          transform: "translate(-50%, -50%)",
        }
      : { left, top };

  return (
    <div
      className={`win-window ${modal ? "modal-layer" : ""} ${className}`}
      style={{
        width,
        height: height === "auto" ? undefined : height,
        ...centered,
      }}
    >
      <div className="win-titlebar">
        <span className="win-titlebar-text">{title}</span>
        <div className="win-titlebar-buttons">
          {showMinimize && (
            <button type="button" className="win-tb-btn" tabIndex={-1}>
              _
            </button>
          )}
          {showMaximize && (
            <button type="button" className="win-tb-btn" tabIndex={-1}>
              □
            </button>
          )}
          <button
            type="button"
            className="win-tb-btn"
            tabIndex={-1}
            onClick={onClose}
          >
            ×
          </button>
        </div>
      </div>
      <div
        className={`win-client ${clientClassName}`}
        style={noPadding ? { padding: 0 } : undefined}
      >
        {children}
      </div>
    </div>
  );
}

/** Renders caption with &X as underlined accelerator */
export function AccelLabel({ text }: { text: string }) {
  const idx = text.indexOf("&");
  if (idx < 0 || idx >= text.length - 1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="accel">{text[idx + 1]}</span>
      {text.slice(idx + 2)}
    </>
  );
}

export function AccelButton({
  label,
  onClick,
  disabled,
  isDefault,
  style,
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  isDefault?: boolean;
  style?: React.CSSProperties;
}) {
  const key = useAccelKey(label, onClick, disabled);
  return (
    <button
      type="button"
      className={`win-btn ${isDefault ? "default" : ""}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
      data-accel={key}
    >
      <AccelLabel text={label} />
    </button>
  );
}

function useAccelKey(
  label: string,
  onClick?: () => void,
  disabled?: boolean
): string | undefined {
  const idx = label.indexOf("&");
  const key = idx >= 0 ? label[idx + 1]?.toLowerCase() : undefined;

  useEffect(() => {
    if (!key || !onClick || disabled) return;
    const handler = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === key) {
        e.preventDefault();
        onClick();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [key, onClick, disabled]);

  return key;
}
