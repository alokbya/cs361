// // src/components/CreateUserForm.tsx
// import { useState } from 'react';
// import { useCreateUser } from '../hooks/useUsers';

// export const CreateUserForm = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: ''
//   });

//   const createUser = useCreateUser();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     createUser.mutate(formData, {
//       onSuccess: () => {
//         // Reset form
//         setFormData({ name: '', email: '', password: '' });
//       },
//     });
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <input
//           type="text"
//           value={formData.name}
//           onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
//           placeholder="Name"
//         />
//       </div>
//       <div>
//         <input
//           type="email"
//           value={formData.email}
//           onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
//           placeholder="Email"
//         />
//       </div>
//       <div>
//         <input
//           type="password"
//           value={formData.password}
//           onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
//           placeholder="Password"
//         />
//       </div>
//       <button 
//         type="submit" 
//         disabled={createUser.status === 'loading'}
//       >
//         {createUser.isLoading ? 'Creating...' : 'Create User'}
//       </button>
//       {createUser.isError && (
//         <div style={{ color: 'red' }}>
//           Error: {createUser.error.message}
//         </div>
//       )}
//     </form>
//   );
// };