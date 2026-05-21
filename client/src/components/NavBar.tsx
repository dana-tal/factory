import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { NavLink } from 'react-router-dom';
import "./NavBar.css";

// The object may have a string link prop and in that case callback prop does not exist
// or the object may have a callback prop, in that case link prop does not exit 
type NavLinkItem =
  | {
      name: string;
      link: string;
      callback?: never;
    }
  | {
      name: string;
      callback: () => void;
      link?: never;
    };


type NavBarProps = {
  links: NavLinkItem[];
};

function NavBar({links}:NavBarProps ) {
   return (
    <Box className="navbar-container">
      <Stack className="navbar-stack" direction="row"   sx={{ flexWrap: 'wrap' ,gap:2, columnGap: 1, rowGap: { xs: 1, sm: 2 } }} >
        { links.map( link =>{ 
             
             if ( link.link)
             {
                return <Button key={link.name} variant="contained" className="navbar-button" component={NavLink} to={link.link}  >{link.name}</Button> 
             }
             else if (link.callback)
             {
                return <Button key={link.name} variant="contained" className="navbar-button" onClick={link.callback} >{link.name}</Button>
             }
        })
        }
      </Stack>
    </Box>
  );

}

export default NavBar