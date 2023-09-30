import moment from 'moment';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import seller_varified from '../../../assets/images/varified_seller_1.svg';
import { imgConstants } from '../../../assets/locales/constants';

const CreatedBy = () => {
  const itemDetails = useSelector(
    (state: any) => state.itemDetailsReducer.details,
  );
  const history = useHistory();
  const goToProfile = () => {
    if (itemDetails?.userObj?.wallet_address) {
      history.push(`/${itemDetails?.userObj?.wallet_address}`);
    }
  };
  return (
    <div className="row description_row">
      <div className="col-8 description_lft_wrp">
        <div className="description_inn d-flex" onClick={goToProfile}>
          <div className="img_wrp">
            <figure>
              <img
                width="55"
                src={itemDetails?.userObj?.image || imgConstants.avatar}
                alt="img"
              ></img>
            </figure>
          </div>
          <div className="creator_address_time text_wrp align-center w-100">
            <p className="creator_name">
              {' '}
              CREATED BY <br />
              <span style={{ color: 'rgb(32, 129, 226)', cursor: 'pointer' }}>
                {itemDetails?.userObj?.name
                  ? itemDetails?.userObj?.name
                  : itemDetails?.userObj?.wallet_address
                  ? itemDetails?.userObj?.wallet_address
                      .toString()
                      .substring(0, 10) +
                    '...' +
                    itemDetails?.userObj?.wallet_address
                      .toString()
                      .substring(
                        itemDetails?.userObj?.wallet_address.length - 8,
                      )
                  : ''}
              </span>
            </p>
            <p className=" creator_time text_bold">
              {moment(itemDetails?.created_on).format(' Do MMMM YYYY')}
            </p>
          </div>
        </div>
      </div>
      {itemDetails?.item_authenticated && (
        <div className=" col-4 varified_seller_btn_wrp text-right">
          <button className="varified_seller_btn" type="button">
            <img src={seller_varified} alt="seller-varified" />
            Authenticated
          </button>
        </div>
      )}
    </div>
  );
};

export default CreatedBy;
