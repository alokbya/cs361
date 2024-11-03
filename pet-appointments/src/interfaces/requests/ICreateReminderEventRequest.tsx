export default interface ICreateReminderEventRequest {
    petId: string;
    userId: string;
    eventType: 'Feeding' | 'Walk';
}