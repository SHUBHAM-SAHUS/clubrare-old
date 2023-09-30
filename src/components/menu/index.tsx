import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MenuDrawer } from '../menu-drawer';
import { routeMap } from '../../router-map';
import { useToasts } from 'react-toast-notifications';
import { imgConstants } from '../../assets/locales/constants';

function Menu(props: any) {
  const { t } = useTranslation();
  const history = useHistory();
  const { addToast } = useToasts();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const wallet_address = localStorage.getItem("Wallet Address");

  const items = [
    { key: 6, title: 'Home', onClick: () => history.push(routeMap.home) },
    {
      key: 2,
      title: 'Create',
      onClick: () => {
        if (
          props.profileDetails?.role === 'admin' ||
          props.profileDetails?.isSuperAdmin
        ) {
          history.push('/create');
        } else {
          addToast('Coming Soon', { appearance: 'success', autoDismiss: true });
        }
      },
    },
    {
      key: 3,
      title: t('header.notifications'),
      onClick: () => {
        setMenuOpen(false);
        props.handleNotification();
      },
    },
    {
      key: 4,
      title: t('header.liveAuctions'),
      onClick: () => history.push(routeMap.liveAuctions.index),
    },
    { key: 9, title: 'My Items', onClick: () => history.push(`/${wallet_address}`) },
    {
      key: 5,
      title: t('header.explore'),
      onClick: () => history.push(routeMap.explore),
    },
    {
      key: 7,
      title: 'Clubrare Drops',
      onClick: () => history.push(routeMap.clubrareDrops),
    },
  ];

  return (
    <div className="flex justify-center">
      <div
        className="flex items-center space-x-1 cursor-pointer"
        onClick={() => setMenuOpen(true)}
      >
        <img
          style={{ height: '60px' }}
          src={imgConstants.clubrareLogo}
          alt="logo"
        />
        <img className="droparrimg" src={imgConstants.arrowBasic} alt="arrow" />
      </div>
      <MenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        wrapperClass="pt-10"
      >
        <div
          className="flex justify-end mr-8 cursor-pointer"
          onClick={() => setMenuOpen(false)}
        >
          <img src={imgConstants.closeBox} alt="closeBox" />
        </div>
        <div className="absolute top-24 flex flex-col items-center space-y-5 w-full z-10">
          {items.map((i) => (
            <div key={i.key} className="mobilemenulist" onClick={i.onClick}>
              {i.title}
            </div>
          ))}
        </div>
      </MenuDrawer>
      <MenuDrawer
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      ></MenuDrawer>
    </div>
  );
}

export { Menu };
