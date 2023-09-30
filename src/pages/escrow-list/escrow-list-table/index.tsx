import React, { memo, useState } from 'react';
import '../../admin-sell-stats-report/admin-sell-stats-report.scss';
import './escrowtable.scss';
import { Spinner } from '../../../components/spinner';
import { Link } from 'react-router-dom';
import Tooltip from 'react-simple-tooltip';
import { useDispatch } from 'react-redux';
import AddressDetailsModel from '../models/address-details-model';
import { EscrowgetdataTypes } from '../../../types/escrow-data-get-types';
import { EscrowStatusUpdateAction } from '../../../redux';
import { EscrowStatusPayload } from '../../../types/escrow-params.types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import copyIcon from '../../../assets/images/Copy.svg';
import { useToasts } from 'react-toast-notifications';
import moment from 'moment';

interface propsTypes {
  loading: boolean;
  getFilterData: () => void;
  items: any;
  handleEscrow: any;
  handleItemLocation: any;
}

const EscrowListTable = ({
  loading,
  items,
  getFilterData,
  handleEscrow,
  handleItemLocation,
}: propsTypes) => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  const [IsEditModel, SetEditModel] = useState<boolean>(false);
  const [querydata, Setquerydata] = useState<any>();

  const handleCloseMdal = () => {
    SetEditModel(false);
  };

  const onCopyText = () => {
    addToast('Address Copied Successfully', {
      appearance: 'success',
      autoDismiss: true,
    });
  };

  const getItemDetailsForModel = (data: EscrowgetdataTypes) => {
    Setquerydata(data);
    SetEditModel(true);
  };

  const handleEscrowStatus = async (
    event: React.ChangeEvent<HTMLSelectElement>,
    id: any,
  ) => {
    const EscrowStatusPayload: EscrowStatusPayload = {
      id: id,
      order_status: event.target.value,
    };

    const result: any = await dispatch(
      EscrowStatusUpdateAction(EscrowStatusPayload),
    );
    if (result?.status) {
      await getFilterData();
    }
  };

  return (
    <>
      {items && items?.length > 0 ? (
        <tbody>
          {items?.map((val: EscrowgetdataTypes, index: number) => {
            return (
              <tr key={index}>
                <td style={{ width: '10%' }}>
                  {moment(new Date(val.created_on)).format('D MMM YYYY HH:MM')}
                </td>
                <td style={{ width: '10%' }}>
                  <Link
                    to={`item/${val?._id}`}
                    className="hypr_link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {val.collectible_id}
                  </Link>
                </td>
                <td style={{ width: '10%' }}>
                  {val?.escrow_id ? (
                    <Tooltip
                      className="cardtooltip_wrp"
                      content={val?.escrow_id}
                    >
                      {val?.escrow_id}
                    </Tooltip>
                  ) : (
                    '-'
                  )}
                </td>

                <td style={{ width: '10%' }}>
                  {' '}
                  <Tooltip
                    className="cardtooltip_wrp"
                    content={val?.seller_wallet_address}
                  >
                    <CopyToClipboard
                      text={val?.seller_wallet_address?.toString()}
                      onCopy={onCopyText}
                    >
                      <div className="cursor-pointer d-flex">
                        {val?.seller_wallet_address
                          ? val?.seller_wallet_address
                              .toString()
                              .substring(0, 4) +
                            '...' +
                            val?.seller_wallet_address
                              .toString()
                              .substring(val?.seller_wallet_address.length - 2)
                          : ''}

                        <img src={copyIcon} alt="copyIcon" />
                      </div>
                    </CopyToClipboard>
                  </Tooltip>
                </td>

                <td style={{ width: '10%' }}>
                  <Tooltip
                    // className="cardtooltip_wrp"
                    content={val?.buyer_wallet_address}
                  >
                    <CopyToClipboard
                      text={val?.buyer_wallet_address?.toString()}
                      onCopy={onCopyText}
                      className="d-flex"
                    >
                      <div className="cursor-pointer d-flex">
                        {val?.buyer_wallet_address
                          ? val?.buyer_wallet_address
                              .toString()
                              .substring(0, 4) +
                            '...' +
                            val?.buyer_wallet_address
                              .toString()
                              .substring(val?.buyer_wallet_address.length - 2)
                          : ''}

                        <img src={copyIcon} alt="copyIcon" />
                      </div>
                    </CopyToClipboard>
                  </Tooltip>
                </td>

                <td style={{ width: '10%' }}>{val?.delivery_type}</td>

                <td style={{ width: '10%' }}>
                  <select
                    name=""
                    id=""
                    value={val?.order_status}
                    onChange={(event) => handleEscrowStatus(event, val?._id)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="delivered">Delivered</option>
                    <option value="dispatched">Dispatched</option>
                  </select>
                </td>

                <td style={{ width: '10%' }}>{val.escrow_status}</td>

                <td style={{ width: '10%' }}>
                  {val?.delivery_type !== 'vault' && (
                    <button
                      className="item_edit font-bold cursor-pointer"
                      onClick={() => getItemDetailsForModel(val)}
                    >
                      &#128065;
                    </button>
                  )}
                </td>

                <td style={{ width: '10%' }}>
                  {val?.delivery_type === 'vault' &&
                    val?.dbCollectible?.item_current_location === 'seller' && (
                      <div>
                        <button
                          className="action_btn"
                          onClick={() =>
                            handleItemLocation(val?.collectible_id, val?._id)
                          }
                        >
                          Mark as Item Received at Vault
                        </button>
                      </div>
                    )}
                  {val?.escrow_id &&
                    val?.escrow_status === 'escrow_created' &&
                    (val?.delivery_type === 'address' ||
                      (val?.delivery_type === 'vault' &&
                        val?.dbCollectible?.item_current_location ===
                          'vault')) && (
                      <div>
                        <button
                          className="action_btn"
                          onClick={() => handleEscrow(val?.escrow_id, true)}
                        >
                          Returned
                        </button>

                        <button
                          className="action_btn mt-1"
                          onClick={() => handleEscrow(val?.escrow_id, false)}
                        >
                          Released
                        </button>
                      </div>
                    )}
                </td>
              </tr>
            );
          })}
        </tbody>
      ) : (
        <tbody className="redeem_notfound_wrp ">
          {!loading ? (
            <p className="Data_not_found"> No Items Available</p>
          ) : (
            <div className="spinner-style-table-redeem">
              <Spinner />
            </div>
          )}
        </tbody>
      )}

      <AddressDetailsModel
        show={IsEditModel}
        onCloseModal={handleCloseMdal}
        onHide={() => SetEditModel(false)}
        details={querydata}
        getFilterData={getFilterData}
      />
    </>
  );
};

export default memo(EscrowListTable);
