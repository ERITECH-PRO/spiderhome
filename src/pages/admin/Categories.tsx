import { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Trash2, Save, Settings, X, Search } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import CategoryForm from './CategoryForm';

interface Category {
  id?: number;
  name: string;
  subcategories: string[];
  created_at?: string;
  updated_at?: string;
}

const Categories = () => {
  const { isDark } = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState<Category>({ name: '', subcategories: [] });
  const subcatInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [editSubcatInputs, setEditSubcatInputs] = useState<Record<number, string>>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/admin/categories', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Erreur lors du chargement des catégories');
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      list.sort((a: Category, b: Category) => a.name.localeCompare(b.name, 'fr'));
      setCategories(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => setForm({ name: '', subcategories: [] });

  const handleAddSubcat = () => {
    const value = subcatInputRef.current?.value?.trim();
    if (!value) return;
    const exists = form.subcategories.some((s) => s.toLowerCase() === value.toLowerCase());
    if (exists) {
      setError('Cette sous-catégorie existe déjà');
      return;
    }
    setForm((prev) => ({ ...prev, subcategories: [...prev.subcategories, value] }));
    if (subcatInputRef.current) subcatInputRef.current.value = '';
  };

  const removeSubcatFromForm = (value: string) => {
    setForm((prev) => ({ ...prev, subcategories: prev.subcategories.filter((s) => s !== value) }));
  };

  const createCategory = async () => {
    if (!form.name.trim()) {
      alert('Le nom de la catégorie est requis');
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: form.name.trim(), subcategories: form.subcategories })
      });
      if (!res.ok) throw new Error('Erreur lors de la création');
      resetForm();
      setSuccess('Catégorie créée avec succès');
      setError(null);
      fetchCategories();
      nameInputRef.current?.focus();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (category: Category) => {
    if (!category.id) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/admin/categories/${category.id}` , {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: category.name.trim(), subcategories: category.subcategories })
      });
      if (!res.ok) throw new Error('Erreur lors de la mise à jour');
      setSuccess('Catégorie mise à jour');
      setError(null);
      fetchCategories();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id?: number) => {
    if (!id) return;
    if (!confirm('Supprimer cette catégorie ?')) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      setSuccess('Catégorie supprimée');
      setError(null);
      fetchCategories();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) =>
      c.name.toLowerCase().includes(q) || (c.subcategories || []).some(s => s.toLowerCase().includes(q))
    );
  }, [categories, query]);

  const addSubcatToCategory = (id: number) => {
    const value = (editSubcatInputs[id] || '').trim();
    if (!value) return;
    const next = categories.map((c) => {
      if (c.id === id) {
        const exists = (c.subcategories || []).some((s) => s.toLowerCase() === value.toLowerCase());
        if (exists) return c;
        return { ...c, subcategories: [...(c.subcategories || []), value] };
      }
      return c;
    });
    setCategories(next);
    setEditSubcatInputs((prev) => ({ ...prev, [id]: '' }));
  };

  const removeSubcatFromCategory = (id: number, sub: string) => {
    const next = categories.map((c) => c.id === id ? { ...c, subcategories: (c.subcategories || []).filter(s => s !== sub) } : c);
    setCategories(next);
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-xl shadow-sm border p-6 ${isDark ? 'bg-theme-tertiary border-theme-primary' : 'bg-white border-gray-200'}`}>
        <h2 className="text-lg font-semibold mb-6 flex items-center">
          <Settings className="h-5 w-5 mr-2 text-[#118AB2]" />
          Gestion des catégories
        </h2>

        <div className="flex items-center justify-between mb-4">
          <div />
          <button onClick={() => { setEditingCategory(null); setIsFormOpen(true); }} className="px-4 py-2 bg-[#118AB2] text-white rounded-lg hover:opacity-90">Nouvelle catégorie</button>
        </div>

        {/* Alerts */}
        {(error || success) && (
          <div className="mb-4">
            {error && (
              <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-red-50 text-red-700 border border-red-200 mb-2">
                <span className="text-sm">{error}</span>
                <button onClick={() => setError(null)} className="p-1 rounded hover:bg-red-100"><X className="h-4 w-4" /></button>
              </div>
            )}
            {success && (
              <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-green-50 text-green-700 border border-green-200">
                <span className="text-sm">{success}</span>
                <button onClick={() => setSuccess(null)} className="p-1 rounded hover:bg-green-100"><X className="h-4 w-4" /></button>
              </div>
            )}
          </div>
        )}

        {/* Formulaire déplacé dans un modal */}
      </div>

      {/* Liste */}
      <div className={`rounded-xl shadow-sm border p-6 ${isDark ? 'bg-theme-tertiary border-theme-primary' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-md font-semibold">Catégories existantes</h3>
          <div className="relative w-64">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-[#B0B0B0]' : 'text-[#555555]'}`} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher..."
              className={`pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#118AB2]/20 focus:border-[#118AB2] transition-all ${isDark ? 'bg-[#2A2A2A] border-[#2A2A2A] text-white placeholder-[#B0B0B0]' : 'bg-[#F7F7F7] border-[#E0E0E0] text-[#0B0C10] placeholder-[#555555]'}`}
            />
          </div>
        </div>
        {loading && <p className="text-sm text-gray-500">Chargement...</p>}
        {!loading && filteredCategories.length === 0 && <p className="text-sm text-gray-500">Aucune catégorie</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className={`group relative rounded-xl border overflow-hidden transition-all duration-300 ${
                isDark ? 'bg-theme-tertiary border-theme-primary hover:shadow-lg' : 'bg-white border-gray-200 hover:shadow-md'
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <input
                      type="text"
                      value={cat.name}
                      onChange={(e) => setCategories((prev) => prev.map((c) => c.id === cat.id ? { ...c, name: e.target.value } : c))}
                      className={`w-full px-0 py-0 border-0 text-base font-semibold focus:outline-none focus:ring-0 ${isDark ? 'bg-transparent text-white' : 'bg-transparent text-[#0B0C10]'}`}
                    />
                    <div className="mt-1 inline-flex items-center text-xs text-gray-500">
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200">{(cat.subcategories || []).length} sous-catégorie(s)</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {(cat.subcategories || []).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 max-h-24 overflow-auto pr-1">
                    {(cat.subcategories || []).sort((a, b) => a.localeCompare(b, 'fr')).map((s, i) => (
                      <span key={`${s}-${i}`} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-gray-100 border border-gray-200">
                        {s}
                        <button onClick={() => removeSubcatFromCategory(cat.id as number, s)} className="p-1 rounded hover:bg-gray-200">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    value={editSubcatInputs[cat.id as number] || ''}
                    onChange={(e) => setEditSubcatInputs((prev) => ({ ...prev, [cat.id as number]: e.target.value }))}
                    placeholder="Ajouter une sous-catégorie"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSubcatToCategory(cat.id as number); } }}
                    className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#118AB2] focus:border-transparent transition-all text-sm ${isDark ? 'border-theme-primary bg-theme-secondary text-theme-primary' : 'border-gray-300 bg-white text-gray-900'}`}
                  />
                  <button onClick={() => addSubcatToCategory(cat.id as number)} className="px-3 py-2 bg-[#118AB2] text-white rounded-lg text-sm hover:opacity-90">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className={`px-5 py-3 border-t flex justify-end ${isDark ? 'border-theme-primary' : 'border-gray-200'}`}>
                <button onClick={() => { setEditingCategory(cat); setIsFormOpen(true); }} className="px-4 py-2 bg-[#118AB2] text-white rounded-lg hover:opacity-90 flex items-center">
                  Modifier
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CategoryForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSaved={() => { fetchCategories(); setSuccess('Enregistré avec succès'); }}
        category={editingCategory}
      />
    </div>
  );
};

export default Categories;


