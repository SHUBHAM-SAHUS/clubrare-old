import React, { useState, useEffect } from 'react';
import { imgConstants } from '../../assets/locales/constants';

function CategoriesFilter({
  categories,
  onSetCategories,
  otherUserProfile,
  listLoading,
  displayName,
  editCollection,
  showCollectionItem,
  selCategory,
}: any) {
  const [selectedCategory, setSelectedCategory] = useState(
    selCategory ? selCategory : 1,
  );

  const changeCategory = (key: number) => {
    if (!listLoading) {
      setSelectedCategory(key);
      onSetCategories(key);
    }
  };

  useEffect(() => {
    if (otherUserProfile) {
      setSelectedCategory(2);
    }
  }, [otherUserProfile]);

  useEffect(() => {
    if (selCategory) {
      setSelectedCategory(selCategory);
    }
  }, [selCategory]);

  return (
    <>
      <div className="club_viewprofilalltabwrp">
        {categories.map((i: any) => (
          <div
            key={i.key}
            className={`profiletabwrp ${
              i.key === 5 &&
              displayName &&
              showCollectionItem &&
              `collection_list`
            } ${i.key === selectedCategory ? 'active-tab' : ''}`}
            onClick={() => changeCategory(i.key)}
          >
            <div className={`category-name cattab-${i.key} `}>
              <span>{i.title}</span>
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: 'table',
          marginTop: '27px',
        }}
      >
        {categories.map((k: any) => (
          <div key={k.key}>
            <div className={`category-name cattab-${k.key} `}>
              {k.key === 5 && displayName && showCollectionItem && (
                <>
                  <span>{k.title}</span>
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="mycollectionfinal"
                    style={{
                      display: 'inline-flex',
                      marginLeft: '10px',
                    }}
                  >
                    <img
                      className="collectarricon"
                      src={imgConstants.arrow}
                      onClick={editCollection}
                      alt="arrow"
                    />
                    <span
                      className="collection_name profiletabwrp"
                      style={{
                        marginLeft: '1px',
                        fontSize: '14px',
                        marginTop: '-4px',
                        color: '#202020',
                      }}
                    >
                      {displayName}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export { CategoriesFilter };
