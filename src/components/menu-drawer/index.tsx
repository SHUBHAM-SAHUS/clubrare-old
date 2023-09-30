import React from 'react';
import { Drawer } from '../drawer';

function MenuDrawer({
  children,
  open,
  onClose,
  wrapperClass,
  height = 650,
  displayBgShadow = false,
}: any) {
  return (
    <Drawer
      wrapperClass={`relative border border-solid border-white ${wrapperClass}`}
      wrapperStyle={{ height }}
      open={open}
      onClose={onClose}
      placement="top"
    >
      {children}
      {displayBgShadow && <div className=""></div>}
    </Drawer>
  );
}

export { MenuDrawer };
