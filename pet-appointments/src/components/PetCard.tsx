import { Card, Button, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { useLatestReminderEvent, useCreateReminderEvent } from '../hooks/useReminderEvents';
import { ReminderEventType } from '../interfaces/IReminderEvent';
import type IPet from '../interfaces/IPet';
import { useState } from 'react';
import PetDetailsModal from './PetDetailsModal';
import { apiClient } from '../api/client';
import { useRemovePet } from '../hooks/usePets';
// In PetCard.tsx
import { useSendNotification } from '../hooks/useNotifications';  // Add this import


interface PetCardProps {
  pet: IPet;
  userNames?: string[];
  currentUserId: string;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const PetCard = ({
  pet,
  userNames = [],
  currentUserId,
  onSuccess,
  onError
}: PetCardProps) => {
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const removePet = useRemovePet();  // Add our new hook
  const [isRemoving, setIsRemoving] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastFeedingEvent, setLastFeedingEvent] = useState<{ id: string; time: Date } | null>(null);
  const [isUndoing, setIsUndoing] = useState(false);
  const createEvent = useCreateReminderEvent();
  const { data: latestFeeding, refetch: refetchLatestFeeding } = useLatestReminderEvent(pet.id);
  const sendNotification = useSendNotification();

  // Add the notification handler
  const handleNotifyOwners = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking notify
    
    try {
      await sendNotification.mutateAsync({
        petName: pet.name,
        petId: pet.id,
        userIds: pet.userIds,
        currentUserId: currentUserId
      });
      onSuccess(`Other owners notified that ${pet.name} was fed`);
    } catch (error) {
      onError("Failed to send notifications");
    }
  };

  const handleRemove = async () => {
    try {
      await removePet.mutateAsync({ 
        petId: pet.id, 
        userId: currentUserId 
      });
      onSuccess(`Removed ${pet.name} from your pets`);
      setShowRemoveConfirm(false);
    } catch (error) {
      onError(`Failed to remove ${pet.name}. Please try again.`);
    }
  };

  const handleFeed = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking feed button
    try {
      const response = await createEvent.mutateAsync({
        petId: pet.id,
        userId: currentUserId,
        eventType: ReminderEventType.Feeding
      });
      setLastFeedingEvent({
        id: response.id,
        time: new Date(response.eventTime)
      });
      onSuccess(`Successfully fed ${pet.name}!`);
    } catch (error) {
      onError(`Failed to record feeding for ${pet.name}`);
    }
  };

  const handleUndo = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!lastFeedingEvent) return;
    
    setIsUndoing(true);
    try {
      await apiClient.delete(`/reminderevents/${lastFeedingEvent.id}`);
      setLastFeedingEvent(null);
      await refetchLatestFeeding();
      onSuccess(`Undid feeding for ${pet.name}`);
    } catch (error) {
      onError(`Failed to undo feeding for ${pet.name}`);
    } finally {
      setIsUndoing(false);
    }
  };

  const copyId = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when copying ID
    navigator.clipboard.writeText(pet.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatLastFed = (dateString: string) => {
    let utcDate = new Date(dateString);
    let localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
    let formattedDistance = formatDistanceToNow(localDate, { addSuffix: true });
    return formattedDistance;
  };

  return (
    <>
      <Card 
        className="h-100 shadow-sm hover:shadow-lg transition-shadow duration-200"
        onClick={() => setShowDetails(true)}
        style={{ cursor: 'pointer' }}
      >
        <Card.Body>
          <Card.Title className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center">
              <h3 className="h4 mb-0">{pet.name}</h3>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowRemoveConfirm(true);
                }}
                className="ms-2"
              >
                <i className="bi bi-trash3"></i>
              </Button>
            </div>
            <div className="d-flex align-items-center gap-2">
              {lastFeedingEvent && (
                <Button
                  variant="outline-secondary"
                  onClick={handleUndo}
                  disabled={isUndoing}
                  size="sm"
                >
                  {isUndoing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                      Undoing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-arrow-counterclockwise me-1"></i>
                      Undo Feed
                    </>
                  )}
                </Button>
              )}
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
              <Button
                variant="outline-primary"
                onClick={handleNotifyOwners}
                disabled={sendNotification.isPending || pet.userIds.length <= 1}
                size="sm"
              >
                {sendNotification.isPending ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Notifying...
                  </>
                ) : (
                  <>
                    <i className="bi bi-bell me-1"></i>
                    Notify
                  </>
                )}
              </Button>
            </div>
          </Card.Title>
          
          <Card.Text className="text-muted small mb-2">
            Created: {new Date(pet.createdAt).toLocaleDateString()}
          </Card.Text>

          <Card.Text className="text-muted small mb-2">
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-${pet.id}`}>
                  {copied ? 'Copied!' : 'Click to copy ID'}
                </Tooltip>
              }
            >
              <span 
                onClick={copyId} 
                style={{ cursor: 'pointer' }}
                className="d-inline-flex align-items-center"
              >
                <i className="bi bi-key-fill me-1"></i>
                ID: {pet.id}
                <i className="bi bi-clipboard ms-1" style={{ fontSize: '0.8em' }}></i>
              </span>
            </OverlayTrigger>
          </Card.Text>
          
          <Card.Text className={latestFeeding ? 'text-success mb-2' : 'text-muted mb-2'}>
            <i className="bi bi-clock-history me-1"></i>
            {latestFeeding ? (
              `Last fed: ${formatLastFed(latestFeeding.eventTime)}`
            ) : (
              'No feeding events recorded'
            )}
          </Card.Text>
          
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

      <PetDetailsModal
        show={showDetails}
        onHide={() => setShowDetails(false)}
        pet={pet}
        userNames={userNames}
      />

      {/* Remove Confirmation Modal */}
      <Modal 
        show={showRemoveConfirm} 
        onHide={() => setShowRemoveConfirm(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Remove Pet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to remove <strong>{pet.name}</strong> from your pets?</p>
          <p className="text-muted mb-0">
            This won't delete the pet, it will only remove your association with it. 
            {userNames.length > 1 && ` Other users will still have access to ${pet.name}.`}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowRemoveConfirm(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleRemove}
            disabled={removePet.isPending}  // Use mutation state instead of local state
          >
            {removePet.isPending ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Removing...
              </>
            ) : (
              'Remove'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PetCard;