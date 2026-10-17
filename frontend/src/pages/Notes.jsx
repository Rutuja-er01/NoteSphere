
import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import './Notes.css';

function Notes() {
  const { token, isLoggedIn } = useContext(AuthContext);

  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    tag: 'General'
  });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const API = 'http://localhost:5000/api/notes';

  const request = async (path, options = {}) => {
    const response = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token,
        ...options.headers
      }
    });

    const text = await response.text();
    let data;

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { error: text };
    }

    if (!response.ok) {
      throw new Error(
        data.error || data.message || text || 'Request failed'
      );
    }

    return data;
  };

  const fetchNotes = async () => {
    if (!token) return;

    setLoading(true);

    try {
      const data = await request('/fetchallnotes');
      setNotes(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && token) {
      fetchNotes();
    } else {
      setNotes([]);
    }
  }, [token, isLoggedIn]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (editingId) {
        await request(`/updatenote/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(form)
        });

        setMessage('Note updated successfully!');
      } else {
        await request('/addnote', {
          method: 'POST',
          body: JSON.stringify(form)
        });

        setMessage('Note added successfully!');
      }

      setForm({
        title: '',
        description: '',
        tag: 'General'
      });
      setEditingId(null);

      await fetchNotes();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleEdit = (note) => {
    setForm({
      title: note.title,
      description: note.description,
      tag: note.tag || 'General'
    });

    setEditingId(note._id);
    setMessage('');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this note?'
    );

    if (!confirmed) return;

    setMessage('');

    try {
      await request(`/deletenote/${id}`, {
        method: 'DELETE'
      });

      setNotes((previous) =>
        previous.filter((note) => note._id !== id)
      );

      if (editingId === id) {
        setEditingId(null);
        setForm({
          title: '',
          description: '',
          tag: 'General'
        });
      }

      setMessage('Note deleted successfully!');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({
      title: '',
      description: '',
      tag: 'General'
    });
    setMessage('');
  };

  const filteredNotes = notes.filter((note) => {
    const query = search.toLowerCase();

    return (
      note.title.toLowerCase().includes(query) ||
      note.description.toLowerCase().includes(query) ||
      (note.tag || '').toLowerCase().includes(query)
    );
  });

  if (!isLoggedIn) {
    return (
      <main className="notes-page">
        <section className="notes-empty">
          <h2>Welcome to NoteSphere</h2>
          <p>Please log in to create and manage your notes.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="notes-page">
      <header className="notes-header">
        <div>
          <p className="notes-eyebrow">YOUR PERSONAL WORKSPACE</p>
          <h1>My Notes</h1>
          <p>Capture your thoughts. Keep everything organized.</p>
        </div>

        <div className="notes-count">
          <strong>{notes.length}</strong>
          <span>{notes.length === 1 ? 'Note' : 'Notes'}</span>
        </div>
      </header>

      <section className="note-form-card">
        <h2>{editingId ? 'Edit your note' : 'Create a new note'}</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="note-title">Title</label>
          <input
            id="note-title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Give your note a title"
            maxLength={120}
            required
          />

          <label htmlFor="note-description">Description</label>
          <textarea
            id="note-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Write down your thoughts..."
            rows={4}
            required
          />

          <label htmlFor="note-tag">Tag</label>
          <input
            id="note-tag"
            name="tag"
            value={form.tag}
            onChange={handleChange}
            placeholder="e.g. Study, Work, Personal"
            maxLength={40}
          />

          <div className="note-form-actions">
            <button type="submit" className="note-primary-btn">
              {editingId ? 'Save Changes' : 'Add Note'}
            </button>

            {editingId && (
              <button
                type="button"
                className="note-secondary-btn"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {message && (
          <p className="notes-message" role="status">
            {message}
          </p>
        )}
      </section>

      <section className="notes-list-section">
        <div className="notes-list-header">
          <div>
            <h2>All Notes</h2>
            <p>Your ideas, all in one place.</p>
          </div>

          <input
            className="notes-search"
            type="search"
            placeholder="Search notes..."
            aria-label="Search notes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="notes-feedback">Loading your notes...</p>
        ) : filteredNotes.length === 0 ? (
          <div className="notes-empty">
            <h3>{search ? 'No matching notes' : 'No notes yet'}</h3>
            <p>
              {search
                ? 'Try a different search term.'
                : 'Create your first note using the form above.'}
            </p>
          </div>
        ) : (
          <div className="notes-grid">
            {filteredNotes.map((note) => (
              <article className="note-card" key={note._id}>
                <div className="note-card-top">
                  <span className="note-tag">
                    {note.tag || 'General'}
                  </span>

                  <span className="note-date">
                    {note.date
                      ? new Date(note.date).toLocaleDateString()
                      : ''}
                  </span>
                </div>

                <h3>{note.title}</h3>
                <p className="note-description">
                  {note.description}
                </p>

                <div className="note-card-actions">
                  <button
                    type="button"
                    onClick={() => handleEdit(note)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="note-delete-btn"
                    onClick={() => handleDelete(note._id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Notes;
