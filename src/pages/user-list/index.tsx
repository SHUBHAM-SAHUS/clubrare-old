import React, { useEffect, useState } from 'react';
import './user-list.css';
import Layout from '../../layouts/main-layout/main-layout';
import { useDispatch } from 'react-redux';
import { getUserListAction, changeRoleAction } from '../../redux';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { EnableEthereum, EnableKlyten } from '../../service/web3-service';
import { Table } from 'react-bootstrap';
import { imgConstants } from '../../assets/locales/constants';

const UserList = () => {
  const [userList, setUserList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page_number, setPageNumber] = useState(1);
  const dispatch = useDispatch();
  const [totalPage, setTotalPage] = useState(1);
  const [isDataNull, setIsDataNull] = useState(false);
  const history = useHistory();
  const { addToast } = useToasts();
  const wallet_address: any = localStorage.getItem('Wallet Address');
  const [chagingRole, setChangingRole] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const ethNetworkId = '1';
  const klyNetworkId = '2';

  const getReportsData = async (search?: any) => {
    if (page_number > totalPage) {
      return;
    }
    const query: any = {
      page_number: page_number,
      page_size: 10,
      network_id:
        localStorage.getItem('networkId') ===
        process.env.REACT_APP_KLATYN_NETWORK_ID
          ? 2
          : 1,
      search: search ? search : '',
    };
    const results: any = await dispatch(getUserListAction(query));
    setLoading(false);
    if (results?.data == null) {
      setIsDataNull(true);
    } else {
      setTotalPage(
        results?.data?.count % 10 == 0
          ? Math.floor(results?.data.count / 10)
          : Math.floor(results?.data.count / 10) + 1,
      );
      setIsDataNull(false);
      setUserList(results?.data.rows);
    }
  };
  useEffect(() => {
    setLoading(true);
    getReportsData();
  }, [page_number]);

  useEffect(() => {
    if (!localStorage.getItem('Wallet Address')) {
      history.push('/home');
    }
  }, []);

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
  const handleSelect = async (e: any, userObject: any) => {
    const role = e.target.value;
    let contract;
    setChangingRole(true);
    let send_obj: any = { from: wallet_address };
    if (
      localStorage.getItem('networkId') ===
      process.env.REACT_APP_KLATYN_NETWORK_ID
    ) {
      if (userObject?.network_id == klyNetworkId) {
        send_obj = { from: wallet_address, gas: null };
        const { brokerValidatorContract }: any = await EnableKlyten();
        contract = { ...brokerValidatorContract };
      } else {
        setChangingRole(false);
        addToast('Login with ETH network, to change role of this user', {
          appearance: 'success',
          autoDismiss: true,
        });
        return;
      }
    } else {
      if (userObject?.network_id == ethNetworkId) {
        const { brokerValidatorContract }: any = await EnableEthereum();
        contract = { ...brokerValidatorContract };
      } else {
        setChangingRole(false);
        addToast('Login with Klaytn network, to change role of this user', {
          appearance: 'success',
          autoDismiss: true,
        });
        return;
      }
    }
    if (role === 'admin') {
      const res: any = await contract.methods
        .addAdmin(userObject?.wallet_address)
        .send(send_obj);
      if (res.blockHash) {
        updateRoleAPI(role, userObject);
      }
    } else {
      const res: any = await contract.methods
        .removeAdmin(userObject?.wallet_address)
        .send(send_obj);
      if (res.blockHash) {
        updateRoleAPI(role, userObject);
      }
    }
  };

  const updateRoleAPI = async (role: string, userObject: any) => {
    const object = {
      _id: userObject._id,
      role: role,
    };
    try {
      const result: any = await dispatch(changeRoleAction(object));
      setChangingRole(false);
      addToast(result.data.message, {
        appearance: 'success',
        autoDismiss: true,
      });
      getReportsData();
    } catch (err) {
      setChangingRole(false);
    }
  };

  const onInputSearch = (e: any) => {
    if (e.key === 'Enter') {
      getReportsData(e.target.value);
    }
  };

  const onChangeSearchVal = (e: any) => {
    setSearchValue(e.target.value);
  };

  return (
    <>
      <Layout loading={loading}>
        {userList.length > 0 ? (
          <div className="container user_list_sec">
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
                  <th>Profile</th>
                  <th>Name</th>
                  <th>Wallet Address</th>
                  <th>Status</th>
                  <th>URL</th>
                  <th>Change Role</th>
                </tr>
              </thead>
              <tbody>
                {userList?.length > 0 &&
                  userList.map((userToObj, i) => {
                    return (
                      <tr>
                        <td>
                          <figure>
                            {' '}
                            <img
                              className="profile_img"
                              src={
                                userToObj.image
                                  ? userToObj.image
                                  : imgConstants.avatar_1
                              }
                              alt="avater"
                              height="29px"
                            />
                          </figure>
                        </td>
                        <td>{userToObj.name ? userToObj.name : 'NA'}</td>
                        <td>
                          {userToObj.wallet_address
                            ? userToObj.wallet_address
                            : 'NA'}
                        </td>
                        <td>{userToObj.status ? userToObj.status : 'NA'}</td>
                        <td>{userToObj.url ? userToObj.url : 'NA'}</td>

                        <td>
                          <select
                            name="ethereumopt"
                            id="ethereumopt"
                            value={userToObj.role}
                            onChange={(e) => handleSelect(e, userToObj)}
                            disabled={chagingRole}
                          >
                            <option value={'admin'}>Admin</option>
                            <option value={'user'}>User</option>
                          </select>
                        </td>
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
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            {' '}
            <h2> No items </h2>
          </div>
        )}
      </Layout>
    </>
  );
};
export default UserList;
