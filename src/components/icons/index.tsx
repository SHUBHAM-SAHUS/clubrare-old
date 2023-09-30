import React from 'react';

const CryptoIcon = ({ fill, size }: any) => (
  <svg
    width={size || '11'}
    height={size || '17'}
    viewBox="0 0 11 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0)">
      <path
        opacity="0.6"
        d="M5.49803 0L5.37793 0.38729V11.6256L5.49803 11.7393L10.9964 8.65573L5.49803 0Z"
        fill={fill || '#1B3142'}
      />
      <path
        opacity="0.2"
        d="M5.49837 0L0 8.65573L5.49837 11.7393V6.28462V0Z"
        fill={fill || '#1B3142'}
      />
      <path
        opacity="0.8"
        d="M5.49834 12.727L5.43066 12.8053V16.8086L5.49834 16.9962L11 9.64502L5.49834 12.727Z"
        fill={fill || '#1B3142'}
      />
      <path
        opacity="0.2"
        d="M5.49837 16.9961V12.7269L0 9.6449L5.49837 16.9961Z"
        fill={fill || '#1B3142'}
      />
      <path
        d="M5.49805 11.7393L10.9963 8.65578L5.49805 6.28467V11.7393Z"
        fill={fill || '#1B3142'}
      />
      <path
        opacity="0.6"
        d="M0 8.65578L5.49828 11.7393V6.28467L0 8.65578Z"
        fill={fill || '#1B3142'}
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect width="11" height="17" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
const CryptoIcon3 = ({ fill }: any) => (
  <svg
    width="20"
    height="24"
    viewBox="0 0 31 31"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.0625 15.0765L26.5158 25.4958C29.0823 22.7762 30.6461 19.1048 30.6461 15.0765C30.6461 11.0482 29.0823 7.37677 26.5158 4.65723L16.0625 15.0765Z"
      fill="#574A3B"
    />
    <path
      d="M15.3314 15.7904L5.01416 26.0737L15.3314 30.323L25.6487 26.0737L15.3314 15.7904Z"
      fill="#574A3B"
    />
    <path
      d="M14.9573 14.7025L25.6485 4.06232L15.8072 0L5.96582 23.677L14.9573 14.7025Z"
      fill="#574A3B"
    />
    <path
      d="M0 15.0765C0 19.0878 1.56374 22.7422 4.09632 25.4618L14.3626 0.764893L0 15.0765Z"
      fill="#574A3B"
    />
  </svg>
);

const AGOVICON = ({ fill }: any) => (
  <svg width="20" height="24" viewBox="0 0 250 250">
    <defs>
      <linearGradient
        id="linear-gradient"
        x1="0.111"
        y1="0.186"
        x2="0.887"
        y2="0.815"
        gradientUnits="objectBoundingBox"
      >
        <stop offset="0" stopColor="#0fb2f0" />
        <stop offset="1" stopColor="#f414b4" />
      </linearGradient>
      <clipPath id="clip-Agov_logo">
        <rect width="250" height="250" />
      </clipPath>
    </defs>
    <g id="Agov_logo" data-name="Agov logo" clipPath="url(#clip-Agov_logo)">
      <g
        id="Group_82"
        data-name="Group 82"
        transform="translate(-36.273 -159.937)"
      >
        <g
          id="Group_81"
          data-name="Group 81"
          transform="translate(39.273 162.936)"
        >
          <path
            id="Path_14903"
            data-name="Path 14903"
            d="M282.807,284.362c-1.424,67.786-53.786,121.7-121.784,121.773C92.4,406.21,39.8,351.409,39.277,284.518c-.522-66.53,55.171-122.1,121.816-121.578C228.818,163.467,281.3,217.089,282.807,284.362ZM156.263,208.207c-16.089.5-33.979,7.711-48.478,23.209-12.052,12.881-18.626,28.153-19.3,45.466-1.606,41.048,27.136,73.015,68.079,76.446,3.392.285,4.737,1.455,4.673,4.864-.137,7.391-.058,14.786-.014,22.179.032,5.321.313,5.492,5.4,3.831a90.206,90.206,0,0,0,60.119-68.168c1.087-5.632.906-5.685-5.013-5.691-17.933-.02-35.866-.1-53.8.025-3.866.026-5.3-1.323-5.246-5.21.158-12.425.054-24.853.067-37.281.008-6.88.022-6.9,6.742-6.91,18.719-.02,37.439,0,56.158-.041,5.086-.012,5.317-.416,3.59-5.076C218.475,226.779,191.932,208.224,156.263,208.207Z"
            transform="translate(-39.273 -162.936)"
            fill="url(#linear-gradient)"
          />
        </g>
      </g>
    </g>
  </svg>
);

const CryptoIcon2 = ({ fill }: any) => (
  <svg
    width="14"
    height="24"
    viewBox="0 0 14 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.7">
      <path
        d="M6.9977 0L6.84485 0.531561V15.9562L6.9977 16.1124L13.9954 11.8801L6.9977 0Z"
        fill={fill || '#377CF6'}
      />
      <path
        d="M6.99775 0L0 11.8801L6.99775 16.1124V8.62573V0Z"
        fill={fill || '#377CF6'}
      />
      <path
        d="M6.998 17.4678L6.91187 17.5752V23.0698L6.998 23.3272L14 13.2377L6.998 17.4678Z"
        fill={fill || '#377CF6'}
      />
      <path
        d="M6.99775 23.3273V17.4678L0 13.2377L6.99775 23.3273Z"
        fill={fill || '#377CF6'}
      />
      <path
        d="M6.99829 16.1124L13.9959 11.8802L6.99829 8.62579V16.1124Z"
        fill={fill || '#377CF6'}
      />
      <path
        d="M0 11.8802L6.99764 16.1124V8.62579L0 11.8802Z"
        fill={fill || '#377CF6'}
      />
    </g>
  </svg>
);
const WethIcon = ({ fill }: any) => (
  <svg
    width="10"
    height="15"
    viewBox="0 0 10 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.692383 7.37637L4.99922 9.92086V0.230469L0.692383 7.37637Z"
      fill="#4C4D4C"
    />
    <path
      d="M4.99951 0.230469V9.92086L9.30466 7.37637L4.99951 0.230469Z"
      fill="#E94A4B"
    />
    <path
      d="M0.692383 8.19238L4.99922 14.2599V10.7369L0.692383 8.19238Z"
      fill="#4C4D4C"
    />
    <path
      d="M4.99951 10.7369V14.2599L9.30804 8.19238L4.99951 10.7369Z"
      fill="#E94A4B"
    />
  </svg>
);

const Arrow = ({ stroke }: any) => (
  <svg
    width="36"
    height="21"
    viewBox="0 0 36 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.4002 10.2122H1.50024"
      stroke={stroke || 'white'}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M34.7079 10.2004C34.7079 7.68839 21.9799 -0.341614 20.5359 1.10239C19.0919 2.54639 18.9539 17.7164 20.5359 19.2984C22.1199 20.8804 34.7079 12.7104 34.7079 10.2004Z"
      stroke={stroke || 'white'}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UsdtIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="384px" height="384px"><path d="M 12 1 C 5.935 1 1 5.935 1 12 C 1 18.065 5.935 23 12 23 C 18.065 23 23 18.065 23 12 C 23 5.935 18.065 1 12 1 z M 12 3 C 16.963 3 21 7.038 21 12 C 21 16.963 16.963 21 12 21 C 7.038 21 3 16.963 3 12 C 3 7.038 7.038 3 12 3 z M 7 7 L 7 9 L 11 9 L 11 10.048828 C 8.7935403 10.157378 6 10.631324 6 12 C 6 13.368676 8.7935403 13.842622 11 13.951172 L 11 18 L 13 18 L 13 13.951172 C 15.20646 13.842622 18 13.368676 18 12 C 18 10.631324 15.20646 10.157378 13 10.048828 L 13 9 L 17 9 L 17 7 L 7 7 z M 11 11.027344 L 11 12 L 13 12 L 13 11.027344 C 15.42179 11.151768 16.880168 11.700988 17.003906 11.978516 C 16.863906 12.334516 15.021 13 12 13 C 8.978 13 7.1360937 12.335484 6.9960938 12.021484 C 7.1198324 11.706835 8.5777007 11.152269 11 11.027344 z"/></svg>
)

export { Arrow, CryptoIcon2, CryptoIcon, CryptoIcon3, AGOVICON, WethIcon, UsdtIcon };
