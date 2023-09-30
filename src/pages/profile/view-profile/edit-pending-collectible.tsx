import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { useDispatch, useSelector } from 'react-redux';
import VideoThumbnail from 'react-video-thumbnail';
import './collection-mod.css';
import { AllcollectionCategory, updateData } from '../../../redux';
import { useToasts } from 'react-toast-notifications';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../../../components';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { imgConstants } from '../../../assets/locales/constants';

const EditPendingCollectible: React.FC<any> = (props) => {
  const { item } = props;
  let propertyCounter = 0;
  const { t } = useTranslation();
  const allcategory = useSelector(
    (state: any) => state.categoryReducer.allcategoryitem,
  );

  useEffect(() => {
    dispatch(AllcollectionCategory());
  }, []);

  React.useEffect(() => {
    const newCategory = allcategory.find(
      ({ _id }: any) => _id === item.category_id,
    );
    if (item?.imageRules?.length) {
      const newArray = item?.imageRules?.map((rule: any) => {
        const oldRule = newCategory?.imageRules?.find(
          ({ _id }: any) => rule.mongoImageId === _id,
        );
        return {
          ...rule,
          name: oldRule?.name,
          isRequired: oldRule?.isRequired,
          description: oldRule?.description,
        };
      });
      setCollectibleImages(newArray);
    }
  }, [item, allcategory]);

  const [titleName, setTitleName] = useState(item?.title);
  const [description, setDescription] = useState(item?.description);
  const [allcatimgname, Setallcatimgname] = useState<any>([]);
  const [royalties, setRoyalties] = useState(item?.royalties);

  const [collectibleImageList, setCollectibleImages] = useState<any>([]);
  const [isLoaded, setIsLoaded] = useState(true);
  const [isVideo, setIsVideo] = useState(false);
  const [isAudio, setisAudio] = useState(false);
  const [imgWithType, setImgWithType] = useState({ url: '', type: '' });
  const [isSubmited, setIsSubmitted] = useState(false);
  const { addToast } = useToasts();
  const [error, setError] = useState({
    titleName: '',
    collection: '',
    category_id: '',
    royalties: '',
    description: '',
    back: '',
    front: '',
    logo: '',
    hallmark: '',
    madein: '',
    attachment: '',
    properties: '',
  });
  const [attactment, setAttachment] = useState<any>('');
  const regex = /^\d+(\.\d{1,2})?$/;

  const dispatch = useDispatch();

  useEffect(() => {
    if (item && item.s3_url) {
      setImgWithType({ type: item?.file_content_type, url: item.s3_url });
    }
  }, [item.s3_url]);

  async function getVideoDimensionsOf(url:any){
    return new Promise(resolve => {
        // create the video element
        const video = document.createElement('video');
        // place a listener on it
        video.addEventListener( "loadedmetadata", function () {
            // retrieve dimensions
            const height = this.videoHeight;
            const width = this.videoWidth;
            // send back result
            resolve({height:height, width:width});
        }, false);

        // start download meta-datas
        video.src = url;
    });
}

const getCurrentDimensions=async(file:any)=>{
    return new Promise(async(res,rej)=>{
      if (file?.type?.startsWith('image/')) {
        let img = new Image()
        img.src = window.URL.createObjectURL(file)
        img.onload = () => {
          res(
            {
            height:img.height,
            width:img.width
    
          })
        } 
      } else if(file?.type?.startsWith('video/mp4')){
      const videoDimension=await getVideoDimensionsOf(window.URL.createObjectURL(file))
        res(videoDimension)
      }else{
        res(
          {
          height:265,
          width:265
  
        })
      }
    })
}

  const inputClickHandler = async(event: any) => {
    const { name, value } = event.target;
    const productRegexImg = new RegExp('(.*?).(gif|jpe?g|png|svg|mp4|mp3)$');

    switch (name) {
      case 'attachment':
        if (value === '' || value == null || !value) {
          if (!attactment) {
            setError({ ...error, attachment: 'Artwork can not be empty' });
          }
        } else {
          setError({ ...error, attachment: '' });
        }
        const dimensions:any= await getCurrentDimensions(event.target.files[0]);
        if ((264 > dimensions?.height) || (264 > dimensions?.width)) {
          setError({
            ...error,
            attachment: 'We recommended you upload a file of 264 x 264 resolution.',
          });
          addToast('We recommended you upload a file of 264 x 264 resolution.', {
            appearance: 'error',
            autoDismiss: true,
          });
          return;
        } else{
          if (value) {
            if (
              !event.target.files[0]?.type?.startsWith('image/') &&
              !event.target.files[0]?.type?.startsWith('video/mp4') &&
              !event.target.files[0]?.type?.startsWith('audio/')
            ) {
              setError({
                ...error,
                attachment: "Please select file valid format(Image, MP3, MP4)",
              });
              addToast('Please select file valid format(Image, MP3, MP4)', {
                appearance: 'error',
                autoDismiss: true,
              });
              return;
            }
          }
          if (productRegexImg.test(value?.toLowerCase())) {
            if (value) {
              if (event.target.files[0].size / 1024 / 1024 > 30) {
                setError({
                  ...error,
                  attachment: 'Please select file size not more than 30 MB',
                });
                return;
              } else {
                setAttachment(event.target.files[0]);
                setImgWithType({
                  type: event.target.files[0].type,
                  url: event.target.files[0],
                });
                setError({ ...error, attachment: '' });
              }
              if (event.target.files[0].type === 'video/mp4') {
                setIsVideo(true);
                setisAudio(false);
              } else if (event.target.files[0].type === 'audio/mpeg') {
                setisAudio(true);
                setIsVideo(false);
              } else {
                setisAudio(false);
                setIsVideo(false);
              }
            }
          }
          else {
            addToast('Please select file valid format(Image,MP3,MP3)', {
              appearance: 'error',
              autoDismiss: true,
            });
            setAttachment('');
            return;
          }
        }
       

        break;
      case 'title':
        if (value === '') {
          setError({ ...error, titleName: 'Title can not be empty' });
        } else {
          setError({ ...error, titleName: '' });
        }
        setTitleName(value);
        break;
      case 'category':
        if (value === '') {
          setError({ ...error, category_id: 'Category can not be empty' });
        } else {
          setError({ ...error, category_id: '' });
        }
        break;
      case 'description':
        if (value === '') {
          setError({ ...error, description: 'Description can not be empty' });
        } else {
          setError({ ...error, description: '' });
        }
        setDescription(value);
        break;
      case 'royalities':
        if (value === '') {
          setError({ ...error, royalties: 'Royalties can not be empty' });
        } else if (value < 0) {
          setError({
            ...error,
            royalties: 'Royalties can not set less than 0',
          });
        } else if (value > 90) {
          setError({
            ...error,
            royalties: 'Royalties can not set more than 90',
          });
        } else if (!regex.test(value)) {
          setError({
            ...error,
            royalties:
              'Royalties can set only two decimal after a number, For example: 51.36',
          });
        } else {
          setError({ ...error, royalties: '' });
        }
        setRoyalties(value);
        break;
      default:
        break;
    }
  };

  const openUploader = (id: number) => {
    document.getElementById(`fileUploader-${id}`)?.click();
  };

  const upload = (e: any, imageRule: any) => {
    const { name } = imageRule;
    const img = e.target.files[0];
    let value = e.target.value;
    const productRegexImg = new RegExp('(.*?).(gif|jpe?g|png|svg)$');
    if (productRegexImg.test(value?.toLowerCase())) {
      if (img) {
        const values = collectibleImageList.map(function (o: any) {
          return o._id;
        });
        const newList: any = [...collectibleImageList];
        if (!img?.type?.startsWith('image/')) {
          const index = values.indexOf(imageRule._id);
          newList[index] = {
            ...newList[index],
            errorMsg: 'Please select file valid image format',
          };
          setCollectibleImages(newList);
          return;
        } else if (img?.size / 1024 / 1024 > 3) {
          const index = values.indexOf(imageRule._id);
          newList[index] = {
            ...newList[index],
            errorMsg: 'Please select file size not more than 3 MB',
          };
          setCollectibleImages(newList);
          return;
        } else {
          const values = newList.map(function (o: any) {
            return o._id;
          });
          const index = values.indexOf(imageRule?._id);
          newList[index] = { ...newList[index], localUrl: img, errorMsg: '' };
          setCollectibleImages(newList);
        }
        const newallcatimgname = allcatimgname.filter((x: any) => x.name != name);
        Setallcatimgname([
          ...newallcatimgname,
          { name: imageRule.name, file: img },
        ]);
      }
    } else {
      addToast('Please select file valid format(Image)', {
        appearance: 'error',
        autoDismiss: true,
      });
      return;
    }
  };

  const newarray = [...[{ imageRule: imgWithType }], ...collectibleImageList];
  const renderCustomThumbs = () => {
    const thumbList = newarray?.map((product: any, i: any) => {
      return (
        <>
          {product?.imageRule?.type ? (
            <picture key={i}>
              {product?.imageRule?.type?.includes('image') ? (
                <img
                  key={product._id}
                  src={
                    attactment
                      ? URL.createObjectURL(attactment)
                      : product?.imageRule?.url
                  }
                  alt={product.alternativeText}
                  height="80px"
                  width="200"
                />
              ) : product?.imageRule?.type?.includes('video') ? (
                <VideoThumbnail
                  videoUrl={
                    attactment
                      ? URL.createObjectURL(attactment)
                      : product?.imageRule?.url
                  }
                  style={{
                    width: '200px',
                    height: '110px',
                  }}
                />
                
              ) : product?.imageRule?.type?.includes('audio') ? (
                <img
                  className=""
                  src={
                    'https://d1gqvtt7oelrdv.cloudfront.net/assets/images/musicIcon.png'
                  }
                  alt="music-icon"
                  style={{ height: '110px', border: '1px solid black' }}
                />
              ) : null}
            </picture>
          ) : (
            <picture key={i}>
              {product?.url && (
                <img
                  key={product._id}
                  src={
                    product.localUrl
                      ? URL.createObjectURL(product.localUrl)
                      : product.url
                  }
                  alt={product.alternativeText}
                  height="80px"
                  width="200"
                />
              )}
            </picture>
          )}
        </>
      );
    });
    return thumbList;
  };

  const updatecollection = async () => {
    try {
      const reg = /^\d+(\.\d{1,2})?$/;
      setIsSubmitted(true);

      const finalPropertyArr: any = [];
      const items: any =
        document.querySelectorAll('.property_field_wrp') || null;
      for (const item of items) {
        const key: any = item.getElementsByTagName('input')[0].value;
        const value: any = item.getElementsByTagName('input')[1].value;
        if (key || value) {
          finalPropertyArr.push({ key: key, value: value });
        }
      }
      let errorMsg1 = '';
      const errorMsg2 = '';
      let errorMsg3 = '';
      let errorMsg4 = '';
      if (titleName === '') {
        errorMsg1 = 'Title can not be empty';
      }
      if (royalties === '') {
        errorMsg3 = 'Royalties can not be empty';
      } else if (royalties > 90) {
        errorMsg3 = 'Royalties can not set more than 90';
      } else if (royalties < 0) {
        errorMsg3 = 'Royalties can not set less than 0';
      } else if (!reg.test(royalties)) {
        errorMsg3 =
          'Royalties can set only two decimal after a number, For example: 51.36';
      }
      if (attactment.size / 1024 / 1024 > 30) {
        errorMsg4 = 'Please select file size not more than 30 MB';
      }
      setError({
        ...error,
        titleName: errorMsg1,
        attachment: errorMsg4,
        royalties: errorMsg3,
      });
      let errorExist = false;
      collectibleImageList?.forEach((element: any) => {
        if (element.errorMsg) {
          errorExist = true;
        } else {
          return;
        }
      });
      if (
        errorMsg1 !== '' ||
        errorMsg2 !== '' ||
        errorMsg3 ||
        errorMsg4 ||
        errorExist
      ) {
        return;
      }
      const formData: any = new FormData();
      formData.append('_id', item._id);
      formData.append('title', titleName);
      formData.append('description', description || '');
      formData.append('royalties', royalties || '');
      formData.append('customFields', JSON.stringify(finalPropertyArr));
      if (attactment) {
        formData.append('attachment', attactment || '');
      }
      if (collectibleImageList && collectibleImageList.length > 0) {
        collectibleImageList.forEach((element: any) => {
          if (element.localUrl) {
            formData.append(element.name, element.localUrl);
          }
        });
      }
      setIsLoaded(false);
      setIsSubmitted(false);
      const result: any = await dispatch(updateData(formData));
      if (result && result.data.code === 200) {
        props.getPendingCollectiblesList();
        props.hide();
        setIsLoaded(true);
        setIsSubmitted(false);
        addToast(result.data.message, {
          appearance: 'success',
          autoDismiss: true,
        });
      } else {
        setIsLoaded(true);
        setIsSubmitted(false);
        addToast(result.data.message, {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    } catch (error) {
      setIsLoaded(true);
      setIsSubmitted(false);
      return false;
    }
  };
  const closeEditPopup = () => {
    props.hide();
  };

  const handleValue = (rule: any) => {
    let nameOfImage = '';
    if (rule && rule.url) {
      const valTamp = rule.url.split('/');
      nameOfImage = valTamp[valTamp.length - 1];
    }
    return nameOfImage;
  };

  const delPropertiesHandler = (e: any) => {
    const element = e.target;
    element.closest('.property_field_wrp').remove();
  };
  const addPropertiesHandler = () => {
    const countAll = document.querySelectorAll('.property_field_wrp').length;
    if (countAll <= 4) {
      const elem: any =
        document.querySelector('.property_field_wrp:last-child') || null;
      const clone: any = elem.cloneNode(true);
      propertyCounter++;
      clone.getElementsByTagName('input')[0].name = `key-${propertyCounter}`;
      clone.getElementsByTagName('input')[1].name = `value-${propertyCounter}`;
      clone.getElementsByTagName('input')[0].value = '';
      clone.getElementsByTagName('input')[1].value = '';
      var slides = document.getElementsByClassName("property_field_wrp");
      let elementArray = Array.prototype.slice.call(slides, 0);
      let a = [{ key: 'Ex: Size', val: 'Large' }, { key: 'Ex: Brand', val: 'Jordan' }, { key: 'Ex: Year Made', val: '2018' }, { key: 'Others', val: 'Others' }, { key: 'Others1', val: 'Others1' }].filter((x: any) => !elementArray.some((y: any) => y.childNodes[0]?.childNodes[0].placeholder === x.key))
      clone.getElementsByTagName('input')[0].placeholder = a[0]?.key !== 'Others1' ? a[0].key : 'Others'
      clone.getElementsByTagName('input')[1].placeholder = a[0]?.val !== 'Others1' ? a[0].val : 'Others'
      clone.classList.add('clone-elem');
      elem.after(clone);
    } else {
      addToast(`You can only add five properties`, {
        appearance: 'error',
        autoDismiss: true,
      });
    }

    const items: any = document.querySelectorAll('.del_prop_btn') || null;
    for (const item of items) {
      item.addEventListener('click', delPropertiesHandler);
    }
  };

  return (
    <div
      className="collection-modal"
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
        className="collection-modal-inner pending_coll_wrp"
        style={{
          backgroundColor: 'white',
          minWidth: '300px',
          position: 'relative',
        }}
      >
        <div
          className="modal text-center"
          id="collectionmodal"
          tabIndex={-1}
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-content">
            <span aria-hidden="true" onClick={props.hide} className="close_btn">
              X
            </span>
            <div className="collection_modal_inner">
              <h2 className="text-center mb-4">Pending Collectibles</h2>

              <div className="row">
                <div className="col-6 edit_coll_left">
                  <input
                    type="file"
                    className="upload-file "
                    name="collectionImage"
                    onChange={props.inputClickHandler}
                    id="collectionChoosFile"
                    style={{ display: 'none' }}
                  />
                  <span
                    style={{ color: 'red', fontSize: 12, fontWeight: 'bold' }}
                  >
                    {props.error.collectionImage}
                  </span>

                  <h3 className="uploadyourartworkhead mb-1">
                    {t('create.UploadYourArtwork')}
                    <span className="text-danger"> * </span>
                  </h3>
                  <div className="border-dash edit_img_upload mt-1">
                    <div className="flex items-center justify-center mt-2 choosefiletxt">
                      <div className="text-12 text-blue opacity-80 mr-2">
                        IMAGE, MP4 or MP3
                      </div>
                      <div className="text-12 text-blue opacity-80 mr-2">
                        {t('create.Max30mb')}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 justify-items-start items-center mt-2 choosefilebtn">
                      <label htmlFor="colinput" className="mx-auto">
                        <input
                          className="custom-file-input text-transparent w-full d-none"
                          type="file"
                          name="attachment"
                          id="colinput"
                          style={{}}
                          accept="image/*,.mp4,.mp3,"
                          onChange={(e: any) => {
                            inputClickHandler(e);
                          }}
                        />
                        <div className="row-start-1 col-start-1 justify-self-center button-share-gray">
                          {t('create.ChooseFile')}
                        </div>
                      </label>
                    </div>
                    <p className="text-red uploaderror">{error.attachment}</p>
                  </div>
                  <div className="collection_form_wrp text-left">
                    <div id="collectionform">
                      <div className="comm_input_wrp">
                        <label>
                          {t('create.Title')}{' '}
                          <span className="text-danger"> * </span>
                        </label>
                        <input
                          type="text"
                          className="inpt responsive-placeholder bg-transparent border-b border-solid border-black
                      w-full "
                          name="title"
                          onChange={inputClickHandler}
                          id="displayName"
                          value={titleName || ''}
                          placeholder="Enter token name"
                        />
                        <p className="text-red justify-self-start mt-2 pl-2">
                          {error.titleName}
                        </p>
                      </div>
                      <div className="comm_input_wrp mt-4">
                        <label>Description</label>
                        <textarea
                          className="col-12 relative_fld"
                          name="description"
                          value={description || ""}
                          placeholder="Spreads some words about your token collection"
                          id="collectionDescription"
                          onChange={(e) => inputClickHandler(e)}
                        ></textarea>
                        <span
                          style={{
                            color: 'red',
                            fontSize: 12,
                            fontWeight: 'bold',
                          }}
                        >
                          {props.error.description}
                        </span>
                      </div>
                      <div className="row mt-4">
                        <div className="col-12">
                          <div className="comm_input_wrp">
                            <label>
                              Category <span className="text-danger"> * </span>
                            </label>
                            <input
                              type="text"
                              className="inpt responsive-placeholder bg-transparent border-b border-solid border-black
                          w-full"
                              name="category"
                              id="shortUrl"
                              value={allcategory
                                .filter((x: any) => x._id == item.category_id)
                                .map((x: any) => x.name)
                                .toString()}
                              placeholder=""
                              disabled={true}
                            />
                            <span
                              style={{
                                color: 'red',
                                fontSize: 12,
                                fontWeight: 'bold',
                              }}
                            >
                              {props.error.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="">
                          <div className="comm_input_wrp text-left row">
                            <div className="col-6 comn_site_dropdown size_cmn_site_dropdown">
                              <div className="text-14 md:text-15 text-blue font-semibold  mt-4 mb-2 md:mt-0">
                                Properties(Optional)
                              </div>
                            </div>
                            <div className="parent_property_field_wrp pending_coll_popup_property">
                              {item && item?.customFields?.length > 0 ? (
                                item && item?.customFields?.map((elm: any, i: any) => {
                                  return (
                                    <div
                                      className="row property_field_wrp align-item-end mt-3"
                                      key={i}
                                    >
                                      <div className="col-4 cproperty_field_wrpomn_site_dropdown size_cmn_site_dropdown edit_properties ">
                                        <input
                                          className="responsive-placeholder bg-transparent border-b border-solid relative_fld w-full"
                                          placeholder='Ex: Size'
                                          name="key-1"
                                          defaultValue={elm.key}
                                          maxLength={10}
                                        />
                                      </div>
                                      <div className="col-4  mobil_res club_createitem edit_properties">
                                        <div className="properties_size">
                                          <input
                                            className="responsive-placeholder bg-transparent border-b border-solid relative_fld w-full"
                                            name="value-1"
                                            placeholder='Large'
                                            maxLength={50}
                                            defaultValue={elm.value}
                                          />
                                        </div>
                                      </div>
                                      <div className="col-4 addbtn_wrp properties_size createnewbtn_wrp edit_properties">
                                        <button
                                          type="button"
                                          className="add_prop_btn"
                                          onClick={addPropertiesHandler}
                                        >
                                          Add Properties
                                        </button>
                                        <button
                                          type="button"
                                          className="del_prop_btn del_prop_img"
                                          onClick={(e) =>
                                            delPropertiesHandler(e)
                                          }
                                        >
                                          <img
                                            className="cursor-pointer "
                                            src={imgConstants.deleteicon}
                                            alt="deleteicon"
                                          />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <div className="row property_field_wrp align-item-end mt-3">
                                  <div className="col-4 cproperty_field_wrpomn_site_dropdown size_cmn_site_dropdown edit_properties">
                                    <input
                                      className="responsive-placeholder bg-transparent border-b border-solid relative_fld w-full"
                                      placeholder="Ex: Size"
                                      name="key-1"
                                      maxLength={10}
                                    />
                                  </div>
                                  <div className="col-4  mobil_res club_createitem edit_properties">
                                    <div className="properties_size">
                                      <input
                                        className="responsive-placeholder bg-transparent border-b border-solid relative_fld w-full"
                                        name="value-1"
                                        placeholder="Large"
                                        maxLength={50}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-4 addbtn_wrp properties_size createnewbtn_wrp edit_properties">
                                    <button
                                      type="button"
                                      className="add_prop_btn"
                                      onClick={addPropertiesHandler}
                                    >
                                      Add Properties
                                    </button>
                                    <button
                                      type="button"
                                      className="del_prop_btn del_prop_img"
                                      onClick={(e) => delPropertiesHandler(e)}
                                    >
                                      <img
                                        className="cursor-pointer "
                                        src={imgConstants.deleteicon}
                                        alt="deleteicon"
                                      />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <br />

                      <div className="comm_input_wrp">
                        <label>
                          Royalties <span className="text-danger"> * </span>
                        </label>
                        <input
                          type="text"
                          className="inpt responsive-placeholder bg-transparent border-b border-solid border-black w-full"
                          name="royalities"
                          id="shortUrl"
                          onChange={inputClickHandler}
                          value={royalties}
                          placeholder=""
                        />
                        <p className="text-red justify-self-start mt-2 pl-2">
                          {error.royalties}
                        </p>
                      </div>

                      {item.redeemable === true ? (
                        <div>
                          <div className="row mt-4">
                            {collectibleImageList?.filter((x: any) => !x?.name?.startsWith('authentication_image'))?.map((rule: any) => (
                              <div className="col-md-6 mb-3">
                                <label>
                                  {rule.description}{' '}
                                  {rule.isRequired ? (
                                    <span className="text-danger"> * </span>
                                  ) : null}
                                </label>
                                <div className="comm_input_wrp mod_set">
                                  <input
                                    type="text"
                                    className="inpt responsive-placeholder bg-transparent border-b border-solid border-black
                                                w-full"
                                    name="shortUrl"
                                    id="shortUrl"
                                    value={handleValue(rule)}
                                    placeholder=""
                                  />

                                  <input
                                    type="file"
                                    id={`fileUploader-${rule._id}`}
                                    key={rule._id}
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => upload(e, rule)}
                                  />

                                  {rule.isRequired &&
                                    isSubmited &&
                                    !(
                                      collectibleImageList.filter(
                                        (x: any) =>
                                          x.localUrl !== '' && x.url !== '',
                                      ).length > 0
                                    ) ? (
                                    <>
                                      {!rule?.errorMsg && (
                                        <span className="text-danger">
                                          required
                                        </span>
                                      )}
                                    </>
                                  ) : null}
                                </div>
                                <span className="text-danger">
                                  {rule?.errorMsg}
                                </span>
                                <button
                                  className="upload_btn"
                                  key={rule._id}
                                  style={{
                                    display: 'block;width:120px; height:30px;',
                                  }}
                                  onClick={() => openUploader(rule._id)}
                                >
                                  Upload Image
                                </button>
                              </div>
                            ))}
                          </div>
                          {
                            collectibleImageList && collectibleImageList?.filter((x: any) => x?.name?.startsWith('authentication_image'))?.length > 0 && (
                              <label className='mt-3'>Authentication Photos</label>
                            )
                          }
                          <div className="row mt-4">
                            {collectibleImageList?.filter((x: any) => x?.name?.startsWith('authentication_image'))?.map((rule: any) => (
                              <div className="col-md-6 mb-3">
                                <div className="comm_input_wrp mod_set">
                                  <input
                                    type="text"
                                    className="inpt responsive-placeholder bg-transparent border-b border-solid border-black
                                                w-full"
                                    name="shortUrl"
                                    id="shortUrl"
                                    value={handleValue(rule)}
                                    placeholder=""
                                  />

                                  <input
                                    type="file"
                                    id={`fileUploader-${rule._id}`}
                                    key={rule._id}
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => upload(e, rule)}
                                  />

                                  {rule.isRequired &&
                                    isSubmited &&
                                    !(
                                      collectibleImageList.filter(
                                        (x: any) =>
                                          x.localUrl !== '' && x.url !== '',
                                      ).length > 0
                                    ) ? (
                                    <>
                                      {!rule?.errorMsg && (
                                        <span className="text-danger">
                                          required
                                        </span>
                                      )}
                                    </>
                                  ) : null}
                                </div>
                                <span className="text-danger">
                                  {rule?.errorMsg}
                                </span>
                                <button
                                  className="upload_btn"
                                  key={rule._id}
                                  style={{
                                    display: 'block;width:120px; height:30px;',
                                  }}
                                  onClick={() => openUploader(rule._id)}
                                >
                                  Upload Image
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="col-6 edit_coll_right pending_collection">
                  <div className="">
                    <div className="adjust-modal editmodal">
                      {!imgWithType.type ? (
                        <Spinner />
                      ) : (
                        <>
                          {newarray.length > 0 ? (
                            <Carousel
                              showArrows={true}
                              dynamicHeight={false}
                              showStatus={false}
                              showThumbs={true}
                              showIndicators={false}
                              swipeable={true}
                              infiniteLoop={true}
                              useKeyboardArrows={true}
                              renderThumbs={renderCustomThumbs}
                            >
                              {newarray &&
                                newarray.map((image: any, i: any) => {
                                  return (
                                    <>
                                      <div
                                        className="sliderimg_wrp"
                                        style={{
                                          padding: 0,
                                          minHeight: '400px',
                                        }}
                                      >
                                        <div>
                                          {image?.imageRule?.type?.includes(
                                            'image',
                                          ) ? (
                                            <div
                                              key={i}
                                              className="clubcrt_img_wrp detail_img_wrp"
                                            >
                                              <img
                                                key={i}
                                                src={
                                                  attactment
                                                    ? URL.createObjectURL(
                                                      attactment,
                                                    )
                                                    : image.imageRule?.url
                                                }
                                                alt="url"
                                              />
                                            </div>
                                          ) : image?.imageRule?.type?.includes(
                                            'video',
                                          ) ? (
                                            <div className="clubcrt_img_wrp">
                                              <video
                                                style={{
                                                  width: '95%',
                                                  margin: 'auto',
                                                }}
                                                controls
                                              >
                                                <source
                                                  key={i}
                                                  src={
                                                    attactment
                                                      ? URL.createObjectURL(
                                                        attactment,
                                                      )
                                                      : image?.imageRule?.url
                                                  }
                                                  type="video/mp4"
                                                />
                                              </video>
                                            </div>
                                          ) : image?.imageRule?.type?.startsWith(
                                            'audio',
                                          ) ? (
                                            <div>
                                              <div className="clubcrt_img_wrp">
                                                <img
                                                  className=""
                                                  src={
                                                    'https://d1gqvtt7oelrdv.cloudfront.net/assets/images/musicIcon.png'
                                                  }
                                                  alt="music-icon"
                                                  style={{
                                                    position: 'relative',
                                                    marginTop: '10px',
                                                  }}
                                                />
                                                <audio
                                                  controls
                                                  className="row-start-1 col-start-1 w-75 rounded-50 bg-white bg-opacity-20 h-60 ml-25 md:h-14 object-contain"
                                                  style={{ margin: 'auto' }}
                                                >
                                                  <source
                                                    src={image?.imageRule?.url}
                                                  ></source>
                                                </audio>
                                              </div>
                                            </div>
                                          ) : null}
                                        </div>
                                        {image.url && (
                                          <div
                                            key={i}
                                            className="clubcrt_img_wrp detail_img_wrp"
                                          >
                                            <img
                                              key={i}
                                              src={
                                                image.localUrl
                                                  ? URL.createObjectURL(
                                                    image.localUrl,
                                                  )
                                                  : image.url
                                              }
                                              alt="url"
                                            />
                                          </div>
                                        )}
                                      </div>
                                    </>
                                  );
                                })}
                            </Carousel>
                          ) : null}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-4">
                <button
                  type="button"
                  className="mintbtn"
                  onClick={updatecollection}
                >
                  Update Collectible {isLoaded === false && <>...</>}
                </button>
                <button
                  onClick={closeEditPopup}
                  type="button"
                  className="mintbtn"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPendingCollectible;
