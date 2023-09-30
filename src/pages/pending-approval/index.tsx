import { imgConstants } from '../../assets/locales/constants';
import { routeMap } from '../../router-map';
import { Link } from 'react-router-dom';
import Layout from '../../layouts/main-layout/main-layout';
import './pending-approval.scss';

const PendingApproval = () => {
    return (
      <Layout
        mainClassName="create_coll_main_wrp">
        <div className='pending_approval_create_wrp'>
            <div className='container-fluid' >
              <div className='pending_approval_create_inner' >
                <div className='pending_approval_create text-center' >
                  <img src={imgConstants.clock} alt="clock" />
                  <p>Your listing is pending approval. Check back soon to view<br /> the status of your submission.</p>
                  <div className='pending_approval_create_btn_wrp'>
                    <Link to={routeMap.create} className="createnft-pending-btn">Create NFT</Link>
                    <Link to={routeMap.explore}>Explore NFTs</Link>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </Layout>
    )
}

export default PendingApproval