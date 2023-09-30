import './skeleton.css';
import ContentLoader from 'react-content-loader';

const CollectionsSkeleton = (props: any) => {
  return (
    <div className="flex items-center space-x-1">
      <ContentLoader
        // width={1000}
        width=""
        height={100}
        viewBox="0 0 1000 100"
        backgroundColor="#D0D0D0"
        foregroundColor="#D8D8D8"
        className="ContentLoader"
        {...props}
      >
        <circle cx="60" cy="25" r="25" className=" laptopshow" />
        <rect
          x="20"
          y="70"
          rx="4"
          ry="4"
          width="80"
          height="10"
          className=" laptopshow"
        />
        <rect
          x="35"
          y="90"
          rx="4"
          ry="4"
          width="50"
          height="10"
          className=" laptopshow"
        />

        <circle cx="190" cy="25" r="25" className="" />
        <rect
          x="150"
          y="70"
          rx="5"
          ry="5"
          width="80"
          height="10"
          className=""
        />
        <rect
          x="165"
          y="90"
          rx="5"
          ry="5"
          width="50"
          height="10"
          className=""
        />

        <circle cx="310" cy="25" r="25" className="mobileshow laptopshow" />
        <rect
          x="270"
          y="70"
          rx="5"
          ry="5"
          width="80"
          height="10"
          className="mobileshow laptopshow"
        />
        <rect
          x="283"
          y="90"
          rx="5"
          ry="5"
          width="50"
          height="10"
          className="mobileshow laptopshow"
        />

        <circle cx="420" cy="25" r="25" className="" />
        <rect
          x="380"
          y="70"
          rx="5"
          ry="5"
          width="80"
          height="10"
          className=""
        />
        <rect
          x="393"
          y="90"
          rx="5"
          ry="5"
          width="50"
          height="10"
          className=""
        />

        <circle cx="550" cy="25" r="25" className="mobileshow laptopshow" />
        <rect
          x="510"
          y="70"
          rx="5"
          ry="5"
          width="80"
          height="10"
          className="mobileshow laptopshow"
        />
        <rect
          x="523"
          y="90"
          rx="5"
          ry="5"
          width="50"
          height="10"
          className="mobileshow laptopshow"
        />

        <circle cx="690" cy="25" r="25" className="" />
        <rect
          x="650"
          y="70"
          rx="5"
          ry="5"
          width="80"
          height="10"
          className=""
        />
        <rect
          x="665"
          y="90"
          rx="5"
          ry="5"
          width="50"
          height="10"
          className=""
        />

        <circle cx="820" cy="25" r="25" className="mobileshow_480 laptopshow" />
        <rect
          x="780"
          y="70"
          rx="5"
          ry="5"
          width="80"
          height="10"
          className="mobileshow_480 laptopshow"
        />
        <rect
          x="794"
          y="90"
          rx="5"
          ry="5"
          width="50"
          height="10"
          className="mobileshow_480 laptopshow"
        />

        <circle cx="950" cy="25" r="25" className="" />
        <rect
          x="910"
          y="70"
          rx="5"
          ry="5"
          width="80"
          height="10"
          className=""
        />
        <rect
          x="925"
          y="90"
          rx="5"
          ry="5"
          width="50"
          height="10"
          className=""
        />
      </ContentLoader>
    </div>
  );
};

export default CollectionsSkeleton;
