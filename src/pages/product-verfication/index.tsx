import React, { useEffect, useState } from 'react';
import Layout from '../../layouts/main-layout/main-layout';
import { useDispatch, useSelector } from 'react-redux';
import {
  getRedeemableListAction,
  updateCollectibleAction,
  getEditProfileAction,
} from '../../redux';
import './product-verification.css';
import { useHistory } from 'react-router-dom';
import { routeMap } from '../../router-map';
import { imgConstants } from '../../assets/locales/constants';

const ProductVerification = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const redeemables: any = useSelector(
    (state: any) => state.redeemableReducer.redeemableList,
  );
  const [selectedRedeemable, setSelectedRedeemable] = useState<any>({});
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const [page_number, setPageNumber] = useState(1);
  const history = useHistory();
  const network_id = localStorage.getItem('networkId');
  const klatynNetworkId = process.env.REACT_APP_KLATYN_NETWORK_ID;

  const getList = async () => {
    const query: any = {
      page_number: page_number,
      page_size: 20,
    };
    await dispatch(getRedeemableListAction(query));
    setLoading(false);
  };

  useEffect(() => {
    if (!localStorage.getItem('Wallet Address')) {
      history.push(routeMap.home);
    } else {
      getProfileDetails(localStorage.getItem('Wallet Address'));
    }
  }, []);

  const getProfileDetails = async (add: any) => {
    const data = { user_address: add };
    let res: any = await dispatch(getEditProfileAction(data));
    if (res?.data?.role !== 'admin' && !res?.data?.isSuperAdmin) {
      history.push(routeMap.home);
    } else {
      getList();
    }
  };

  const openVerificationModal = (item: any) => {
    setSelectedRedeemable(item);
    setShowVerificationModal(true);
  };

  const closeVerificationModal = () => {
    setShowVerificationModal(false);
  };

  const verifyRedeemable = async (data: any) => {
    const { _id, collection_address } = data;
    closeVerificationModal();
    const body = {
      _id: _id,
      collection_address: collection_address,
      page_number: page_number,
      page_size: 8,
      network_id: network_id == klatynNetworkId ? 2 : 1,
      redeem_verified: true,
    };
    await dispatch(updateCollectibleAction(body));
    getList();
  };

  return (
    <>
      {showVerificationModal && (
        <VerificationModal
          verifyRedeemable={verifyRedeemable}
          selectedRedeemable={selectedRedeemable}
          closeModal={closeVerificationModal}
        />
      )}
      <Layout
        mainClassName="redeem_list_cmn_wrp redeem_verif_page_wrp"
        loading={loading}
      >
        <div className="container-fluid">
          <div className="user_list_sec">
            {!loading && (
              <table className="table-fixed user_list_tabel">
                <thead>
                  <tr>
                    <th scope="col">S.No.</th>
                    <th scope="col">Profile</th>
                    <th scope="col">Name</th>
                    <th scope="col">Title</th>
                    <th scope="col">Royalties</th>
                    <th scope="col">Status</th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {redeemables?.map((item: any, i: number) => {
                    return (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>
                          <figure>
                            {' '}
                            <img
                              className="profile_img"
                              src={item.image || imgConstants.avatar_1}
                              alt="collectible"
                              height="29px"
                            />
                          </figure>
                        </td>
                        <td>
                          {item?.userObj?.name || item?.userObj?.wallet_address}
                        </td>
                        <td>{item.title}</td>
                        <td>{item.royalties}</td>
                        <td>{item.redeem_verified ? 'Verified' : 'Pending'}</td>
                        <td className="verify_btn_wrp">
                          {!item.redeem_verified ? (
                            <button
                              type="button"
                              className="verify-button"
                              onClick={() => openVerificationModal(item)}
                            >
                              Verify
                            </button>
                          ) : (
                            ''
                          )}
                        </td>
                        <td></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};
export default ProductVerification;

const VerificationModal = (props: any) => {
  const { verifyRedeemable, selectedRedeemable } = props;
  return (
    <div
      className="verification-modal"
      style={{
        display: 'flex',
        width: '100%',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000b0',
        position: 'fixed',
        zIndex: 99999,
      }}
    >
      <div
        className="redeem-modal-inner"
        style={{
          width: '35%',
          backgroundColor: 'white',
          minWidth: '300px',
          position: 'relative',
        }}
      >
        <div className="text-center">
          <h2 className="text-center">Verify Product</h2>
          <div className="modal-content text-center border-none">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries,
          </div>
          <button
            className="button-black"
            onClick={() => verifyRedeemable(selectedRedeemable)}
          >
            Yes, I Understand
          </button>
          <button
            className="btnbtn_blck ml-2 py-2"
            onClick={() => props.closeModal('close')}
          >
            {' '}
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
