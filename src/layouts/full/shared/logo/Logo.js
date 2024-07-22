import { Link } from 'react-router-dom';
import LogoDark  from 'src/assets/images/logos/dark-logo.png';
import { styled } from '@mui/material';

const LinkStyled = styled(Link)(() => ({
  height: '70px',
  width: '100%',
  display: 'flex',
  alignItems:'center',
  fontSize:'24px'
}));

const Logo = () => {
  return (
    <LinkStyled to="/">
      <img src={LogoDark} alt="" className='h-[70px] w-[70px]'/>
      <h1>SalesDriver</h1>
    </LinkStyled>
  )
};

export default Logo;
