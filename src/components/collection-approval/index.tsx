import React, { useEffect, useState } from 'react';
import './collection_approval.scss';
import checkbox from './../../assets/images/right_tick.svg';
import { Dropdown } from 'react-bootstrap';
import { Spinner } from '../spinner';
import { useTranslation } from 'react-i18next';

const CollectionApproval = (props: any) => {
  const { t } = useTranslation();
  const [allCollections, setAllCollections] = useState<any>([]);

  useEffect(() => {
    if (props.collectionModel) {
      setAllCollections(props.collectionModel);
    }
  }, [props.collectionModel]);
  const selectCollection = (e: any, collection: any, index: any) => {
    const { checked } = e.target;
    allCollections.forEach((collectionobj: any) => {
      if (collectionobj._id == collection._id) {
        collectionobj.isChecked = checked;
      }
    });
    props.handleCollections(e, collection, index);
  };

  const setSearched = () => {
    const searchValue = (
      document.getElementById('searchInput') as HTMLInputElement
    ).value;
    if (searchValue) {
      if (allCollections && allCollections.length > 0) {
        const filterList = allCollections.filter((x: any) =>
          x.displayName.toLowerCase().includes(searchValue.toLowerCase()),
        );
        setAllCollections(filterList);
      }
    } else {
      setAllCollections(props.collectionModel);
    }
  };

  return (
    <React.Fragment>
      <div className="collection_approval_wrp">
        <div className="collection_approval_header_wrp">
          <h1>
            {t('collection-approval.Collection')}{' '}
            <span>{t('collection-approval.Approval')}</span>
          </h1>
          <div className="club_head_tabs_wrp approval_filter_wrp_responsive">
            <Dropdown>
              <Dropdown.Toggle>{props.collectionType}</Dropdown.Toggle>

              <Dropdown.Menu className="club_expl_fil_dropdown">
                <div>
                  <div className="options dropdownOptWrp">
                    <Dropdown.Item>
                      <div className="options dropdownOpt mt-1 hvr_clr py-2 ">
                        <div className="club_head_tab aaaa">
                          <input type="radio" />
                          <label
                            className="aaaa"
                            htmlFor="Fixed Price"
                            onClick={() =>
                              props.handleCollectionType('OpenSea')
                            }
                          >
                            {t('collection-approval.OpenSea')}
                          </label>
                        </div>
                      </div>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <div className="options dropdownOpt mt-1 hvr_clr py-2 ">
                        <div className="club_head_tab">
                          <input
                            type="radio"
                            id="Time_Auction"
                            value="timed_auction"
                            name="sale_type"
                          />
                          <label
                            className="aaaa"
                            htmlFor="Time_Auction"
                            onClick={() =>
                              props.handleCollectionType('Not Listed')
                            }
                          >
                            {t('collection-approval.Not-Listed')}
                          </label>
                        </div>
                      </div>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <div className="options dropdownOpt mt-1 hvr_clr py-2">
                        <div className="club_head_tab aaaa">
                          <input
                            type="radio"
                            id="notsale"
                            value="not_for_sale"
                            name="sale_type"
                          />
                          <label
                            className="aaaa"
                            htmlFor="notsale"
                            onClick={() =>
                              props.handleCollectionType('ClubRare')
                            }
                          >
                            {t('collection-approval.ClubRare')}
                          </label>
                        </div>
                      </div>
                    </Dropdown.Item>
                  </div>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <div className="serch_sect_wrp serch_sect_wrp_desktop ">
          <input
            type="text"
            className="backgroup-trans"
            placeholder="Search Collections"
            id="searchInput"
            onKeyUp={() => setSearched()}
          />
        </div>
        <div className="approval_filter_wrp approval_filter_wrp_desktop">
          <ul>
            <div className="approval_filter">
              {props.collectionType !== 'OpenSea' ? (
                <div
                  className="filter_Reset"
                  onClick={() => props.handleCollectionType('OpenSea')}
                >
                  Reset
                </div>
              ) : (
                <div className="filter_by_head">Filter</div>
              )}
            </div>
            <li>
              <button
                className={props.collectionType === 'OpenSea' ? 'active' : ''}
                onClick={() => props.handleCollectionType('OpenSea')}
                type="button"
                disabled={props.collectionType === 'OpenSea'}
              >
                {t('collection-approval.OpenSea')}
              </button>
            </li>
            <li>
              <button
                className={
                  props.collectionType === 'Not Listed' ? 'active' : ''
                }
                onClick={() => props.handleCollectionType('Not Listed')}
                type="button"
                disabled={props.collectionType === 'Not Listed'}
              >
                {t('collection-approval.Not-Listed')}
              </button>
            </li>
            <li>
              <button
                className={props.collectionType === 'ClubRare' ? 'active' : ''}
                onClick={() => props.handleCollectionType('ClubRare')}
                type="button"
                disabled={props.collectionType === 'ClubRare'}
              >
                ClubRare
              </button>
            </li>
          </ul>
          <div className="filter_select_clr_wrp">
            <label
              className={
                props.collectionModel.filter(
                  (collection: any) => collection?.isChecked !== true,
                ).length < 1
                  ? 'active'
                  : ''
              }
            >
              <input
                type="checkbox"
                name="allSelect"
                onChange={props.handleAllCollections}
                disabled={
                  props.collectionModel.filter(
                    (collection: any) => collection?.isChecked !== true,
                  ).length <
                    1 ===
                  true
                }
              />
              Select All
            </label>
            <label
              className={
                props.collectionModel.some((x: any) => x.isChecked == true) ==
                false
                  ? 'active'
                  : ''
              }
            >
              <input
                type="checkbox"
                name="unSelect"
                onChange={props.handleAllCollections}
                disabled={
                  props.collectionModel.some((x: any) => x.isChecked == true) ==
                  false
                    ? true
                    : false
                }
              />
              Clear All
            </label>
          </div>
        </div>
        <div className="approve_checklist_wrp">
          <div
            className={`checklist_wrp align-items-center ${
              allCollections?.length === 0 ? 'd-flex' : ''
            } justify-content-center`}
          >
            {props.collectionLoading ? (
              <Spinner />
            ) : allCollections?.length > 0 ? (
              allCollections.map((collection: any, index: any) => {
                return (
                  <div className="checklist" key={index}>
                    <label className="custcheckwrp">
                      <input
                        type="checkbox"
                        name={collection.displayName}
                        checked={collection.isChecked ? true : false}
                        onChange={(e) => {
                          selectCollection(e, collection, index);
                        }}
                      />
                      <span className="tickmark">
                        <img src={checkbox} alt="img" />
                      </span>
                    </label>
                    <p>{collection.displayName}</p>
                    {collection.isApproved ? (
                      <button className="active">Approved</button>
                    ) : (
                      ''
                    )}
                  </div>
                );
              })
            ) : (
              <React.Fragment>
                <div className="">
                  <h1>{t('collection-approval.notAvailable')}</h1>
                </div>
              </React.Fragment>
            )}
          </div>
          <div className="approved_btn_wrp">
            <button
              className={
                props.isAllApproved ||
                allCollections.filter(
                  (x: any) =>
                    (x.isChecked == true && x.isApproved == false) ||
                    (x.isChecked == true && x.isApproved == false),
                ).length == 0 ||
                props.approveloading
                  ? 'approved_btn disablebtn'
                  : 'approved_btn'
              }
              disabled={
                props.isAllApproved ||
                allCollections.filter(
                  (x: any) =>
                    (x.isChecked == true && x.isApproved == false) ||
                    (x.isChecked == true && x.isApproved == false),
                ).length == 0 ||
                props.approveloading
                  ? true
                  : false
              }
              onClick={props.handleCollectionsApprove}
            >
              {props.approveloading ? 'Loading...' : 'Approve'}
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export { CollectionApproval };
