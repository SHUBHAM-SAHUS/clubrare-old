import { useEffect } from 'react';
import Footer from '../../components/footer/footer';
import MainLayout from '../../layouts/main-layout/main-layout';
import { Spinner } from '../../components';
import HubspotForm from 'react-hubspot-form';
import './support.scss';

const Support = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <MainLayout>
        <div className="support_page_wrp">
          <div className="container">
            <h2>Support</h2>
            <HubspotForm
              region="na1"
              css="./support.scss"
              portalId="21961261"
              formId="3f9b212f-04ca-4ee6-b1f0-48c2fac63a0f"
              loading={<Spinner />}
            />
          </div>
        </div>
      </MainLayout>
      <Footer />
    </>
  );
};

export default Support;
