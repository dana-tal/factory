import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { NavLink } from 'react-router-dom';
import "./NavBar.css";


function NavBar({ links }) {
   return (
    <Box className="navbar-container">
      <Stack className="navbar-stack" direction="row"  gap={2}>
        { links.map( link =>{ 
             
             if ( link.link)
             {
                return <Button key={link.name} variant="contained" className="navbar-button" component={NavLink} to={link.link} end >{link.name}</Button> 
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