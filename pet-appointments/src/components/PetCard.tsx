// src/components/PetCard.tsx
import { useUsers } from '../hooks/useUsers';
import IPet from "../interfaces/IPet";

interface IPetCardProps {
  pet: IPet;
}

const PetCard = ({ pet }: IPetCardProps) => {
  // Fetch all users to get names (you might want to optimize this later)
  const { data: users } = useUsers();

  // Convert userIds to names
  const userNames = pet.userIds
    .map(id => users?.find(u => u.id === id)?.name ?? 'Unknown User')
    .filter(name => name !== 'Unknown User');

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-xl font-semibold mb-2">{pet.name}</h3>
      <div className="text-gray-600">
        <p>Created: {new Date(pet.createdAt).toLocaleDateString()}</p>
        <p>Shared with: {userNames.length > 0 ? userNames.join(', ') : 'No other users'}</p>
      </div>
    </div>
  );
};

export default PetCard;