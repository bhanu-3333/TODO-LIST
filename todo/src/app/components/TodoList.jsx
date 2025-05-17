'use client';
import { useEffect, useState } from 'react';
import { Plus, Search, Sun, Moon, Calendar, Clock, Edit2, Trash2, Check, X } from 'lucide-react';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [search, setSearch] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState('all');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('personal');

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('todos');
    const theme = localStorage.getItem('theme');
    if (saved) setTodos(JSON.parse(saved));
    if (theme === 'dark') setDarkMode(true);
  }, []);

  // Save todos
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Save theme
  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addTodo = () => {
    if (!input.trim()) return;
    if (editIndex !== null) {
      const updated = [...todos];
      updated[editIndex].text = input.trim();
      setTodos(updated);
      setEditIndex(null);
    } else {
      const newTodo = {
        id: Date.now(),
        text: input.trim(),
        done: false,
        priority,
        category,
        createdAt: new Date().toLocaleString(),
        dueDate: null
      };
      setTodos([newTodo, ...todos]);
    }
    setInput('');
    setPriority('medium');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const editTodo = (id) => {
    const todo = todos.find(t => t.id === id);
    setInput(todo.text);
    setEditIndex(id);
    setPriority(todo.priority || 'medium');
    setCategory(todo.category || 'personal');
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setInput('');
    setPriority('medium');
    setCategory('personal');
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.text.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'active' && !todo.done) ||
      (filter === 'completed' && todo.done);
    return matchesSearch && matchesFilter;
  });

  const total = todos.length;
  const completed = todos.filter((t) => t.done).length;
  const remaining = total - completed;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'work': return '💼';
      case 'personal': return '👤';
      case 'shopping': return '🛒';
      case 'health': return '🏥';
      case 'education': return '📚';
      default: return '📝';
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-5xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
             Todo Mastery
          </h1>
          <p className={`text-lg ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Organize your life, one task at a time
          </p>
        </div>

        {/* Main Card */}
        <div className={`rounded-3xl shadow-2xl overflow-hidden backdrop-blur-lg ${
          darkMode 
            ? 'bg-white/10 border border-white/20' 
            : 'bg-white/80 border border-white/30'
        }`}>
          
          {/* Top Controls */}
          <div className="p-6 border-b border-gray-200/20">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode
                      ? 'bg-white/10 border-white/20 text-white placeholder-gray-400'
                      : 'bg-white border-gray-200 text-gray-800 placeholder-gray-500'
                  }`}
                />
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                  darkMode
                    ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                    : 'bg-purple-500/20 text-purple-600 hover:bg-purple-500/30'
                }`}
              >
                {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
              </button>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 mt-4">
              {['all', 'active', 'completed'].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    filter === filterType
                      ? darkMode
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-500 text-white'
                      : darkMode
                        ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Add Todo Section */}
          <div className="p-6 border-b border-gray-200/20">
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  placeholder="What needs to be done?"
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                  className={`flex-1 px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode
                      ? 'bg-white/10 border-white/20 text-white placeholder-gray-400'
                      : 'bg-white border-gray-200 text-gray-800 placeholder-gray-500'
                  }`}
                />
                {editIndex !== null && (
                  <button
                    onClick={cancelEdit}
                    className="p-3 rounded-xl bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 transition-all duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={addTodo}
                  className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:scale-105"
                >
                  {editIndex !== null ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex gap-4">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className={`px-3 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode
                      ? 'bg-gray-800 border-gray-600 text-white [&>option]:bg-gray-800 [&>option]:text-white'
                      : 'bg-white border-gray-200 text-gray-800 [&>option]:bg-white [&>option]:text-gray-800'
                  }`}
                >
                  <option value="low">🟢 Low Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="high">🔴 High Priority</option>
                </select>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`px-3 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode
                      ? 'bg-gray-800 border-gray-600 text-white [&>option]:bg-gray-800 [&>option]:text-white'
                      : 'bg-white border-gray-200 text-gray-800 [&>option]:bg-white [&>option]:text-gray-800'
                  }`}
                >
                  <option value="personal">👤 Personal</option>
                  <option value="work">💼 Work</option>
                  <option value="shopping">🛒 Shopping</option>
                  <option value="health">🏥 Health</option>
                  <option value="education">📚 Education</option>
                </select>
              </div>
            </div>
          </div>

          {/* Todo List */}
          <div className="p-6">
            {filteredTodos.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎯</div>
                <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {todos.length === 0 ? 'No tasks yet. Add one above!' : 'No tasks match your search.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`group p-4 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                      todo.done
                        ? darkMode
                          ? 'bg-green-900/20 border-green-500/30 opacity-75'
                          : 'bg-green-50 border-green-200 opacity-75'
                        : darkMode
                          ? 'bg-white/10 border-white/20 hover:bg-white/20'
                          : 'bg-white border-gray-200 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          todo.done
                            ? 'bg-green-500 border-green-500 text-white'
                            : darkMode
                              ? 'border-gray-500 hover:border-green-500'
                              : 'border-gray-300 hover:border-green-500'
                        }`}
                      >
                        {todo.done && <Check className="w-4 h-4" />}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{getCategoryIcon(todo.category)}</span>
                          <span
                            className={`font-medium transition-all duration-200 ${
                              todo.done
                                ? 'line-through text-gray-500'
                                : darkMode
                                  ? 'text-white'
                                  : 'text-gray-800'
                            }`}
                          >
                            {todo.text}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(todo.priority)}`}>
                            {todo.priority}
                          </span>
                        </div>
                        <div className={`text-sm flex items-center gap-4 ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {todo.createdAt}
                          </span>
                          <span className="capitalize">{todo.category}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <button
                          onClick={() => editTodo(todo.id)}
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            darkMode
                              ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                              : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                          }`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            darkMode
                              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                              : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className={`p-6 border-t border-gray-200/20 ${
            darkMode ? 'bg-white/5' : 'bg-gray-50/50'
          }`}>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10">
                <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {total}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Total Tasks
                </div>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10">
                <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  {completed}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Completed
                </div>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-600/10">
                <div className={`text-2xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                  {remaining}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Remaining
                </div>
              </div>
            </div>
            
            {total > 0 && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Progress
                  </span>
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {Math.round((completed / total) * 100)}%
                  </span>
                </div>
                <div className={`w-full h-3 rounded-full overflow-hidden ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500 rounded-full"
                    style={{ width: `${(completed / total) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

       
       
      </div>
    </div>
  );
}