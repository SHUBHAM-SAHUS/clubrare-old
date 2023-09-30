import React, { memo } from 'react';
import { Helmet } from 'react-helmet';

const Helmentcomponent = (props: any) => {
  const { title, description, itemimage } = props;
  const url = window.location.href;
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        {/* <title>{title}</title> */}
        <link rel="canonical" href={url} />

        {/* For Facebook */}
        <meta property="og:title" content={title}></meta>
        <meta property="og:site_name" content="Clubrare"></meta>
        <meta property="og:url" content={url}></meta>
        <meta property="og:description" content={description}></meta>
        <meta property="og:type" content="website"></meta>
        <meta property="og:image" content={itemimage}></meta>

        {/* For twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@clubrare_nft" />
        <meta name="twitter:creator" content="@clubrare_nft" />
        <meta name="twitter:title" content={title}></meta>
        <meta name="twitter:description" content={description}></meta>
        <meta name="twitter:image" content={itemimage}></meta>
      </Helmet>
    </>
  );
};

export default memo(Helmentcomponent);
