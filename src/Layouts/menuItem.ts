import { MenuItemType } from '@paljs/ui/types';

const items: MenuItemType[] = [
  {
    title: 'Home Page',
    icon: { name: 'home' },
    link: { href: '/dashboard' },
  },
  {
    title: 'Clubs',
    icon: { name: 'keypad-outline' },
    link: { href: '/clubs/list' },
  },
  {
    title: 'Establishments',
    icon: { name: 'keypad-outline' },
    link: { href: '/establishments' },
  },
  {
    title: 'Users',
    icon: { name: 'keypad-outline' },
    link: { href: '/users/list' },
  },
  {
    title: 'Notifications',
    icon: { name: 'keypad-outline' },
    link: { href: '/notifications/list' },
  },
  {
    title: 'wallet',
    icon: { name: 'keypad-outline' },
    link: { href: '/wallet/list' },
  },
  {
    title: 'Bookings',
    icon: { name: 'keypad-outline' },
    link: { href: '/bookings/list' },
  },
  {
    title: 'Sports',
    icon: { name: 'keypad-outline' },
    link: { href: '/sports/list' },
  },
  {
    title: 'Currencies',
    icon: { name: 'keypad-outline' },
    link: { href: '/currencies/list' },
  }
];

export default items;
