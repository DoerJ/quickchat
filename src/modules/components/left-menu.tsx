import React from "react";
import { useLocation, Link, withRouter } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';

import { Menu } from '../../script-model';
import { MenuItem } from '../core/menu';
import { EventService } from '../../script-model';

const useStyles = makeStyles((theme: any) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  link: {
    textDecoration: 'none',
    color: '#000000'
  }
}));

function LeftMenu() {

  const classes = useStyles();
  // initialize folder open status
  const openFolder: any = {
    'chatroom': true,
    'my-rooms': true
  }

  const [appendNewChilds, setAppendNewChilds] = React.useState(false);
  const [hideMenu, setHideMenu] = React.useState(true);
  const [open, setOpen] = React.useState(openFolder);
  const [selectedIndex, setSelectedIndex] = React.useState('dashboard');

  var menuList: any[] = [];
  var handleClick = (item: MenuItem) => {
    // if the clicked item is a component type
    if (item.type === 'component') {
      setSelectedIndex(item.id);
    }
    // if the clicked item is a folder type
    else {
      setOpen((prevOpens: any) => ({
        ...prevOpens,
        [item.id]: !prevOpens[item.id]
      }));
    }
  };

  // subscribe to route change, and set menu hidden state
  const location = useLocation();
  React.useEffect(() => {                                                                                   
    let pathname = location.pathname;
    if (pathname !== '/' && pathname !== '/auth') {
      setHideMenu(false);
    }
  }, [location]);

  // subscribe to new room event 
  React.useEffect(() => {
    EventService.newRoomAddedToList.subscribe((room: MenuItem) => {
      console.log('subscribe to room create')
      if (!Menu.roomsOnList.has(room.id)) {
        Menu.appendNewChildToList(room);
        setAppendNewChilds(true);
        // set selected index to the new room item 
        setSelectedIndex(room.id);
      }
    });
  });

  var generateMenuList = () => {
    Menu.menuList.forEach((item: any) => {
      if (item.type === 'folder') {
        let folderMenuItem = (
          <ListItem key={item.id} button onClick={() => handleClick(item)}>
            <ListItemText primary={item.label} />{open[item.id] ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
        );
        let folderSubmenuItem = (
          <Collapse in={open[item.id]} timeout="auto" unmountOnExit> 
            <List component="div" disablePadding>
              {item.children.map((subitem: any) => (
                <Link to={subitem.route} className={classes.link}>
                  <ListItem key={subitem.id} button className={classes.nested} selected={selectedIndex === subitem.id} onClick={() => handleClick(subitem)}>
                    <ListItemText primary={subitem.label} />
                  </ListItem>
                </Link>
              ))}
            </List>
          </Collapse>
        );
        menuList.push(folderMenuItem, folderSubmenuItem);
      }
      else if (item.type === 'component') {
        menuList.push(
          <Link to={item.route} className={classes.link}>
            <ListItem key={item.id} selected={selectedIndex === item.id} button onClick={() => handleClick(item)}>
              <ListItemText primary={item.label} />
            </ListItem>
          </Link>
        );
      }
    });
  }

  generateMenuList();

  const hiddenLeftMenu = (<div></div>);
  var showLeftMenu = (
    <div className="full-height">
      <List component="nav" aria-labelledby="nested-list-subheader" className={classes.root}>
        {menuList}
      </List>
    </div>
  );

  return hideMenu ? hiddenLeftMenu : showLeftMenu;
}

export default withRouter(LeftMenu)