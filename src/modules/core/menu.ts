export interface MenuItem {
  id: string,
  type: string,
  label: string,
  route?: string,
  children?: MenuItem[]
}

export class Menu {
  constructor() { }

  // store newly added room tokens, keep track of rooms on list
  public static roomsOnList: Set<string> = new Set();

  public static menuList: MenuItem[] = [
    {
      id: 'dashboard',
      type: 'component',
      label: 'Dashboard',
      route: '/dashboard'
    },
    {
      id: 'chat-room',
      type: 'folder',
      label: 'Chat room',
      children: [
        {
          id: 'create-new-room',
          type: 'component',
          label: 'Create a new room',
          route: '/new-chatroom'
        },
        {
          id: 'join-room',
          type: 'component',
          label: 'Join a room',
          route: '/join-chatroom'
        }
      ]
    },
    {
      id: 'my-rooms',
      type: 'folder',
      label: 'My rooms',
      children: []
    }
  ];

  public static appendNewChildToList(room: MenuItem): void {
    Menu.menuList.forEach((item: MenuItem) => {
      if (item.id === 'my-rooms') {
        item.children?.push(room);
      }
    });
    // store the room token for the rerender of left-menu
    Menu.roomsOnList.add(room.id);
  }

}

