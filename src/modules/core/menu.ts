export interface MenuItem {
  id: string,
  type: string,
  label: string,
  route?: string,
  children?: MenuItem[]
  icon?: string
}

export class Menu {
  constructor() { }

  // store newly added room tokens, keep track of rooms on list
  // the key is the room token number, and the value tells whether the room has ever been joined 
  // for broadcasting join event
  public static roomsOnList: Map<string, boolean> = new Map();

  public static menuList: MenuItem[] = [
    {
      id: 'dashboard',
      type: 'component',
      label: 'Dashboard',
      route: '/dashboard',
      icon: 'home'
    },
    {
      id: 'chat-room',
      type: 'folder',
      label: 'Chat room',
      icon: 'chatroom',
      children: [
        {
          id: 'create-new-room',
          type: 'component',
          label: 'Create a new room',
          route: '/new-chatroom',
          icon: 'create-chatroom'
        },
        {
          id: 'join-room',
          type: 'component',
          label: 'Join a room',
          route: '/join-chatroom',
          icon: 'join-chatroom'
        }
      ]
    },
    {
      id: 'my-rooms',
      type: 'folder',
      label: 'My rooms',
      children: [],
      icon: 'my-rooms'
    }
  ];

  public static appendNewChildToList(room: MenuItem): void {
    Menu.menuList.forEach((item: MenuItem) => {
      if (item.id === 'my-rooms') {
        item.children?.push(room);
      }
    });
    // store the room token for the rerender of left-menu
    Menu.roomsOnList.set(room.id, false);
  }

}

