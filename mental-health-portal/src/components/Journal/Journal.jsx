import React, { useState, useEffect } from 'react';

import api from '../../services/api';
import { Plus, Trash2, Edit2, X, Book, Brain, Heart, Search, Filter } from 'lucide-react';

export default function Journal() {

  const [activeTab, setActiveTab] = useState('entries');
  const [entries, setEntries] = useState([]);
  const [thoughtRecords, setThoughtRecords] = useState([]);
  const [gratitudeEntries, setGratitudeEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [],
    is_private: true,
  });

  const [thoughtFormData, setThoughtFormData] = useState({
    situation: '',
    automatic_thought: '',
    emotion: '',
    evidence_for: '',
    evidence_against: '',
    rational_thought: '',
    outcome: '',
  });

  const [gratitudeData, setGratitudeData] = useState({
    content: '',
    category: 'person',
  });

  // Load journal entries
  const loadEntries = async () => {
    setLoading(true);
    try {
      const response = await api.get('/journal');
      setEntries(response.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load journal entries');
      console.error(err);
    }
    setLoading(false);
  };

  // Load thought records
  const loadThoughtRecords = async () => {
    setLoading(true);
    try {
      const response = await api.get('/thought-record');
      setThoughtRecords(response.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load thought records');
      console.error(err);
    }
    setLoading(false);
  };

  // Load gratitude entries
  const loadGratitudeEntries = async () => {
    setLoading(true);
    try {
      const response = await api.get('/gratitude');
      setGratitudeEntries(response.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load gratitude entries');
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (activeTab === 'entries') loadEntries();
    else if (activeTab === 'thoughts') loadThoughtRecords();
    else if (activeTab === 'gratitude') loadGratitudeEntries();
  }, [activeTab]);

  // Handle journal entry submission
  const handleSubmitEntry = async (e) => {
    e.preventDefault();
    if (!formData.content.trim()) {
      setError('Please write something in your journal');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/journal/${editingId}`, {
          title: formData.title,
          content: formData.content,
          tags: formData.tags,
          is_private: formData.is_private,
        });
      } else {
        await api.post('/journal', {
          title: formData.title,
          content: formData.content,
          tags: formData.tags,
          is_private: formData.is_private,
        });
      }
      setFormData({ title: '', content: '', tags: [], is_private: true });
      setShowForm(false);
      setEditingId(null);
      setError('');
      loadEntries();
    } catch (err) {
      setError(editingId ? 'Failed to update entry' : 'Failed to save entry');
      console.error(err);
    }
    setLoading(false);
  };

  // Handle thought record submission
  const handleSubmitThought = async (e) => {
    e.preventDefault();
    if (!thoughtFormData.situation || !thoughtFormData.automatic_thought) {
      setError('Please fill in situation and automatic thought');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/thought-record/${editingId}`, thoughtFormData);
      } else {
        await api.post('/thought-record', thoughtFormData);
      }
      setThoughtFormData({
        situation: '',
        automatic_thought: '',
        emotion: '',
        evidence_for: '',
        evidence_against: '',
        rational_thought: '',
        outcome: '',
      });
      setEditingId(null);
      setShowForm(false);
      setError('');
      loadThoughtRecords();
    } catch (err) {
      setError('Failed to save thought record');
      console.error(err);
    }
    setLoading(false);
  };

  // Handle gratitude submisison
  const handleSubmitGratitude = async (e) => {
    e.preventDefault();
    if (!gratitudeData.content.trim()) {
      setError('Please write what you are grateful for');
      return;
    }

    setLoading(true);
    try {
      await api.post('/gratitude', gratitudeData);
      setGratitudeData({ content: '', category: 'person' });
      setShowForm(false);
      setError('');
      loadGratitudeEntries();
    } catch (err) {
      setError('Failed to save gratitude entry');
      console.error(err);
    }
    setLoading(false);
  };

  // Delete journal entry
  const handleDeleteEntry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    try {
      await api.delete(`/journal/${id}`);
      loadEntries();
    } catch {
      setError('Failed to delete entry');
    }
  };

  // Delete thought record
  const handleDeleteThought = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await api.delete(`/thought-record/${id}`);
      loadThoughtRecords();
    } catch {
      setError('Failed to delete record');
    }
  };

  // Delete gratitude entry
  const handleDeleteGratitude = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/gratitude/${id}`);
      loadGratitudeEntries();
    } catch {
      setError('Failed to delete gratitude entry');
    }
  };

  // Clear all functions
  const handleClearAllJournal = async () => {
    if (!window.confirm('Are you sure you want to delete ALL journal entries? This cannot be undone.')) return;
    try {
      await api.delete('/journal/all');
      loadEntries();
    } catch {
      setError('Failed to clear all journal entries');
    }
  };

  const handleClearAllThoughts = async () => {
    if (!window.confirm('Are you sure you want to delete ALL thought records? This cannot be undone.')) return;
    try {
      await api.delete('/thought-record/all');
      loadThoughtRecords();
    } catch {
      setError('Failed to clear all thought records');
    }
  };

  const handleClearAllGratitude = async () => {
    if (!window.confirm('Are you sure you want to delete ALL gratitude entries? This cannot be undone.')) return;
    try {
      await api.delete('/gratitude/all');
      loadGratitudeEntries();
    } catch {
      setError('Failed to clear all gratitude entries');
    }
  };

  const getSentimentColor = (score) => {
    if (score > 0.3) return 'text-green-600';
    if (score < -0.3) return 'text-red-600';
    return 'text-gray-600';
  };

  const getSentimentLabel = (score) => {
    if (score > 0.3) return 'Positive';
    if (score < -0.3) return 'Negative';
    return 'Neutral';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Journal & Reflection</h1>
          <p className="text-gray-600">Express yourself, track thoughts, and practice gratitude</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2 mb-6 bg-white/80 backdrop-blur-md rounded-xl shadow-sm p-1.5 border border-white">
          <button
            onClick={() => { setActiveTab('entries'); setShowForm(false); setSelectedEntry(null); }}
            className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'entries'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'bg-transparent text-gray-600 hover:bg-white hover:text-purple-600'
            }`}
          >
            <Book size={18} /> <span className="hidden sm:inline">Journal</span>
          </button>
          <button
            onClick={() => { setActiveTab('thoughts'); setShowForm(false); setSelectedEntry(null); }}
            className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'thoughts'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'bg-transparent text-gray-600 hover:bg-white hover:text-purple-600'
            }`}
          >
            <Brain size={18} /> <span className="hidden sm:inline">Thoughts</span>
          </button>
          <button
            onClick={() => { setActiveTab('gratitude'); setShowForm(false); setSelectedEntry(null); }}
            className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'gratitude'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'bg-transparent text-gray-600 hover:bg-white hover:text-purple-600'
            }`}
          >
            <Heart size={18} /> <span className="hidden sm:inline">Gratitude</span>
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex justify-between items-center">
            <span className="text-red-800">{error}</span>
            <button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
              <X size={20} />
            </button>
          </div>
        )}

        {/* JOURNAL ENTRIES TAB */}
        {activeTab === 'entries' && (
          <div>
            {!showForm && !selectedEntry && (
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => { setShowForm(true); setEditingId(null); setFormData({ title: '', content: '', tags: [], is_private: true }); }}
                  className="bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition flex items-center gap-2"
                >
                  <Plus size={20} /> New Journal Entry
                </button>
                {entries.length > 0 && (
                  <button
                    onClick={handleClearAllJournal}
                    className="bg-red-100 text-red-600 border border-red-200 py-3 px-6 rounded-lg font-medium hover:bg-red-200 transition flex items-center gap-2"
                  >
                    <Trash2 size={20} /> Clear All
                  </button>
                )}
              </div>
            )}

            {showForm && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Entry' : 'Write Your Journal'}</h2>
                <form onSubmit={handleSubmitEntry}>
                  <input
                    type="text"
                    placeholder="Title (optional)"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                  <textarea
                    placeholder="What's on your mind today?"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows="10"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                  <div className="flex items-center gap-4 mb-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.is_private}
                        onChange={(e) => setFormData({ ...formData, is_private: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-gray-700">Private Entry</span>
                    </label>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Entry'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowForm(false); setEditingId(null); setFormData({ title: '', content: '', tags: [], is_private: true }); }}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {selectedEntry && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedEntry.title}</h2>
                    <p className="text-gray-600 text-sm">{new Date(selectedEntry.created_at).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => setSelectedEntry(null)} className="text-gray-500 hover:text-gray-700">
                    <X size={24} />
                  </button>
                </div>
                <p className="whitespace-pre-wrap text-gray-700 mb-4">{selectedEntry.content}</p>
                <div className="flex gap-4 items-center mb-4">
                  <div className={`text-sm font-medium ${getSentimentColor(selectedEntry.sentiment_score)}`}>
                    Sentiment: {getSentimentLabel(selectedEntry.sentiment_score)}
                  </div>
                  {selectedEntry.emotion_tone && (
                    <div className="text-sm text-gray-600">Tone: {selectedEntry.emotion_tone}</div>
                  )}
                </div>
              </div>
            )}

            <div className="grid gap-4">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 cursor-pointer"
                  onClick={() => setSelectedEntry(entry)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800">{entry.title || 'Untitled'}</h3>
                      <p className="text-gray-600 text-sm">{new Date(entry.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className={`text-sm font-medium px-2 py-1 rounded ${getSentimentColor(entry.sentiment_score)} bg-opacity-10`}>
                      {getSentimentLabel(entry.sentiment_score)}
                    </div>
                  </div>
                  <p className="text-gray-700 line-clamp-2 mb-3">{entry.content}</p>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(entry.id);
                        setFormData({
                          title: entry.title || '',
                          content: entry.content,
                          tags: entry.tags || [],
                          is_private: entry.is_private,
                        });
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 p-1"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEntry(entry.id);
                      }}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* THOUGHT RECORDS TAB */}
        {activeTab === 'thoughts' && (
          <div>
            {!showForm && (
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => { setShowForm(true); setEditingId(null); setThoughtFormData({ situation: '', automatic_thought: '', emotion: '', evidence_for: '', evidence_against: '', rational_thought: '', outcome: '' }); }}
                  className="bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition flex items-center gap-2"
                >
                  <Plus size={20} /> New Thought Record
                </button>
                {thoughtRecords.length > 0 && (
                  <button
                    onClick={handleClearAllThoughts}
                    className="bg-red-100 text-red-600 border border-red-200 py-3 px-6 rounded-lg font-medium hover:bg-red-200 transition flex items-center gap-2"
                  >
                    <Trash2 size={20} /> Clear All
                  </button>
                )}
              </div>
            )}

            {showForm && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Cognitive Thought Record</h2>
                <form onSubmit={handleSubmitThought}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">What happened? (Situation)</label>
                      <textarea
                        placeholder="Describe the situation"
                        value={thoughtFormData.situation}
                        onChange={(e) => setThoughtFormData({ ...thoughtFormData, situation: e.target.value })}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">What did you think? (Automatic Thought)</label>
                      <textarea
                        placeholder="Your first reaction/thought"
                        value={thoughtFormData.automatic_thought}
                        onChange={(e) => setThoughtFormData({ ...thoughtFormData, automatic_thought: e.target.value })}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">What emotion did you feel?</label>
                      <input
                        type="text"
                        placeholder="e.g., anxious, sad, angry"
                        value={thoughtFormData.emotion}
                        onChange={(e) => setThoughtFormData({ ...thoughtFormData, emotion: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Evidence for this thought</label>
                      <textarea
                        placeholder="What supports this thought?"
                        value={thoughtFormData.evidence_for}
                        onChange={(e) => setThoughtFormData({ ...thoughtFormData, evidence_for: e.target.value })}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Evidence against this thought</label>
                      <textarea
                        placeholder="What contradicts this thought?"
                        value={thoughtFormData.evidence_against}
                        onChange={(e) => setThoughtFormData({ ...thoughtFormData, evidence_against: e.target.value })}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">More realistic/balanced thought</label>
                      <textarea
                        placeholder="What's a more balanced perspective?"
                        value={thoughtFormData.rational_thought}
                        onChange={(e) => setThoughtFormData({ ...thoughtFormData, rational_thought: e.target.value })}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Outcome/Result</label>
                      <textarea
                        placeholder="How did this new perspective help?"
                        value={thoughtFormData.outcome}
                        onChange={(e) => setThoughtFormData({ ...thoughtFormData, outcome: e.target.value })}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Record'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowForm(false); setEditingId(null); setThoughtFormData({ situation: '', automatic_thought: '', emotion: '', evidence_for: '', evidence_against: '', rational_thought: '', outcome: '' }); }}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid gap-4">
              {thoughtRecords.map((record) => (
                <div key={record.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-800">Situation: {record.situation.substring(0, 50)}...</h3>
                      <p className="text-gray-600 text-sm">{new Date(record.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(record.id);
                          setThoughtFormData(record);
                          setShowForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 p-1"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteThought(record.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2"><strong>Emotion:</strong> {record.emotion}</p>
                  <p className="text-sm text-gray-700 mb-2"><strong>Automatic thought:</strong> {record.automatic_thought}</p>
                  {record.rational_thought && (
                    <p className="text-sm text-green-700"><strong>Balanced thought:</strong> {record.rational_thought}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GRATITUDE TAB */}
        {activeTab === 'gratitude' && (
          <div>
            {!showForm && (
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => { setShowForm(true); setGratitudeData({ content: '', category: 'person' }); }}
                  className="bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition flex items-center gap-2"
                >
                  <Plus size={20} /> New Gratitude Entry
                </button>
                {gratitudeEntries.length > 0 && (
                  <button
                    onClick={handleClearAllGratitude}
                    className="bg-red-100 text-red-600 border border-red-200 py-3 px-6 rounded-lg font-medium hover:bg-red-200 transition flex items-center gap-2"
                  >
                    <Trash2 size={20} /> Clear All
                  </button>
                )}
              </div>
            )}

            {showForm && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">What are you grateful for?</h2>
                <form onSubmit={handleSubmitGratitude}>
                  <select
                    value={gratitudeData.category}
                    onChange={(e) => setGratitudeData({ ...gratitudeData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="person">A Person</option>
                    <option value="experience">An Experience</option>
                    <option value="possession">A Possession</option>
                  </select>
                  <textarea
                    placeholder="Write what you're grateful for and why..."
                    value={gratitudeData.content}
                    onChange={(e) => setGratitudeData({ ...gratitudeData, content: e.target.value })}
                    rows="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Gratitude'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowForm(false); setGratitudeData({ content: '', category: 'person' }); }}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid gap-4">
              {gratitudeEntries.map((entry) => (
                <div key={entry.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="text-gray-600 text-sm mb-1">Grateful for: <span className="font-medium">{entry.category}</span></p>
                      <p className="text-gray-700">{entry.content}</p>
                      <p className="text-gray-500 text-xs mt-2">{new Date(entry.created_at).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteGratitude(entry.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        )}
      </div>
    </div>
  );
}
