import { FC } from 'react';

type ClassPropsType = {
  className: string;
};

export const VideoStopIcon: FC<ClassPropsType> = ({ className = '' }) => {
  return (
    <svg
      className={className}
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_10_10)">
        <circle cx="24" cy="24" r="24" fill="white" />
        <path d="M15 34H21V14H15V34ZM27 14V34H33V14H27Z" fill="#303030" />
      </g>
      <defs>
        <clipPath id="clip0_10_10">
          <rect width="48" height="48" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
