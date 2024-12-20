import { Modal, Table, Badge } from 'react-bootstrap';
import { useReminderEvents } from '../hooks/useReminderEvents';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import type IPet from '../interfaces/IPet';
import { ReminderEventType } from '../interfaces/IReminderEvent';
import type IReminderEvent from '../interfaces/IReminderEvent';

interface PetDetailsModalProps {
    show: boolean;
    onHide: () => void;
    pet: IPet;
    userNames: string[];
  }
  
  const PetDetailsModal = ({ 
    show, 
    onHide, 
    pet,
    userNames
  }: PetDetailsModalProps) => {
    const { data: events, isLoading } = useReminderEvents(pet.id);
  
    const formatEventTime = (dateString: string) => {
      return {
        absolute: new Date(new Date(dateString).getTime() - new Date(dateString).getTimezoneOffset() * 60000).toLocaleString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
        relative: formatDistanceToNow(new Date(new Date(dateString).getTime() - new Date(dateString).getTimezoneOffset() * 60000), { addSuffix: true })
      };
    };
  
    const getEventTypeDisplay = (eventType: ReminderEventType | number): string => {
      // Handle both enum and number cases
      if (typeof eventType === 'number') {
        return ReminderEventType[eventType] || 'Unknown';
      }
      return eventType; // Assume string
    };
  
    const getEventBadgeColor = (eventType: ReminderEventType | number) => {
      const type = typeof eventType === 'number' ? eventType : ReminderEventType[eventType];
      switch (type) {
        case ReminderEventType.Feeding:
          return 'success';
        case ReminderEventType.Walk:
          return 'primary';
        default:
          return 'secondary';
      }
    };
  
    return (
      <Modal show={show} onHide={onHide} size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center gap-2">
            <span>{pet.name}</span>
            <Badge bg="secondary" className="fs-6">ID: {pet.id}</Badge>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4">
            <h6 className="text-muted mb-2">Shared with</h6>
            <div className="d-flex flex-wrap gap-2">
              {userNames.map(name => (
                <Badge key={name} bg="info">{name}</Badge>
              ))}
            </div>
          </div>
  
          <h6 className="text-muted mb-3">Event History</h6>
          {isLoading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : !events?.length ? (
            <div className="text-center py-4 text-muted">
              <i className="bi bi-calendar-x display-4 d-block mb-3"></i>
              No events recorded
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead>
                  <tr>
                    <th className="text-center">Event</th>
                    <th>When</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event: IReminderEvent) => {
                    const time = formatEventTime(event.eventTime);
                    return (
                      <tr key={event.id}>
                        <td className="text-center" style={{ width: '140px' }}>
                          <Badge bg={getEventBadgeColor(event.eventType)}>
                            {getEventTypeDisplay(event.eventType)}
                          </Badge>
                        </td>
                        <td>
                          <div>{time.absolute}</div>
                          <small className="text-muted">{time.relative}</small>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
  
          <div className="mt-3 text-muted small">
            <i className="bi bi-info-circle me-2"></i>
            Created {formatDistanceToNow(new Date(new Date(pet.createdAt).getTime() - new Date(pet.createdAt).getTimezoneOffset() * 60000), { addSuffix: true })}
          </div>
        </Modal.Body>
      </Modal>
    );
  };
  
  export default PetDetailsModal;