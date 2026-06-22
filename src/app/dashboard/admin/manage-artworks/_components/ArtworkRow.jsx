"use client";
import Link from "next/link";

export default function ArtworkRow({ art, onApprove, onDeleteClick, actionLoadingId }) {
  return (
    <tr className="hover:bg-slate-900/30 transition-all border-b border-slate-800/40">

      <td className="py-4 px-6 font-medium text-slate-100 flex items-center gap-3">
        <img 
          src={art.image} 
          alt={art.title} 
          className="w-10 h-10 object-cover rounded-md border border-slate-800 bg-slate-900"
        />
        <span className="font-semibold text-sm max-w-[180px] truncate">{art.title}</span>
      </td>

      <td className="py-4 px-6 text-slate-400">
        {art.artistName || "Unknown Artist"}
        <div className="text-[10px] text-slate-500 font-mono">{art.artistEmail}</div>
      </td>
      
      <td className="py-4 px-6 font-bold text-emerald-400">
        ${art.price}
      </td>

   
      <td className="py-4 px-6">
        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
          art.status === "approved" 
            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
        }`}>
          {art.status || "pending"}
        </span>
      </td>
      

      <td className="py-4 px-6 text-center">
        <div className="flex items-center justify-center gap-2">
          {actionLoadingId === art._id ? (
            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              {art.status !== "approved" && (
                <button
                  onClick={() => onApprove(art._id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded transition text-[11px]"
                >
                  Approve
                </button>
              )}
              
           
              <Link
                href={`/dashboard/admin/manage-artworks/edit/${art._id}`} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-2.5 py-1 rounded transition text-[11px]"
              >
                Edit
              </Link>

              <button
                onClick={() => onDeleteClick(art)}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-2.5 py-1 rounded transition text-[11px]"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}