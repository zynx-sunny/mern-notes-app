import React, { useEffect, useState } from "react";
import axios from "axios";

const NoteModal = ({ isOpen, onClose, note, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(note ? note.title : "");
    setDescription(note ? note.description : "");
    setError("");
  }, [note]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in");
        return;
      }

      const payload = { title, description };
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (note) {
        const { data } = await axios.put(
          `/api/notes/${note._id}`,
          payload,
          config
        );
        onSave(data);
      } else {
        const { data } = await axios.post("/api/notes", payload, config);
        onSave(data);
      }
      setTitle("");
      setDescription("");
      setError("");
      onClose();
    } catch (err) {
      console.log("Note save error");
      setError("Failed to save error");
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="
       relative
       w-full
       max-w-lg
       overflow-hidden
       rounded-[40px]
       border border-white/20
       bg-white/10
       backdrop-blur-2xl
       shadow-2xl
       p-8
      ">
        <div className="absolute -top-20 -left-20 w-52 h-52 bg-blue-500/30 rounded-full blur-3xl"></div>

          <div className="absolute -bottom-20 -right-20 w-52 h-52 bg-purple-500/30 rounded-full blur-3xl"></div>

         <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

         <div className="relative z-10"></div>

        <h2 className="text-4xl font-bold text-white mb-6">

          {note ? "Edit Note" : "Create Note"}
        </h2>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note Title"
              className="
w-full
px-5
py-4
bg-white/10
text-white
border
border-white/20
rounded-2xl
placeholder-gray-300
outline-none
focus:ring-2
focus:ring-blue-500
"
              required
            />
          </div>
          <div>
            <textarea
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Note Description"
              className="
              w-full
px-5
py-4
bg-white/10
text-white
border
border-white/20
rounded-2xl
placeholder-gray-300
outline-none
focus:ring-2
focus:ring-blue-500
"
              rows={4}
              required
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="
bg-gradient-to-r
from-blue-500
to-purple-600
text-white
px-6
py-3
rounded-2xl
font-semibold
hover:scale-105
transition
"
            >
              {note ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="
bg-white/10
border
border-white/20
text-white
px-6
py-3
rounded-2xl
hover:bg-white/20
transition
"
            >
              Cancel
            </button>
          </div>
        </form>
        
      </div>
    </div>
  );
};

export default NoteModal;
