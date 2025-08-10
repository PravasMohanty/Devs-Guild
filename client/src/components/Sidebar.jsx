import React from 'react';

const Sidebar = ({ activeUsers }) => (
    <div className="w-70 bg-gray-800 p-5 border-r border-gray-700 overflow-y-auto md:block hidden">
        <h3 className="mb-4 text-amber-200 font-medium text-lg">
            Active Users ({activeUsers.length})
        </h3>
        <ul className="list-none p-0">
            {activeUsers.length > 0 ? (
                activeUsers.map((user, i) => (
                    <li key={i} className="p-2.5 mb-2 bg-gray-900 rounded-lg border border-gray-700 flex items-center">
                        <span className="w-2 h-2 bg-amber-300 rounded-full inline-block mr-2"></span>
                        <span className="text-amber-100">{user}</span>
                    </li>
                ))
            ) : (
                <li className="text-amber-300 text-center py-4">No users online</li>
            )}
        </ul>
    </div>
);

export default Sidebar;