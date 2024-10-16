import React from 'react';

interface User {
    id: string;
    name: string;
}

interface UserListProps {
    users: User[];
    onSelectUser: (userId: string) => void;
}

export const UserList: React.FC<UserListProps> = ({ users, onSelectUser }) => {
    return (
        <div className="max-h-60 overflow-y-auto">
            <ul className="divide-y divide-gray-200">
                {users.map((user) => (
                    <li key={user.id} className="py-2">
                        <button
                            onClick={() => onSelectUser(user.id)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                        >
                            {user.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};