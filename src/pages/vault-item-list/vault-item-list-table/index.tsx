import React, { memo, useState } from 'react';
import '../../admin-sell-stats-report/admin-sell-stats-report.scss';
import './vaultItemable.scss';
import { Spinner } from '../../../components/spinner';
import { Link } from 'react-router-dom';
import Tooltip from 'react-simple-tooltip';
import { useDispatch } from 'react-redux';
import { EscrowgetdataTypes } from '../../../types/escrow-data-get-types';
import { EscrowStatusUpdateAction } from '../../../redux';
import { EscrowStatusPayload } from '../../../types/escrow-params.types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import copyIcon from '../../../assets/images/Copy.svg';
import { useToasts } from 'react-toast-notifications';
import { GetValutItemListTypes } from '../../../types/vault-item-list';
import moment from 'moment';

interface propsTypes {
  loading: boolean;
  getFilterData: () => void;
  items: any;

  handleItemLocation: any;
}

const EscrowListTable = ({
  loading,
  items,
  getFilterData,

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
          {items?.map((val: GetValutItemListTypes, index: number) => {
            return (
              <tr key={index}>
                <td>
                  <Link
                    to={`item/${val?._id}`}
                    className="hypr_link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {val.collectible_id}
                  </Link>
                </td>
                <td>
                  <Tooltip
                    className="cardtooltip_wrp"
                    content={val?.receiver_wallet_address}
                  >
                    <CopyToClipboard
                      text={val?.receiver_wallet_address?.toString()}
                      onCopy={onCopyText}
                    >
                      <div className="cursor-pointer d-flex">
                        {val?.receiver_wallet_address
                          ? val?.receiver_wallet_address
                              .toString()
                              .substring(0, 4) +
                            '...' +
                            val?.receiver_wallet_address
                              .toString()
                              .substring(
                                val?.receiver_wallet_address.length - 2,
                              )
                          : ''}

                        <img src={copyIcon} alt="copyIcon" />
                      </div>
                    </CopyToClipboard>
                  </Tooltip>
                </td>

                <td>{val?.address}</td>

                <td>{val?.zip_code}</td>

                <td>{val?.city}</td>

                <td>{val.state}</td>

                <td>{val.country}</td>

                <td>{val.email}</td>

                <td>{val.phone_number}</td>

                <td>
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

                <td>
                  {moment(val?.created_on).format('MM/DD/YYYY, hh:mm A')}{' '}
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
    </>
  );
};

export default memo(EscrowListTable);
