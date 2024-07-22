import React, { useEffect, useState } from 'react';
import { UserMenuitems, AdminMenuitems } from './MenuItems';
import { useLocation } from 'react-router';
import { Box, List } from '@mui/material';
import NavItem from './NavItem';
import NavGroup from './NavGroup/NavGroup';

const SidebarItems = () => {
  const { pathname } = useLocation();
  const pathDirect = pathname;
  const [menu, setMenu] = useState([]);
  const [loop, setLoop] = useState(false);

  setTimeout(() => {
    setLoop(!loop)
  }, 1000);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole === "admin") { setMenu(AdminMenuitems); }
    else { setMenu(UserMenuitems) }
    console.log(userRole)
  }, [])

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        {menu?.map((item) => {
          // {/********SubHeader**********/}
          if (item.subheader) {
            return <NavGroup item={item} key={item.subheader} />;

            // {/********If Sub Menu**********/}
            /* eslint no-else-return: "off" */
          } else {
            return (
              <NavItem item={item} key={item.id} pathDirect={pathDirect} />
            );
          }
        })}
      </List>
    </Box>
  );
};
export default SidebarItems;
