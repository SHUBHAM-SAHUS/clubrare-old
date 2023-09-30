import styled, { keyframes } from 'styled-components';
import SVG from 'react-inlinesvg';
import { imgConstants } from '../../assets/locales/constants';
const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;
const Wrapper = styled.div`
  width: ${({ size }: any) => size};
  height: ${({ size }: any) => size};
  margin-right: ${({ margin }: any) => margin};
  animation: ${spin} 0.6s linear infinite forwards;
  transform-origin: center center;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Loading = (props: any) => {
  return (
    <Wrapper className={'text-white'} {...props}>
      <SVG src={imgConstants.loading} width={'100%'} height={'100%'} />
    </Wrapper>
  );
};
export { Loading };
