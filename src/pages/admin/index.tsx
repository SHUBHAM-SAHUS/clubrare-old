import React, { useEffect } from 'react';
import Layout from '../../layouts/main-layout/main-layout';
import './admin.css';
import { Loading, Spinner } from '../../components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getEditProfileAction, getPinataForIpfsApi } from '../../redux';
import {
  GetAdminData,
  SetAdminData,
  UpdateAdminData,
} from '../../redux/actions/admin-action';
import { useToasts } from 'react-toast-notifications';
const Admin = () => {
  const { addToast } = useToasts();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [postLoading, setPostLoading] = useState(false);
  const adminData = useSelector((state: any) => {
    return state.adminReducer.data;
  });
  const loading = useSelector((state: any) => {
    return state.adminReducer.loading;
  });

  useEffect(() => {
    if (!localStorage.getItem('Wallet Address')) {
      return history.push('/home');
    } else {
      getProfileDetails(localStorage.getItem('Wallet Address'));
    }
  }, []);

  useEffect(() => {
    if (adminData) {
      const arr = adminData?.image;
      if (arr && arr.length > 0) {
        arr[0].item_date = adminData ? adminData?.ItemDate1 : '';
        arr[1].item_date = adminData ? adminData?.ItemDate2 : '';
        arr[2].item_date = adminData ? adminData?.ItemDate3 : '';
        arr[3].item_date = adminData ? adminData?.ItemDate4 : '';
        arr[4].item_date = adminData ? adminData?.ItemDate5 : '';
      }

      setFormValue({
        ItemDate1: adminData ? adminData?.ItemDate1 : '',
        ItemTitle1: adminData ? adminData?.ItemTitle1 : '',
        ItemDescription1: adminData ? adminData?.ItemDescription1 : '',
        ItemDate2: adminData ? adminData?.ItemDate2 : '',
        ItemTitle2: adminData ? adminData?.ItemTitle2 : '',
        ItemDate3: adminData ? adminData?.ItemDate3 : '',
        ItemTitle3: adminData ? adminData?.ItemTitle3 : '',
        ItemDate4: adminData ? adminData?.ItemDate4 : '',
        ItemTitle4: adminData ? adminData?.ItemTitle4 : '',
        ItemDate5: adminData ? adminData?.ItemDate5 : '',
        ItemTitle5: adminData ? adminData?.ItemTitle5 : '',
        titleFirst: adminData ? adminData?.titleFirst : '',
        descriptionFirst: adminData ? adminData?.descriptionFirst : '',
        titleSecond: adminData ? adminData?.titleSecond : '',
        descriptionSecond: adminData ? adminData?.descriptionSecond : '',
        imageArray:
          adminData?.image?.length > 0
            ? [...arr]
            : [
                {
                  image_link: '',
                  item_link: '',
                  imageTitle: adminData?.ItemTitle1,
                  image_description: '',
                  item_date: adminData?.ItemDate1,
                },
                {
                  image_link: '',
                  item_link: '',
                  imageTitle: adminData?.ItemTitle2,
                  image_description: '',
                  item_date: adminData?.ItemDate2,
                },
                {
                  image_link: '',
                  item_link: '',
                  imageTitle: adminData?.ItemTitle3,
                  image_description: '',
                  item_date: adminData?.ItemDate3,
                },
                {
                  image_link: '',
                  item_link: '',
                  imageTitle: adminData?.ItemTitle4,
                  image_description: '',
                  item_date: adminData?.ItemDate4,
                },
                {
                  image_link: '',
                  item_link: '',
                  imageTitle: adminData?.ItemTitle5,
                  image_description: '',
                  item_date: adminData?.ItemDate5,
                },
              ],
      });
    }
  }, [adminData]);

  const [formValue, setFormValue] = useState({
    ItemDate1: '',
    ItemTitle1: '',
    ItemDescription1: '',
    ItemDate2: '',
    ItemTitle2: '',
    ItemDate3: '',
    ItemTitle3: '',
    ItemDate4: '',
    ItemTitle4: '',
    ItemDate5: '',
    ItemTitle5: '',
    titleFirst: '',
    descriptionFirst: '',
    titleSecond: '',
    descriptionSecond: '',
    imageArray: [
      {
        image_link: '',
        item_link: '',
        imageTitle: '',
        image_description: '',
        item_date: '',
      },
      {
        image_link: '',
        item_link: '',
        imageTitle: '',
        image_description: '',
        item_date: '',
      },
      {
        image_link: '',
        item_link: '',
        imageTitle: '',
        image_description: '',
        item_date: '',
      },
      {
        image_link: '',
        item_link: '',
        imageTitle: '',
        image_description: '',
        item_date: '',
      },
      {
        image_link: '',
        item_link: '',
        imageTitle: '',
        image_description: '',
        item_date: '',
      },
    ],
  });

  const onChange = async (e: any) => {
    const arr = [...formValue.imageArray];
    switch (e.target.name) {
      case 'ItemTitle1':
        arr[0].imageTitle = e.target.value;
        setFormValue({
          ...formValue,
          [e.target.name]: e.target.value,
          imageArray: arr,
        });
        break;
      case 'ItemTitle2':
        arr[1].imageTitle = e.target.value;
        setFormValue({
          ...formValue,
          [e.target.name]: e.target.value,
          imageArray: arr,
        });
        break;
      case 'ItemTitle3':
        arr[2].imageTitle = e.target.value;
        setFormValue({
          ...formValue,
          [e.target.name]: e.target.value,
          imageArray: arr,
        });
        break;
      case 'ItemTitle4':
        arr[3].imageTitle = e.target.value;
        setFormValue({
          ...formValue,
          [e.target.name]: e.target.value,
          imageArray: arr,
        });
        break;
      case 'ItemTitle5':
        arr[4].imageTitle = e.target.value;
        setFormValue({
          ...formValue,
          [e.target.name]: e.target.value,
          imageArray: arr,
        });
        break;
      case 'ItemDate1':
        arr[0].item_date = e.target.value;
        setFormValue({
          ...formValue,
          [e.target.name]: e.target.value,
          imageArray: arr,
        });
        break;
      case 'ItemDate2':
        arr[1].item_date = e.target.value;
        setFormValue({
          ...formValue,
          [e.target.name]: e.target.value,
          imageArray: arr,
        });
        break;
      case 'ItemDate3':
        arr[2].item_date = e.target.value;
        setFormValue({
          ...formValue,
          [e.target.name]: e.target.value,
          imageArray: arr,
        });
        break;
      case 'ItemDate4':
        arr[3].item_date = e.target.value;
        setFormValue({
          ...formValue,
          [e.target.name]: e.target.value,
          imageArray: arr,
        });
        break;
      case 'ItemDate5':
        arr[4].item_date = e.target.value;
        setFormValue({
          ...formValue,
          [e.target.name]: e.target.value,
          imageArray: arr,
        });
        break;
      default:
        setFormValue({ ...formValue, [e.target.name]: e.target.value });
    }
  };

  const onChangeItem = async (e: any, index: number) => {
    if (e.target.name === 'image_link') {
      const attatchFile = e.target.files[0];
      if (
        attatchFile &&
        attatchFile.type !== 'image/gif' &&
        attatchFile.type !== 'image/jpeg' &&
        attatchFile.type !== 'image/png' &&
        attatchFile.type !== 'image/jpg' &&
        attatchFile.type !== 'video/mp4' &&
        attatchFile.type !== 'video/quicktime' &&
        attatchFile.type !== 'video/wmv'
      ) {
        return;
      } else {
        setPostLoading(true);
        const formData: any = new FormData();
        formData.append('file', attatchFile);
        const result: any = await dispatch(getPinataForIpfsApi(formData));
        const arr: any = [...formValue.imageArray];
        arr[index][e.target.name] = `https://ipfs.io/ipfs/${result.IpfsHash}`;
        setFormValue({ ...formValue, imageArray: arr });
        setPostLoading(false);
      }
    } else {
      const arr: any = [...formValue.imageArray];
      arr[index][e.target.name] = e.target.value;
      setFormValue({ ...formValue, imageArray: arr });
    }
  };

  const getProfileDetails = async (add: any) => {
    if (add) {
      const data = { user_address: add };
      let res: any = await dispatch(getEditProfileAction(data));
      if (res?.data?.role !== 'admin' && !res?.data?.isSuperAdmin) {
        history.push('/home');
      } else {
        dispatch(GetAdminData());
      }
    }
  };
  const getFormatDate = (date: any) => {
    const dateObj = new Date(date);
    const month = dateObj.getUTCMonth() + 1;
    const day = dateObj.getUTCDate();
    return month + '/' + day;
  };
  const submitForm = (e: any) => {
    e.preventDefault();
    if (
      !formValue.ItemDate1 ||
      !formValue.ItemDate2 ||
      !formValue.ItemDate3 ||
      !formValue.ItemDate4 ||
      !formValue.ItemDate5 ||
      !formValue.ItemTitle1 ||
      !formValue.ItemTitle2 ||
      !formValue.ItemTitle3 ||
      !formValue.ItemTitle4 ||
      !formValue.ItemTitle5 ||
      !formValue.descriptionFirst ||
      !formValue.descriptionSecond ||
      !formValue.titleFirst ||
      !formValue.titleSecond
    ) {
      addToast('All fields are required', {
        appearance: 'error',
        autoDismiss: true,
      });
      return;
    }
    setPostLoading(true);

    const reqData = {
      ItemDate1: formValue.ItemDate1,
      ItemTitle1: formValue.ItemTitle1,
      ItemDescription1: formValue.ItemDescription1,
      ItemDate2: formValue.ItemDate2,
      ItemTitle2: formValue.ItemTitle2,
      ItemDate3: formValue.ItemDate3,
      ItemTitle3: formValue.ItemTitle3,
      ItemDate4: formValue.ItemDate4,
      ItemTitle4: formValue.ItemTitle4,
      ItemDate5: formValue.ItemDate5,
      ItemTitle5: formValue.ItemTitle5,
      titleFirst: formValue.titleFirst,
      descriptionFirst: formValue.descriptionFirst,
      titleSecond: formValue.titleSecond,
      descriptionSecond: formValue.descriptionSecond,
      image: formValue.imageArray,
    };

    if (adminData == null) {
      SetAdminData(reqData)?.then((res: any) => {
        const result = res.data;
        if (result.status) {
          addToast(result.message, {
            appearance: 'success',
            autoDismiss: true,
          });
        }
        setPostLoading(false);
      });
    } else {
      Object.assign(reqData, { _id: adminData?._id });
      UpdateAdminData(reqData)?.then((res: any) => {
        const result = res.data;
        if (result.status) {
          addToast(result.message, {
            appearance: 'success',
            autoDismiss: true,
          });
        }
        setPostLoading(false);
      });
    }
  };

  const resetItem = (index: number) => {
    const array = [...formValue.imageArray];
    array[index].image_link = '';
    array[index].item_link = '';
    array[index].image_description = '';
  };

  return (
    <>
      <Layout mainClassName="">
        {loading ? (
          <Spinner />
        ) : (
          <div className="temp-container">
            <form noValidate autoComplete="off" onSubmit={(e) => submitForm(e)}>
              <div className="grid grid-cols-5">
                <div className="days-container">
                  <div className="input-container height-div">
                    <input
                      className="responsive-placeholder bg-transparent border-b border-solid  w-full"
                      type="date"
                      name="ItemDate1"
                      value={formValue.ItemDate1}
                      onChange={onChange}
                    />
                    <input
                      className="responsive-placeholder bg-transparent border-b border-solid  w-full"
                      type="text"
                      placeholder="Title first"
                      name="ItemTitle1"
                      value={formValue.ItemTitle1}
                      onChange={onChange}
                    />
                    <input
                      className="responsive-placeholder bg-transparent border-b border-solid  w-full"
                      type="text"
                      placeholder="Description"
                      name="ItemDescription1"
                      value={formValue.ItemDescription1}
                      onChange={onChange}
                    />
                  </div>
                </div>
                <div className="days-container">
                  <div className="input-container height-div">
                    <input
                      className="responsive-placeholder bg-transparent border-b border-solid  w-full"
                      type="date"
                      name="ItemDate2"
                      value={formValue.ItemDate2}
                      onChange={onChange}
                    />
                    <input
                      className="responsive-placeholder bg-transparent border-b border-solid  w-full"
                      type="text"
                      placeholder="Title second"
                      name="ItemTitle2"
                      value={formValue.ItemTitle2}
                      onChange={onChange}
                    />
                  </div>
                </div>
                <div className="days-container">
                  <div className="input-container height-div">
                    <input
                      className="responsive-placeholder bg-transparent border-b border-solid  w-full"
                      type="date"
                      name="ItemDate3"
                      value={formValue.ItemDate3}
                      onChange={onChange}
                    />

                    <input
                      className="responsive-placeholder bg-transparent border-b border-solid  w-full"
                      type="text"
                      placeholder="Title third"
                      name="ItemTitle3"
                      value={formValue.ItemTitle3}
                      onChange={onChange}
                    />
                  </div>
                </div>
                <div className="days-container">
                  <div className="input-container height-div">
                    <input
                      className="responsive-placeholder bg-transparent border-b border-solid  w-full"
                      type="date"
                      name="ItemDate4"
                      value={formValue.ItemDate4}
                      onChange={onChange}
                    />

                    <input
                      className="responsive-placeholder bg-transparent border-b border-solid  w-full"
                      type="text"
                      placeholder="Title fourth"
                      name="ItemTitle4"
                      value={formValue.ItemTitle4}
                      onChange={onChange}
                    />
                  </div>
                </div>
                <div className="days-container">
                  <div className="input-container height-div">
                    <input
                      className="responsive-placeholder bg-transparent border-b border-solid  w-full"
                      type="date"
                      name="ItemDate5"
                      value={formValue.ItemDate5}
                      onChange={onChange}
                    />

                    <input
                      className="responsive-placeholder bg-transparent border-b border-solid  w-full"
                      type="text"
                      placeholder="Title fifth"
                      name="ItemTitle5"
                      value={formValue.ItemTitle5}
                      onChange={onChange}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 mt-40">
                <div className="input-container">
                  <input
                    className="responsive-placeholder bg-transparent border-b border-solid  w-full"
                    type="text"
                    placeholder="Title"
                    name="titleFirst"
                    value={formValue.titleFirst}
                    onChange={onChange}
                  />

                  <textarea
                    className="responsive-placeholder bg-transparent border-b border-solid  w-full"
                    placeholder="Description"
                    name="descriptionFirst"
                    value={formValue.descriptionFirst}
                    onChange={onChange}
                  ></textarea>
                </div>
              </div>

              <div className="grid grid-cols-1 mt-40">
                <div className="input-container">
                  <input
                    className="responsive-placeholder bg-transparent border-b border-solid  w-full"
                    type="text"
                    placeholder="Title"
                    name="titleSecond"
                    value={formValue.titleSecond}
                    onChange={onChange}
                  />

                  <textarea
                    className="responsive-placeholder bg-transparent border-b border-solid  w-full"
                    placeholder="Description"
                    name="descriptionSecond"
                    value={formValue.descriptionSecond}
                    onChange={onChange}
                  ></textarea>
                </div>
              </div>

              {formValue.imageArray?.map((item, index) => {
                return (
                  <>
                    <div className="grid grid-cols-1 mt-40">
                      {formValue.ItemDate2 && (
                        <h3 className="gradient-color">
                          {getFormatDate(item.item_date)}{' '}
                        </h3>
                      )}
                      <p className="font-12">{item.imageTitle}</p>
                    </div>

                    <div className="grid grid-cols-1 mt-15 d-flex">
                      <div className="card-container grid grid-cols-1 justify-items-start items-center mt-6.5">
                        <input
                          className="custom-file-input text-transparent cursor-pointer row-start-1 col-start-1 w-full
                                    font-semibold rounded-12 bg-white bg-opacity-20 border border-solid"
                          type="file"
                          name="image_link"
                          accept="image/*"
                          onChange={(e: any) => onChangeItem(e, index)}
                        />
                        <div className="row-start-1 col-start-1 justify-self-center z-10 text-16 md:text-20 text-blue pointer-events-none">
                          {postLoading ? (
                            <Loading margin={'0'} size={'16px'} />
                          ) : (
                            t('create.ChooseFile')
                          )}
                        </div>
                        {item.image_link && (
                          <img src={item.image_link} alt="image_link" />
                        )}
                        <div
                          className=" d-flex"
                          style={{ flexDirection: 'column' }}
                        >
                          <p>{item.imageTitle}</p>
                        </div>
                        <input
                          className="responsive-placeholder bg-transparent border-b border-solid  w-full"
                          type="text"
                          placeholder="Image description"
                          value={formValue.imageArray[index].image_description}
                          name="image_description"
                          onChange={(e) => onChangeItem(e, index)}
                        />
                      </div>
                    </div>
                    <div className="item-link">
                      <label>Item Link</label>
                      <input
                        name="item_link"
                        className="responsive-placeholder bg-transparent border-b border-solid  w-full"
                        value={formValue.imageArray[index].item_link}
                        onChange={(e) => onChangeItem(e, index)}
                      />
                      {item.image_link && (
                        <button
                          onClick={() => resetItem(index)}
                          className="remove-item"
                        >
                          Remove Item
                        </button>
                      )}
                    </div>
                  </>
                );
              })}

              <button
                type="submit"
                className="w-full text-16 md:text-14 text-white linearGradient
                                flex items-center justify-center
                                font-bold rounded-12 py-4 md:py-3.5 mt-17"
              >
                {formValue ? (
                  postLoading ? (
                    <Loading margin={'0'} size={'16px'} />
                  ) : (
                    <span>Update</span>
                  )
                ) : postLoading ? (
                  <Loading margin={'0'} size={'16px'} />
                ) : (
                  <span>Submit</span>
                )}
              </button>
            </form>
          </div>
        )}
      </Layout>
    </>
  );
};

export { Admin };
