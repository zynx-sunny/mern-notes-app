import React, { useEffect, useState } from "react";
import axios from "axios";
import NoteModal from "./NoteModal";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const Home = ({darkMode}) => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const location = useLocation();

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in");
        return;
      }
      const searchParams = new URLSearchParams(location.search);
      const search = searchParams.get("search") || "";
      const { data } = await axios.get("/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filteredNotes = search
        ? data.filter(
            (note) =>
              note.title.toLowerCase().includes(search.toLowerCase()) ||
              note.description.toLowerCase().includes(search.toLowerCase())
          )
        : data;
      setNotes(filteredNotes);
      console.log(data);
    } catch (err) {
      setError("Failed to fetch notes");
    }
  };

  const handleEdit = (note) => {
    setEditNote(note);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchNotes();
  }, [location.search]);
  const handleSaveNote = (newNote) => {
    if (editNote) {
      setNotes(
        notes.map((note) => (note._id === newNote._id ? newNote : note))
      );
    } else {
      setNotes([...notes, newNote]);
    }

    setEditNote(null);
    setIsModalOpen(false);
  };
  const handleDelete = async (id) => {
  const result = await Swal.fire({
  title: "Delete Note?",
  text: "This action cannot be undone.",
  icon: "warning",

  showCancelButton: true,
  confirmButtonText: "Delete",
  cancelButtonText: "Cancel",

  background: "rgba(15,23,42,0.85)",
  color: "#ffffff",

  confirmButtonColor: "#ef4444",
  cancelButtonColor: "#475569",

  backdrop: `
    rgba(0,0,0,0.5)
  `,

  customClass: {
    popup: "rounded-[100px] border border-white/10 shadow-2xl",
    title: "text-3xl font-bold",
    htmlContainer: "text-gray-300",
  },

  didOpen: () => {
    const popup = Swal.getPopup();

    popup.style.backdropFilter = "blur(20px)";
    popup.style.boxShadow =
      "0 0 80px rgba(59,130,246,0.25), 0 0 120px rgba(168,85,247,0.2)";
  },
});

  if (!result.isConfirmed) return;

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No authentication token found. Please log in");
      return;
    }

    await axios.delete(`/api/notes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setNotes(notes.filter((note) => note._id !== id));

  } catch (err) {
    setError("Failed to delete note");
  }

};

  return (
    <div
      className={`relative min-h-screen overflow-hidden ${
       darkMode ? "bg-gray-900" : "bg-slate-100"
     }`}
    >
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full blur-3xl opacity-30"></div>

     <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-30"></div>

     <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-300 rounded-full blur-3xl opacity-20"></div>

     <div className="relative z-10 container mx-auto px-4 py-8">
      {error && <p className="text-red-400 mb-4">{error}</p>}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditNote(null);
        }}
        note={editNote}
        onSave={handleSaveNote}
      />
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gray-800 text-white text-3xl rounded-full shadow-lg hover:bg-gray-900 flex items-center justify-center"
      >
        <span className="flex items-center justify-center h-full w-full pb-1">
          +
        </span>
      </button>
      {notes.length === 0 ? (
       <div className="flex flex-col items-center justify-center mt-20">
       <h2 className="text-2xl font-bold text-gray-800">
        No Notes Yet
       </h2>
       <p className="text-gray-400 mt-2">
        Click the + button to create your first note
       </p>
       </div>
       ) : (
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
       {notes.map((note) => (
          <div
            className={`p-5 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
            darkMode ? "bg-gray-800" : "bg-white"
         }`}
             key={note._id}
             >
            <h3
           className={`text-lg font-bold mb-3 ${
            darkMode ? "text-white" : "text-gray-800"
           }`}
            >
             {note.title}
            </h3>
            <p
             className={`mb-4 ${
              darkMode ? "text-gray-300" : "text-gray-600" }`}
            >
             {note.description}
            </p>

            <p
             className={`text-sm mb-4 ${
             darkMode ? "text-gray-400" : "text-gray-600"
             }`}
            >
             {new Date(note.updatedAt).toLocaleString()}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(note)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(note._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
    </div>
    </div>
  );
};

export default Home;
