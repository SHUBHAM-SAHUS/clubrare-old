import React, { useEffect, useState } from 'react';
import './authentication-lists.scss';
import Layout from '../../layouts/main-layout/main-layout';
import { useDispatch } from 'react-redux';
import {  authenticationPurchaseListsAction, getEditProfileAction } from '../../redux';
import { useHistory } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import { imgConstants } from '../../assets/locales/constants';
import AddAuthenticationModal from './authentication-modal';
import { AuthenticationListsObject, AuthenticationListsRequest } from '../../types/authentication-lists-type';

const AuthenticationLists = () => {
  const [authenticationList, setAuthenticationList] = useState<AuthenticationListsObject[]>([]);
  const [openAddAuthModal, setOpenAddAuthModal] = useState<boolean>(false)
  const [loading, setLoading] = useState(false);
  const [page_number, setPageNumber] = useState(1);
  const dispatch = useDispatch();
  const [totalPage, setTotalPage] = useState(1);
  const [isDataNull, setIsDataNull] = useState(false);
  const history = useHistory();
  const [searchValue, setSearchValue] = useState('');
  
  const getLists = async (search?: string) => {
    if (page_number > totalPage) {
      return;
    }
    const query: AuthenticationListsRequest = {
      page_number: page_number,
      page_size: 10,      
      search: search ? search : '',
    };
    const results:any = await dispatch(authenticationPurchaseListsAction(query));
    setLoading(false);
    if (results?.data?.count == 0) {
      setIsDataNull(true);
    } else {
      setTotalPage(
        results?.data?.count % 10 == 0
          ? Math.floor(results?.data.count / 10)
          : Math.floor(results?.data.count / 10) + 1,
      );
      setIsDataNull(false);
      setAuthenticationList(results?.data.rows);
    }
  };
  useEffect(() => {
    setLoading(true);
    getLists();
  }, [page_number]);

  useEffect(() => {
    if (!localStorage.getItem('Wallet Address')) {
      history.push('/home');
    } else {
      getProfileDetails(localStorage.getItem('Wallet Address') as string);
    }
  }, []);

  const getProfileDetails = async (add: string) => {
    const data = { user_address: add };
    let res: any = await dispatch(getEditProfileAction(data));
    if (res?.data?.role !== 'admin' && !res?.data?.isSuperAdmin) {
      history.push('/home');
    }
  };

  const previousBtnClick = () => {
    if (page_number > 1) {
      setPageNumber(page_number - 1);
    }
  };

  const nextBtnClick = () => {
    if (!isDataNull) {
      setPageNumber(page_number + 1);
    }
  };
    
  const onInputSearch = (e: any) => {
    if (e.key === 'Enter') {
      getLists(e.target.value);
    }
  };

  const onChangeSearchVal = (e: any) => {
    setSearchValue(e.target.value);
  };

  const hideAddAuthenticationModal = () => {
    setOpenAddAuthModal(false)
  }

  return (
    <>
      <Layout loading={loading}>
          <div className="container user_list_sec">
            <div className='col-sm-12 text-right'><button type="button" className="addAuthenticationBtn" onClick={() => {setOpenAddAuthModal(true)}}>Add</button></div>
        {authenticationList.length > 0 ? (
          <>
            <div className="search-box">              
              <img
                className=""
                src={imgConstants.black_search}
                alt="black_search"
              />
              <input
                type="text"
                className="backgroup-trans
                    pl-12 pr-6 py-2"
                placeholder={'search'}
                onKeyDown={onInputSearch}
                value={searchValue}
                onChange={onChangeSearchVal}
              />
                          
            </div>
            <Table responsive className="user_list_tabel">
              <thead>
                <tr>                      
                  <th>Wallet Address</th>
                  <th>Total Purchased</th>
                  <th>Remaining Item</th>
                </tr>
              </thead>
              <tbody>
                {authenticationList?.length > 0 &&
                  authenticationList.map((userToObj, i) => {
                    return (
                      <tr>
                        <td>{userToObj._id}</td>
                        <td>
                          {userToObj.total_purchased}
                        </td>
                        <td>{userToObj.total_purchased - userToObj.totalItem}</td>                        
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
            <div className="button-container">
              <span>
                Showing page {page_number} of {totalPage}
              </span>
              <button
                className="pagi-btn"
                disabled={page_number === 1}
                onClick={previousBtnClick}
              >
                Back
              </button>
              <button
                className="pagi-btn"
                disabled={page_number == totalPage}
                onClick={nextBtnClick}
              >
                Next
              </button>
            </div>
            </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            {' '}
            <h2> No items </h2>
          </div>
        )}
        </div>
      </Layout>
      <AddAuthenticationModal
      show={openAddAuthModal}
      onHide={hideAddAuthenticationModal}
      getLists={getLists}
       />
    </>
  );
};
export default AuthenticationLists;
