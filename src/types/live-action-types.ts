export interface BidTimeObjProps {
  hoursLeft: number;
  minutesLeft: number;
  secondsLeft: number;
  daysLeft: number;
}

export interface BidTimeObjClsProps {
  hoursLeft1: number;
  minutesLeft1: number;
  secondsLeft1: number;
  daysLeft1: number;
}

export interface TokenPricePropsTypes{
    agovBal?:any;
    wethBal?:any;
    mpwrBal?:any;
    agovEthBal?:any;
}

export interface loadingPropsTypes{
  approved:boolean;
  buynowModel:boolean;
  detailsLoading:boolean;
  delistloading:boolean;
  historyLoad:boolean;
  offerLoad:boolean;
  bidOpen:boolean;
  loading:boolean;
  btnApprove:boolean;
  isLike:boolean;
  hideCursor:boolean
}