"use client";
import { useState, useTransition } from "react";
import { submitAttendanceAction } from "@/actions/attendance-actions";
import type { AttendanceSheet } from "@/lib/api/types";

export default function SubmitAttendanceCard({ sheet }: { sheet: AttendanceSheet }) {
  const [isPresent, setIsPresent] = useState(true);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [notes, setNotes] = useState("");
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(sheet.isSubmitted);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await submitAttendanceAction({
        sheetId: sheet.id,
        isPresent,
        checkIn: isPresent ? checkIn : undefined,
        checkOut: isPresent ? checkOut : undefined,
        notes: !isPresent ? notes : undefined
      });
      if (res.success) {
        setMessage("Submitted successfully!");
        setSubmitted(true);
      } else {
        setMessage(res.message || "An error occurred.");
      }
    });
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 p-6 rounded-xl shadow-sm">
        <h3 className="font-semibold text-green-800 text-lg">{sheet.title}</h3>
        <p className="text-sm text-slate-600 mt-1">{sheet.date}</p>
        <p className="text-sm text-green-700 mt-3 font-medium">
          You have already submitted your attendance for this sheet.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">{sheet.title}</h3>
        <p className="text-sm text-slate-500">{sheet.date}</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button 
          type="button" 
          onClick={() => setIsPresent(true)} 
          className={`flex-1 py-3 rounded-lg font-medium border transition-colors ${
            isPresent 
              ? 'bg-green-50 border-green-500 text-green-700' 
              : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Present
        </button>
        <button 
          type="button" 
          onClick={() => setIsPresent(false)} 
          className={`flex-1 py-3 rounded-lg font-medium border transition-colors ${
            !isPresent 
              ? 'bg-red-50 border-red-500 text-red-700' 
              : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Absent
        </button>
      </div>

      {isPresent ? (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Check In</label>
            <input 
              type="time" 
              value={checkIn} 
              onChange={e => setCheckIn(e.target.value)} 
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Check Out</label>
            <input 
              type="time" 
              value={checkOut} 
              onChange={e => setCheckOut(e.target.value)} 
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
            />
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Absence</label>
          <textarea 
            value={notes} 
            onChange={e => setNotes(e.target.value)} 
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-vertical" 
            rows={2} 
          />
        </div>
      )}

      {message && (
        <p className={`text-sm mb-3 ${message.includes("successfully") ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}

      <button 
        type="submit" 
        disabled={pending} 
        className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium transition-colors"
      >
        {pending ? "Submitting..." : "Submit Attendance"}
      </button>
    </form>
  );
}