import './error-fallback.scss';

export const ErrorFallback = ({ error }: any) => {
  return (
    <div className="container-fluid">
      <div role="alert" className="fallback_ui_wrp">
        <div className="fallback_ui_inn">
          <h4>Something went wrong:</h4>
          <p style={{ color: 'red' }}>{error.message}</p>
        </div>
      </div>
    </div>
  );
};
