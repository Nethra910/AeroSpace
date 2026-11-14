import { useState } from "react";
import { createPortal } from "react-dom";

// Tooltip for the collapsed sidebar. Rendered in a portal so it is never
// clipped by the sidebar's scroll container.
function RailTooltip({ label, enabled, children }) {
  const [pos, setPos] = useState(null);

  const show = (event) => {
    if (!enabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setPos({ top: rect.top + rect.height / 2, left: rect.right + 12 });
  };
  const hide = () => setPos(null);

  return (
    <div onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {children}
      {enabled &&
        pos &&
        createPortal(
          <span role="tooltip" className="rail-tooltip" style={{ top: pos.top, left: pos.left }}>
            {label}
          </span>,
          document.body,
        )}
    </div>
  );
}

export default RailTooltip;
