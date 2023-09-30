import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/footer/footer';
import Layout from '../../layouts/main-layout/main-layout';
import './not-found.scss';
import Plugs from '../../assets/images/Plugs.svg';

function NotFound() {
  return (
    <>
      <div className="not_found_page_wrp">
        <Layout>
          <div className="flex justify-center not_found_wrp">
            <div className="container">
              <div className="d-block not_found">
                <img src={Plugs} alt="Plugs" />
                <h1>sorry, that page does not exist</h1>
                <p>Head over to our homepage or explore our lisitings</p>
                <div className="not_found_btn">
                  <Link to="/home">Home</Link>
                  <Link to="/explore">Explore</Link>
                </div>
              </div>
            </div>
          </div>
        </Layout>
        <Footer />
      </div>
    </>
  );
}

export { NotFound };
