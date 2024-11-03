// src/components/PetCard.tsx
import { Card, Button } from 'react-bootstrap';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { ReminderEventType } from '../interfaces/IReminderEvent';
import IPet from '../interfaces/IPet';
import { useCreateReminderEvent } from '../hooks/useReminderEvents';

interface PetCardProps {
  pet: IPet;
  userNames?: string[];
  currentUserId: string;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  latestFeeding?: { eventTime: string } | null;
}

const PetCard = ({
  pet,
  userNames = [],
  currentUserId,
  onSuccess,
  onError,
  latestFeeding
}: PetCardProps) => {
  const createEvent = useCreateReminderEvent();

  const handleFeed = async () => {
    try {
      await createEvent.mutateAsync({
        petId: pet.id,
        userId: currentUserId,
        eventType: ReminderEventType.Feeding
      });
      onSuccess(`Successfully fed ${pet.name}!`);
    } catch (error) {
      onError(`Failed to record feeding for ${pet.name}`);
    }
  };

  const formatLastFed = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <Card className="h-100 shadow-sm hover:shadow-lg transition-shadow duration-200">
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="h4 mb-0">{pet.name}</h3>
          <Button
            variant="primary"
            onClick={handleFeed}
            disabled={createEvent.isPending}
            size="sm"
          >
            {createEvent.isPending ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Feeding...
              </>
            ) : (
              'Feed'
            )}
          </Button>
        </Card.Title>
        
        <Card.Text className="text-muted small mb-2">
          Created: {new Date(pet.createdAt).toLocaleDateString()}
        </Card.Text>
        
        {latestFeeding && (
          <Card.Text className="text-success mb-2">
            <i className="bi bi-clock-history me-1"></i>
            Last fed: {formatLastFed(latestFeeding.eventTime)}
          </Card.Text>
        )}
        
        {userNames.length > 0 && (
          <div className="mt-3">
            <small className="text-muted d-block mb-1">Shared with:</small>
            <div className="d-flex flex-wrap gap-1">
              {userNames.map(name => (
                <span key={name} className="badge bg-light text-dark">
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default PetCard;