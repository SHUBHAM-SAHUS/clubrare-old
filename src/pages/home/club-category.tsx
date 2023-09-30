import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Slider from 'react-slick';
import './club-category.scss';
import sneaker from '../../assets/images/sneakers.svg';
import handbags from '../../assets/images/handbags.svg';
import watches from '../../assets/images/watches.svg';
import jewelery from '../../assets/images/jewellery.svg';
import art from '../../assets/images/art.svg';
import '../../components/clubrare-drops-list/drops-list.css';
import { AllcollectionCategory } from '../../redux';

export const ClubCategory = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(AllcollectionCategory());
  }, []);

  const allcategory = useSelector(
    (state: any) => state.categoryReducer.allcategoryitem,
  );

  const settings = {
    infinite: false,
    swipeToSlide: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 979,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 649,
        settings: {
          slidesToShow: 1.2,
        },
      },
    ],
  };

  return (
    <div className="clubcategory_wrp mt-5">
      <div className="container-fluid">
        <div className="clubcat_head_wrp justify-between items-center row">
          <div className="col-6 px-0 topcollection_head">
            <h2 className="Latest_Drops">Categories</h2>
          </div>
          <div className="col-6 px-0 text-right viewall_btn_wrp">
            <div className="viewall_btn_wrp">
              <button type="button" onClick={() => history.push('/explore')}>
                View All
              </button>
            </div>
          </div>
        </div>
        <div className="">
          <Slider {...settings} className="category_slider_wrp">
            {allcategory &&
              allcategory.length > 0 &&
              allcategory?.map((val: any, i: any) => {
                if (
                  val.name.toLowerCase() === 'jewelry' ||
                  val.name.toLowerCase() === 'sneakers' ||
                  val.name.toLowerCase() === 'watches' ||
                  val.name.toLowerCase() === 'handbags' ||
                  val.name.toLowerCase() === 'art / paintings'
                ) {
                  return (
                    <>
                      <div
                        key={i}
                        className="category_commwrp"
                        onClick={() =>
                          history.replace({
                            pathname: '/explore',
                            state: val.name.toLowerCase(),
                          })
                        }
                      >
                        <figure>
                          {val.name.toLowerCase() === 'jewelry' ? (
                            <img src={jewelery} alt="Jewelry" />
                          ) : val.name.toLowerCase() === 'sneakers' ? (
                            <img src={sneaker} alt={val.name.toLowerCase()} />
                          ) : val.name.toLowerCase() === 'watches' ? (
                            <img src={watches} alt="watches" />
                          ) : val.name.toLowerCase() === 'handbags' ? (
                            <img src={handbags} alt="handbags" />
                          ) : val.name.toLowerCase() === 'art / paintings' ? (
                            <img src={art} alt="art" />
                          ) : (
                            ''
                          )}
                        </figure>
                        <h6>
                          {val.name}
                        </h6>
                      </div>
                    </>
                  );
                }
              })}
          </Slider>
        </div>
      </div>
    </div>
  );
};
