import React from 'react';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { routeMap } from '../../router-map';
import { imgConstants } from '../../assets/locales/constants';

function Sidebar({ displaySidebar }: any) {
  const { pathname } = useLocation();
  const { collectible_id }: any = useParams();
  const history = useHistory();
  const { t } = useTranslation();

  const navItems = [
    {
      key: 1,
      title: t('sidebar.home.title'),
      alt: t('sidebar.home.alt'),
      icon: imgConstants.icon,
      iconColorful: imgConstants.iconColorful,
      href: routeMap.home,
      relatedRoutes: [
        routeMap.home,
        `${
          routeMap.liveAuctions.view(collectible_id).split(':')[0]
        }${collectible_id}`,
      ],
    },
    {
      key: 2,
      title: t('sidebar.myItems.title'),
      alt: t('sidebar.myItems.alt'),
      icon: imgConstants.iconUser,
      iconColorful: imgConstants.iconColorfulUser,
      href: routeMap.profile.index,
      relatedRoutes: [
        routeMap.profile.index,
        routeMap.profile.edit,
        routeMap.profile.upvote,
      ],
    },
    {
      key: 3,
      title: t('sidebar.create.title'),
      alt: t('sidebar.create.alt'),
      icon: imgConstants.iconCreate,
      iconColorful: imgConstants.iconColorfulCreate,
      href: routeMap.create,
      relatedRoutes: [routeMap.create],
    },
  ];

  return (
    <aside className="relative">
      <div
        className={
          displaySidebar ? 'hidden lg:flex lg:flex-col lg:space-y-16' : 'hidden'
        }
      >
        {navItems?.map((n) => (
          <div className='relative cursor-pointer' key={n.key} onClick={() => history.push((n.href).toString())}>
            <div
              className={`flex flex-col items-center text-center border border-solid border-transparent p-2 ${
                n.relatedRoutes.includes(pathname)
                  ? 'border-white rounded-12'
                  : ''
              }`}
            >
              <img
                src={
                  n.relatedRoutes.includes(pathname) ? n.iconColorful : n.icon
                }
                alt={n.alt}
              />
              <div
                className={`text-18 font-semibold mt-4 ${
                  n.relatedRoutes.includes(pathname)
                    ? 'text-white'
                    : 'text-gray'
                }`}
              >
                {n.title}
              </div>
            </div>
            <div
              className={
                n.relatedRoutes.includes(pathname) ? 'radialGradient' : ''
              }
            />
          </div>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
