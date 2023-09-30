import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useRef } from 'react';

function Modal({
  open,
  title,
  content,
  onCloseModal,
  afterCloseModal = () => {},
  width,
  containerClass,
  contentClass,
}: any) {
  const cancelButtonRef: any = useRef();

  function closeModal() {
    onCloseModal();
    afterCloseModal();
  }

  return (
    <div className="relative">
      <Transition show={open || false} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto reportmodal_wrp"
          initialFocus={cancelButtonRef}
          static
          open={open}
          onClose={closeModal}
        >
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-75" />
          <div className="min-h-screen px-4 text-center add_update_cover_popupwrp">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div
                className={`bg-white inline-block w-full my-8 overflow-hidden
              text-left align-middle transition-all transform shadow-xl updatecover_popupinn ${
                width ? width : 'max-w-570'
              } ${containerClass || 'rounded-2xl'}`}
              >
                <Dialog.Title as="h3" className="addupdatecoverhead">
                  {title}
                </Dialog.Title>
                <div className={contentClass}>{content}</div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
export default Modal;
