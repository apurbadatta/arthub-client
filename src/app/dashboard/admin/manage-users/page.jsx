"use client";
import { useState, useEffect } from "react";
import { FaSpinner, FaUserCheck, FaArrowRight } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/admin/users`);
      const result = await res.json();
      if (result.success) {
        setUsers(result.data);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Something went wrong while fetching users!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [baseUrl]);

  
  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      const res = await fetch(`${baseUrl}/api/admin/update-role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newRole }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Role updated successfully! 🎉");
        
     
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, role: newRole } : user
          )
        );
      } else {
        toast.error(data.error || "Failed to update role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Something went wrong!");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="w-full min-h-screen text-slate-200 p-6 space-y-6">
      <ToastContainer theme="dark" position="top-right" />

 
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Manage Users</h1>
        <p className="text-sm text-slate-400 mt-1">
          View, manage, update roles, and control all users.
        </p>
      </div>

      <div className="w-full border-t border-slate-800/60 my-2"></div>

  
      {loading ? (
        <div className="flex flex-col justify-center items-center py-24 text-indigo-500 space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500">Loading platform members...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 text-slate-500 border border-dashed border-slate-800 rounded-2xl bg-[#0b0f19]">
          No users found in the system database.
        </div>
      ) : (
      
        <div className="bg-[#0b111e] border border-slate-800/80 rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-[#111827]/60 tracking-wider">
                  <th className="py-4 px-6">Full Name</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Current Designation</th>
                  <th className="py-4 px-6 text-center">Modify Level Permission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-900/30 transition-all">
              
                    <td className="py-4 px-6 font-medium text-slate-100">
                      {user.name || "Anonymous User"}
                    </td>
                    
               
                    <td className="py-4 px-6 text-slate-400 font-mono">
                      {user.email}
                    </td>
              
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${
                          user.role === "admin"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            : user.role === "artist"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                        }`}
                      >
                        {user.role || "user"}
                      </span>
                    </td>
                    
              
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center min-w-[140px]">
                        {updatingId === user._id ? (
                          <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <select
                            value={user.role || "user"}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            className="bg-[#111827] border border-slate-800 text-slate-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 transition duration-150 cursor-pointer w-full max-w-[150px]"
                          >
                            <option value="user">User (Buyer)</option>
                            <option value="artist">Artist</option>
                            <option value="admin">Admin</option>
                          </select>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}