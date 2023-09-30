import Footer from '../../components/footer/footer';
import Layout from '../../layouts/main-layout/main-layout';
import './metaverse-items.scss';
import MetaverseImage from '../../assets/images/metaverse-nft-token.png';
import { getWeb3, metaverseItemEthContract } from '../../service/web3-service';
import { useToasts } from 'react-toast-notifications';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getWhiteListedStatusforMpwrAction } from '../../redux';
import erc20Artifacts from '../../smart-contract/erc-token.json';
import { useCommonWalletConnection, useCustomStableCoin } from '../../hooks';
import { getEditProfileAction } from '../../redux';

const MetaverseItems = () => {
    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const [currTokenPrice, setCurrTokenPrice] = useState<number>(0)
    const [currUserBal, setCurrUserBal] = useState<number>(0)
    const [merkleProof, setMerkleProof] = useState<string>()
    const [checkWhiteList, setCheckWhiteList] = useState<boolean>(false);
    const [checkAlreadyMinted, setCheckAlreadyMinted] = useState<boolean>(false);

    const ethMetaverseAdd = process.env.REACT_APP_ETH_METAVERSE_ADDRESS;
    const mpwr_token_address = process.env.REACT_APP_TOKEN_MPWR_CONTRACT_ADDRESS;
    const wallet_address = localStorage.getItem('Wallet Address')?.toLowerCase();

    const userConnected = useSelector(
        (state: any) => state.headerReducer.isConnected,
    );

    const { metamaskClickHandler ,checkValidUser} = useCommonWalletConnection(() => {}, getEditProfileAction);

    const { customFromWei, customToWei } = useCustomStableCoin();
  
    const getMpwrBalance = async () => {
        const { web3 }: any = await getWeb3();
        const erc20Contract = new web3.eth.Contract(
          erc20Artifacts.abi,
          mpwr_token_address,
        );
        try {
          const res = await erc20Contract.methods.balanceOf(wallet_address).call();
          const bal = await customFromWei(res, web3, mpwr_token_address);
          setCurrUserBal(bal);
          return true;
        } catch (err) {
            return false;
        }
    };

    const getMpwrTokenPrice = async () => {
        try {
            const { web3 }: any = await getWeb3();
            const { metaverseItemEthContr }: any = await metaverseItemEthContract(
                ethMetaverseAdd,
            );
            const res = await metaverseItemEthContr.methods.tokenPrice().call();
            if(res) {
                const bal = await customFromWei(res, web3, mpwr_token_address);
                setCurrTokenPrice(bal);
                return true;
            }
        } catch (err) {
            return false;
        }
    }

    const getWhiteListUser = async (merkleProofVal:string) => {
        try {
            const { metaverseItemEthContr }: any = await metaverseItemEthContract(
                ethMetaverseAdd,
            );
            const isWhitelist = await metaverseItemEthContr.methods.isWhitelist(wallet_address, merkleProofVal).call();
            const alreadyMinted = await metaverseItemEthContr.methods.hasMinted(wallet_address).call();
            if(alreadyMinted) {
                setCheckAlreadyMinted(alreadyMinted)
            }
            if(isWhitelist) {
                setCheckWhiteList(isWhitelist)
            }
            return true;
        } catch (err) {
            return false;
        }
    }

    const getMerkleProofHandler = async () => {
        try {
            const result: any = await dispatch(getWhiteListedStatusforMpwrAction());
            if(result) {
                setMerkleProof(result.data.merkle_proof);
                await getWhiteListUser(result.data.merkle_proof);
                return true;
            }
        } catch (err) {
            return false;
        }
    }

    const checkUserBalanceAllowance = async (tokenAmount:string) => {
        try {
            const { web3 }: any = await getWeb3();
            const erc20Contract = new web3.eth.Contract(
                erc20Artifacts.abi,
                mpwr_token_address,
            );
            const allowance = await erc20Contract.methods.allowance(wallet_address, ethMetaverseAdd).call();
            if(Number(currTokenPrice) > Number(allowance)) {
                const res = await erc20Contract.methods.approve(ethMetaverseAdd, tokenAmount).send({ from: wallet_address });
                if(res) {
                    return true;
                }
            } else {
                return true;
            }
        } catch (err) {
            return false;   
        }
    }

    const MintHandler = async () => {
        if (userConnected) {
            const IsValidUser = await checkValidUser('1');
            if(IsValidUser){
                if(!checkWhiteList) {
                    addToast("You are not a whitelist user.", {
                        appearance: 'error',
                        autoDismiss: true,
                    });
                    return false;
                } else if(checkAlreadyMinted) {
                    addToast("You have already minted this item.", {
                        appearance: 'error',
                        autoDismiss: true,
                    });
                    return false;
                } else if(Number(currUserBal) < Number(currTokenPrice)) {
                    addToast("You don't have enough balance to mint this item.", {
                        appearance: 'error',
                        autoDismiss: true,
                    });
                    return false;
                } else {
                    try {
                        setLoading(true);
                        const { web3 }: any = await getWeb3();
                        const tokenAmount = await customToWei(currTokenPrice, web3, mpwr_token_address);
                        const res = await checkUserBalanceAllowance(tokenAmount);
                        if(res) {
                            const { metaverseItemEthContr }: any = await metaverseItemEthContract(
                                ethMetaverseAdd,
                            );
                            const res = await metaverseItemEthContr.methods.privateMint('QmcSxeQdKCCBqZtr1Qbok44zm2iTS9dMkACVbqBvriWMEf', merkleProof).send({ from: wallet_address });
                            if (res) {
                                setLoading(false);
                                addToast(`Mint successfully and transaction hash is ${res.transactionHash}.`, {
                                    appearance: 'success',
                                    autoDismiss: true,
                                });
                            }
                        } else {
                            addToast("There is some issue, Please try again later.", {
                                appearance: 'error',
                                autoDismiss: true,
                            });
                            setLoading(false);
                            return false;
                        }
                    } catch (err: any) {
                        addToast(err.message, {
                            appearance: 'error',
                            autoDismiss: true,
                        });
                        setLoading(false);
                    }
                }
            }
        } else {
            await metamaskClickHandler();
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await getMpwrBalance();
            await getMpwrTokenPrice();
            await getMerkleProofHandler();
        }
        fetchData();
    }, [])

    return (
        <>
        <Layout mainClassName="metaverse_items_wrp">
            <div className="container">
                <div className="metaverse_item_inn row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <img src={MetaverseImage} alt="Metaverse" />
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h1>Mint metaverse NFT</h1>
                        <button type="button" onClick={MintHandler} className={`metaverse-mint-btn ${loading ? 'disabled' : ''}`}>
                            {loading ? 'Loading...' : 'Mint'}
                        </button>
                        <span><strong>Note:</strong> You need to have at least {Number(currTokenPrice)?.toFixed(4)} MPWR for mint.</span>
                    </div>
                </div>
            </div>
        </Layout>
        <Footer />
        </>
    );
};

export default MetaverseItems;
