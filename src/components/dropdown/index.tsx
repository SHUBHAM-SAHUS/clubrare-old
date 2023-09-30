import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';

function Dropdownn({
  selected,
  onSelect,
  width = 'w-56',
  title,
  items,
  menuButtonWrapperClass,
  menuButtonClass,
  menuItemsClass,
  menuItemClass,
  selectedItemClass,
  unselectedItemClass,
  displaySelected,
  displayChevronDown = true,
}: any) {
  return (
    <div className={`relative text-center z-10 ${width}`}>
      <Menu as="div" className=" inline-block text-left w-full">
        {({ open }) => (
          <>
            <div
              className={`absolute right-0 left-0 z-30 ${
                menuButtonWrapperClass || 'top-0'
              }`}
            >
              <Menu.Button
                className={`inline-flex items-center w-full reportimgbtn
                focus:outline-none ${
                  menuButtonClass || 'justify-center px-4 py-2'
                }`}
              >
                <div>
                  {displaySelected && selected?.name ? selected?.name : title}
                </div>
                {displayChevronDown && (
                  <ChevronDownIcon
                    className="w-6 h-6 ml-2 -mr-1"
                    aria-hidden="true"
                  />
                )}
              </Menu.Button>
            </div>
            <Transition
              show={open}
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                static
                className={`absolute focus:outline-none profile_popup_wrp ${
                  menuItemsClass || '-right-8 w-56 mt-10 rounded-md'
                }`}
              >
                {items.map((i: any) => (
                  <div key={i?.key} className="w-full">
                    <Menu.Item>
                      {({ active }) => (
                        <button className="balance_btn_wrp" onClick={() => {}}>
                          {i.name}
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                ))}
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
}

export { Dropdownn };
