interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
  ownerAbilities: string[];
  customerAbilities: string[];
  getQuoteUrl: string;
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['Customer Service Representative'],
  customerRoles: ['Customer'],
  tenantRoles: ['Business Owner', 'Team Member', 'Customer Service Representative', 'IT Administrator'],
  tenantName: 'Organization',
  applicationName: 'Trains Tickets Booking Application',
  addOns: ['file upload', 'chat', 'notifications', 'file'],
  customerAbilities: ['Manage your account information', 'Book a ticket', 'View train schedule', 'View ticket status'],
  ownerAbilities: [
    'Manage user information',
    'Manage ticket bookings',
    'Read train and route information',
    'Manage organization information',
  ],
  getQuoteUrl: 'https://roq-wizzard-git-qa03-roqtech.vercel.app/proposal/96ed2fbb-0b4f-4ac6-ad6e-16fe9aac29b4',
};
