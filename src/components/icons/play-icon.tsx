import { FC } from 'react'

type ClassPropsType={
    className:string
}

export const VideoPLayIcon: FC<ClassPropsType> = ({ className = ''}) => {
    return (
        <svg
        className={className}
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_10_5)">
          <circle cx="24" cy="24" r="24" fill="white" />
          <path d="M18 14V34L33 24L18 14Z" fill="#303030" />
        </g>
        <defs>
          <clipPath id="clip0_10_5">
            <rect width="48" height="48" fill="white" />
          </clipPath>
        </defs>
      </svg>
    )
  }