import { FC } from 'react';

type ClassPropsType = {
  className: string;
};

export const ActiveToggleIcon: FC<ClassPropsType> = ({ className = '' }) => {
  return (
    <svg
    className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 13.125C12.6213 13.125 13.125 12.6213 13.125 12C13.125 11.3787 12.6213 10.875 12 10.875C11.3787 10.875 10.875 11.3787 10.875 12C10.875 12.6213 11.3787 13.125 12 13.125Z"
        fill="#B2B3B0"
      />
      <path
        d="M12 7.125C12.6213 7.125 13.125 6.62132 13.125 6C13.125 5.37868 12.6213 4.875 12 4.875C11.3787 4.875 10.875 5.37868 10.875 6C10.875 6.62132 11.3787 7.125 12 7.125Z"
        fill="#B2B3B0"
      />
      <path
        d="M12 19.125C12.6213 19.125 13.125 18.6213 13.125 18C13.125 17.3787 12.6213 16.875 12 16.875C11.3787 16.875 10.875 17.3787 10.875 18C10.875 18.6213 11.3787 19.125 12 19.125Z"
        fill="#B2B3B0"
      />
    </svg>
  );
};