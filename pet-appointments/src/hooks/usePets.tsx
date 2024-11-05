// src/hooks/usePets.ts
import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import { petService } from '../api/services/petService';
import type IPet from '../interfaces/IPet';
import type ICreatePetRequest from '../interfaces/requests/ICreatePetRequest';

// Get all pets for a specific user
export const usePets = (userId: string, options = {}) => {
  return useQuery({
    queryKey: ['pets', 'user', userId],
    queryFn: () => petService.getByUserId(userId),
    enabled: !!userId, // Only run query if userId exists
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    ...options
  });
};

// Get a single pet by ID
export const usePet = (petId: string) => {
  return useQuery({
    queryKey: ['pets', petId],
    queryFn: () => petService.getById(petId),
    enabled: !!petId,
  });
};

// Create a new pet
export const useCreatePet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newPet: ICreatePetRequest) => petService.create(newPet),
    onSuccess: (createdPet) => {
      // Update the pets list for the user who created the pet
      queryClient.invalidateQueries({ queryKey: ['pets', 'user', createdPet.userIds[0]] });
      // Also update the general pets list
      queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
};

// Update a pet
export const useUpdatePet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => 
      petService.update(id, name),
    onSuccess: (updatedPet) => {
      // Update specific pet in cache
      queryClient.setQueryData(['pets', updatedPet.id], updatedPet);
      // Invalidate all user-specific pet lists that might contain this pet
      updatedPet.userIds.forEach(userName => {
        queryClient.invalidateQueries({ queryKey: ['pets', 'user', userName] });
      });
      // Also invalidate the general pets list
      queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
};

export const useRemovePet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ petId, userId }: { petId: string; userId: string }) => 
      petService.removeUser(petId, userId),
    onSuccess: (_, { userId }) => {
      // Invalidate user's pets list
      queryClient.invalidateQueries({ queryKey: ['pets', 'user', userId] });
      // You might also want to invalidate the general pets list
      queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
};

// Get all pets
export const useAllPets = () => {
  return useQuery<IPet[], Error>({
    queryKey: ['pets'],
    queryFn: petService.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};

// Optional: Add a prefetch function
export const prefetchUserPets = async (queryClient: QueryClient, userId: string) => {
  await queryClient.prefetchQuery({
    queryKey: ['pets', 'user', userId],
    queryFn: () => petService.getByUserId(userId),
  });
};