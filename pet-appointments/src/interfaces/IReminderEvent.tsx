export default interface IReminderEvent {
  id: string;
  eventType: 'Feeding' | 'Walk';
  eventTime: string;
  userName: string;
  petName: string;
}