import React, { type SVGProps } from 'react';

const PATHS = {
  logo: (
    <>
      <path d="M12 2 L20 7 V17 L12 22 L4 17 V7 Z" fill="currentColor" opacity="0.95" />
      <path d="M8.5 12.5 L11 15 L16 9.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  check: (
    <path d="M5 12 L10 17 L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M8.5 12 L11 14.5 L15.5 9.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  circle: (
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
  ),
  list: (
    <>
      <path d="M8 6 H20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M8 12 H20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M8 18 H20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="4.5" cy="6" r="1" fill="currentColor" />
      <circle cx="4.5" cy="12" r="1" fill="currentColor" />
      <circle cx="4.5" cy="18" r="1" fill="currentColor" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </>
  ),
  trash: (
    <>
      <path d="M5 7 H19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9 7 V5 a1 1 0 0 1 1-1 h4 a1 1 0 0 1 1 1 V7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M7 7 L8 19 a1 1 0 0 0 1 1 h6 a1 1 0 0 0 1-1 L17 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" fill="none" />
      <path d="M16 16 L21 21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </>
  ),
  bell: (
    <>
      <path d="M6 18 V11 a6 6 0 0 1 12 0 V18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M5 18 H19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M10 21 a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" fill="none" />
    </>
  ),
  filter: (
    <>
      <path d="M5 7 H11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M14 7 H19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="12.5" cy="7" r="1.7" stroke="currentColor" strokeWidth="1.7" fill="none" />
      <path d="M5 17 H7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M11 17 H19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="9" cy="17" r="1.7" stroke="currentColor" strokeWidth="1.7" fill="none" />
    </>
  ),
  chevronDown: (
    <path d="M6 9 L12 15 L18 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  chevronLeft: (
    <path d="M14 6 L8 12 L14 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  chevronRight: (
    <path d="M10 6 L16 12 L10 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  plus: (
    <>
      <path d="M12 5 V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 12 H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="6" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <path d="M4 10 H20" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 4 V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M15 4 V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  more: (
    <>
      <circle cx="12" cy="6" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="18" r="1.5" fill="currentColor" />
    </>
  ),
  edit: (
    <>
      <path d="M4 20 L4 16 L16 4 L20 8 L8 20 Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
      <path d="M14 6 L18 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  restore: (
    <>
      <path d="M5 12 a7 7 0 1 1 2.5 5.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" fill="none" />
      <path d="M5 6 V12 H11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  close: (
    <>
      <path d="M6 6 L18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18 6 L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  logout: (
    <>
      <path d="M14 7 V5 a2 2 0 0 0 -2 -2 H6 a2 2 0 0 0 -2 2 V19 a2 2 0 0 0 2 2 H12 a2 2 0 0 0 2 -2 V17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M10 12 H21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M17 8 L21 12 L17 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  quote: (
    <>
      <path d="M7 7 H10 V11 a3 3 0 0 1 -3 3 V11 a4 4 0 0 1 0 -4 Z" fill="currentColor" opacity="0.7" />
      <path d="M14 7 H17 V11 a3 3 0 0 1 -3 3 V11 a4 4 0 0 1 0 -4 Z" fill="currentColor" opacity="0.7" />
    </>
  ),
};

export type IconName = keyof typeof PATHS;

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number | string;
}

export default function Icon({ name, size = 20, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
