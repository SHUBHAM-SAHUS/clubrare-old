import { memo, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import '../authentication-lists.scss';
import { addAuthenticationPurchaseAction } from '../../../redux';
import { useToasts } from 'react-toast-notifications';

interface AddAuthenticationProps {
  show: boolean
  onHide: () => void
  getLists: () => void
}
const AddAuthenticationModal = (props: AddAuthenticationProps) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalAuthentication, setTotalAuthentication] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [error, setError] = useState({
    walletAddress: '',
    totalAuthentication: ''    
  });
  const { addToast } = useToasts();
  const inputClickHandler = async (event: any) => {    
    const { name, value } = event.target;
    switch (name) {
      case 'walletAddress':        
        if (value === '' || value == null || !value) {
          if (!walletAddress) {
            setError({ ...error, walletAddress: 'Please enter valid wallet address' });            
          }
        } else {
          setError({ ...error, walletAddress: '' });
        }
        setWalletAddress(value);
        break;
      case 'totalAuthentication':
        if (value === '') {
          setError({ ...error, totalAuthentication: 'Please enter valid number' });
        } else {
          setError({ ...error, totalAuthentication: '' });
        }
        setTotalAuthentication(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e:any) => {    
    e.preventDefault();
    setIsLoading(true)
    let isError = false
    if (!walletAddress || walletAddress === '' || !walletAddress.startsWith('0x')) {
      isError = true
      setError({
        ...error,
        walletAddress: 'Please enter valid wallet address'
      })
    } else if (!totalAuthentication || totalAuthentication === '') {
      isError = true
      setError({
        ...error,
        totalAuthentication: 'Please enter valid number'
      })
    }
    if (!isError) {
      const data = {
        wallet_address: walletAddress,
        total_purchase: totalAuthentication
      }
      const result:any = await dispatch(addAuthenticationPurchaseAction(data))
      if(result.status) {
        addToast(`Authentication item added successfully`, {
          appearance: 'success',
          autoDismiss: true,
        });        
      } else {
        addToast(result.message, {
          appearance: 'error',
          autoDismiss: true,
        });
      }
      await props.getLists();
      setIsLoading(false);
      props.onHide();
    } else {
      setIsLoading(false)
    }
  }
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="editdetailitem_modal"
    >
      <Modal.Header closeButton>
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="title_heading"
        >
          Add Authentication
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <form onSubmit={(e) => handleSubmit(e)} >
        <div className="form-group">
          <label htmlFor="walletAddress">Wallet Address</label>
          <input type="text" className="form-control" name='walletAddress' id="walletAddress" value={walletAddress} placeholder="Wallet Address" onChange={(e) => {inputClickHandler(e);}} aria-describedby='walletAddressError' />
          <small id="walletAddressError" className="text-red justify-self-start mt-2 pl-2">{error.walletAddress}</small>
        </div>
        <div className="form-group">
          <label htmlFor="totalAuthentication">Total Authentication</label>
          <input type="number" className="form-control" name='totalAuthentication' id="totalAuthentication" value={totalAuthentication} placeholder="Total Authentication" onChange={(e) => {
                    inputClickHandler(e);
                  }} aria-describedby='totalAuthenticationError' />          
          <small id="totalAuthenticationError" className="text-red justify-self-start mt-2 pl-2">{error.totalAuthentication}</small>
        </div>        
        <button type="submit" className=" addAuthenticationBtn" disabled={isLoading ?? false}>{isLoading ? 'Loading...' : 'Submit'}</button>
      </form>
      </Modal.Body>
    </Modal>
  );
};

export default memo(AddAuthenticationModal);
