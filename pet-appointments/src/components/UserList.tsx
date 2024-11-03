// src/components/UserList.tsx
import { useUsers } from '../hooks/useUsers';

export const UserList = () => {
  const { 
    data: users, 
    isLoading, 
    isError, 
    error 
  } = useUsers();

  if (isLoading) return <div>Loading users...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {users?.map(user => (
        <li key={user.id}>{user.name} ({user.email})</li>
      ))}
    </ul>
  );
};