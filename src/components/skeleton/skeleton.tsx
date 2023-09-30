import './skeleton.css';

const Skeleton = ({ type }: any) => {
  return (
    <div className="skeleton">
      <div className={type}> </div>
    </div>
  );
};

export default Skeleton;
