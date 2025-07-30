import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API = "http://localhost:8080";

export default function NotesApp() {
  // Auth state
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [username, setUsername] = useState(() => localStorage.getItem("username") || "");

  // Which auth view to show when logged out: 'login' or 'register'
  const [authView, setAuthView] = useState("login");

  // Login form
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // Register form
  const [regEmail, setRegEmail] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Notes state
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // Inline styles
  const inputStyle = { padding: "8px", width: "100%", marginBottom: "8px", border: "1px solid #ccc", borderRadius: "4px" };
  const buttonStyle = { padding: "8px 12px", borderRadius: "4px", marginRight: "8px", cursor: "pointer", border: "none" };

  // Persist token/username on refresh
  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("username");
    if (t && !token) setToken(t);
    if (u && !username) setUsername(u);
  }, [token, username]);

  // Fetch notes
  const fetchNotes = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/notes`, { headers: { Authorization: `Bearer ${token}` } });
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchNotes();
  }, [fetchNotes, token]);

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken("");
    setUsername("");
    setNotes([]);
  };

  // Register
  const register = async () => {
    try {
      const res = await axios.post(`${API}/auth/register`, {
        email: regEmail,
        username: regUsername,
        passwordHash: regPassword,
      });
      alert(res.data);
      // auto-switch to login
      setAuthView("login");
    } catch (err) {
      alert(err.response?.data || "Registration failed");
    }
  };

  // Login
  const login = async () => {
    try {
      const { data } = await axios.post(`${API}/auth/login`, {
        identifier,
        passwordHash: password,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      setToken(data.token);
      setUsername(data.username);
      alert("Login successful");
    } catch (err) {
      alert(err.response?.data || "Login failed");
    }
  };

  // Create Note
  const createNote = async () => {
    try {
      await axios.post(
        `${API}/notes`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle("");
      setContent("");
      fetchNotes();
    } catch (err) {
      alert("Failed to create note");
    }
  };

  // Delete Note
  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API}/notes/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchNotes();
    } catch {
      alert("Failed to delete note");
    }
  };

  // Modify Note
  const modifyNote = async () => {
    try {
      await axios.put(
        `${API}/notes/${editingNoteId}`,
        { title: editTitle, content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingNoteId(null);
      setEditTitle("");
      setEditContent("");
      fetchNotes();
    } catch {
      alert("Failed to update note");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>Notes App</h1>

      {/* LOGGED OUT: show tabs */}
      {!token && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 12 }}>
            <button
              onClick={() => setAuthView("login")}
              style={{
                ...buttonStyle,
                backgroundColor: authView === "login" ? "#3B82F6" : "#E5E7EB",
                color: authView === "login" ? "#fff" : "#111",
              }}
            >
              Login
            </button>
            <button
              onClick={() => setAuthView("register")}
              style={{
                ...buttonStyle,
                backgroundColor: authView === "register" ? "#3B82F6" : "#E5E7EB",
                color: authView === "register" ? "#fff" : "#111",
              }}
            >
              Register
            </button>
          </div>

          {authView === "login" ? (
            <div>
              <input
                placeholder="Email or Username"
                style={inputStyle}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                style={inputStyle}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={login} style={{ ...buttonStyle, backgroundColor: "#10B981", color: "#fff" }}>
                Login
              </button>
            </div>
          ) : (
            <div>
              <input
                placeholder="Email"
                style={inputStyle}
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
              <input
                placeholder="Username"
                style={inputStyle}
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                style={inputStyle}
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
              <button
                onClick={register}
                style={{ ...buttonStyle, backgroundColor: "#3B82F6", color: "#fff" }}
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}

      {/* LOGGED IN */}
      {token && (
        <>
          <p style={{ marginBottom: 8, fontStyle: "italic", color: "#4B5563" }}>
            Logged in as <strong>{username}</strong>
          </p>
          <button
            onClick={logout}
            style={{ ...buttonStyle, backgroundColor: "#EF4444", color: "#fff", marginBottom: 16 }}
          >
            Logout
          </button>

          {/* Create */}
          <div style={{ marginBottom: 16 }}>
            <input
              placeholder="Note title"
              style={inputStyle}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Note content"
              style={{ ...inputStyle, height: 80 }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button
              onClick={createNote}
              style={{ ...buttonStyle, backgroundColor: "#8B5CF6", color: "#fff" }}
            >
              Add Note
            </button>
          </div>

          {/* Edit form */}
          {editingNoteId && (
            <div style={{ marginBottom: 16, padding: 12, background: "#F9FAFB", borderRadius: 6 }}>
              <h3 style={{ marginBottom: 8 }}>Editing Note</h3>
              <input
                style={inputStyle}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <textarea
                style={{ ...inputStyle, height: 80 }}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <button
                onClick={modifyNote}
                style={{ ...buttonStyle, backgroundColor: "#F59E0B", color: "#fff" }}
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingNoteId(null)}
                style={{ ...buttonStyle, backgroundColor: "#E5E7EB" }}
              >
                Cancel
              </button>
            </div>
          )}

          {/* List */}
          <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>Your Notes</h2>
          {notes.map((note) => (
            <div
              key={note.id}
              style={{
                border: "1px solid #D1D5DB",
                padding: 12,
                marginBottom: 12,
                borderRadius: 6,
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: "bold" }}>{note.title}</h3>
              <p style={{ margin: "8px 0" }}>{note.content}</p>
              <button
                onClick={() => {
                  setEditingNoteId(note.id);
                  setEditTitle(note.title);
                  setEditContent(note.content);
                }}
                style={{ ...buttonStyle, backgroundColor: "#60A5FA", color: "#fff" }}
              >
                Modify
              </button>
              <button
                onClick={() => deleteNote(note.id)}
                style={{ ...buttonStyle, backgroundColor: "#F87171", color: "#fff" }}
              >
                Delete
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
