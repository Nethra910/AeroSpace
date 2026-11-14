const glyphs = {
  home: (<><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></>),
  target: (<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></>),
  eye: (<><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>),
  users: (<><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8" /><path d="M18 14.3c2 .8 3.5 2.7 3.5 5.7" /></>),
  briefcase: (<><rect x="3" y="7" width="18" height="13" rx="1.5" /><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /><path d="M3 13h18" /></>),
  building: (<><path d="M4 21V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v17" /><path d="M15 9h4a1 1 0 0 1 1 1v11" /><path d="M3 21h18" /><path d="M8 7h3M8 11h3M8 15h3" /></>),
  flask: (<><path d="M9 3h6" /><path d="M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2.2h12.4a1.5 1.5 0 0 0 1.3-2.2L14 9V3" /><path d="M7.5 15h9" /></>),
  newspaper: (<><path d="M4 5h12v14H5a1 1 0 0 1-1-1V5Z" /><path d="M16 9h4v9a1 1 0 0 1-1 1h-3" /><path d="M7 9h6M7 13h6M7 16h3" /></>),
  fileText: (<><path d="M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7l-4-4Z" /><path d="M14 3v4h4" /><path d="M9 12h6M9 16h6" /></>),
  orbit: (<><circle cx="12" cy="12" r="2.5" /><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(-30 12 12)" /><path d="M4.2 4.4a10 10 0 0 1 3 -1" /></>),
  upload: (<><path d="M12 16V4" /><path d="m7 9 5-5 5 5" /><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></>),
  folder: (<path d="M3 7a1 1 0 0 1 1-1h5l2 2h8a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7Z" />),
  user: (<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" /></>),
  login: (<><path d="M15 3h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4" /><path d="m10 17 5-5-5-5" /><path d="M15 12H3" /></>),
  logout: (<><path d="M9 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></>),
  dashboard: (<><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></>),
  shield: (<><path d="M12 3 4 6v6c0 4.5 3.2 8 8 9 4.8-1 8-4.5 8-9V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></>),
  globe: (<><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" /></>),
  chevronLeft: <path d="m15 6-6 6 6 6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
};

function Icon({ name, className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      {glyphs[name]}
    </svg>
  );
}

export default Icon;
