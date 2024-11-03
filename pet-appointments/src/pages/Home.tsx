import { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { usePets } from '../hooks/usePets';
import { Button } from 'react-bootstrap';
import IUser from '../interfaces/IUser';
import IPet from '../interfaces/IPet';
import PetCard from '../components/PetCard';
import EmptyPetsList from '../components/EmptyPetsList';
import AddPetModal from '../components/AddPetModal';

export const Home = () => {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  
  const { data: users, isLoading: isLoadingUsers, error: userError } = useUsers();
  const { 
    data: pets, 
    isLoading: isLoadingPets 
  } = usePets(selectedUserId, { enabled: !!selectedUserId });

  if (isLoadingUsers) return <div>Loading users...</div>;
  if (userError) return <div>Error loading users</div>;

  return (
    <div className="container mx-auto p-4">
      {/* User Selection and Add Pet Button Row */}
      <div className="mb-6 d-flex align-items-end gap-3">
        <div className="flex-grow-1">
          <label 
            htmlFor="userSelect" 
            className="form-label"
          >
            Select User
          </label>
          <select
            id="userSelect"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="form-select"
          >
            <option value="">Select a user...</option>
            {users?.map((user: IUser) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        
        <Button
          variant="primary"
          onClick={() => setShowAddPetModal(true)}
          disabled={!selectedUserId}
        >
          Add Pet
        </Button>
      </div>

      {/* Pet Cards Grid */}
      <div className="row g-4">
        {isLoadingPets ? (
          <div>Loading pets...</div>
        ) : !pets?.length ? (
          <EmptyPetsList />
        ) : (
          pets.map((pet: IPet) => (
            <div key={pet.id} className="col-12 col-md-6 col-lg-4">
              <PetCard pet={pet} />
            </div>
          ))
        )}
      </div>

      {/* Add Pet Modal */}
      <AddPetModal
        show={showAddPetModal}
        onHide={() => setShowAddPetModal(false)}
        userId={selectedUserId}
      />
    </div>
  );
};

export default Home;