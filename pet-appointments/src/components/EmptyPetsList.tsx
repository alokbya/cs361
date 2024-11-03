// src/components/EmptyPetsList.tsx
const EmptyPetsList = () => {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Pets Found</h3>
        <p className="text-gray-500">
          This user doesn't have any pets yet. Add a pet using the button above!
        </p>
      </div>
    );
  };

export default EmptyPetsList;