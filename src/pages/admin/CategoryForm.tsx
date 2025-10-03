import { useEffect, useRef, useState } from 'react';
import { X, Save, Plus, Trash2, Settings } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface CategoryData {
  id?: number;
  name: string;
  subcategories: string[];
}

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
  category?: CategoryData | null;
}

const CategoryForm = ({ isOpen, onClose, onSaved, category }: CategoryFormProps) => {
  const { isDark } = useTheme();
  const modalRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const subcatInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<CategoryData>({
    name: '',
    subcategories: []
  });

  useEffect(() => {
    if (category) {
      setForm({
        id: category.id,
        name: category.name || '',
        subcategories: Array.isArray(category.subcategories) ? category.subcategories : []
      });
    } else {
      setForm({ name: '', subcategories: [] });
    }
  }, [category, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => nameInputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-draggable="true"]')) {
      setIsDragging(true);
      const rect = modalRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && modalRef.current) {
      const x = Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - modalRef.current.offsetWidth));
      const y = Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - modalRef.current.offsetHeight));
      modalRef.current.style.transform = `translate(${x}px, ${y}px)`;
    }
  };

  const handleMouseUp = () => { setIsDragging(false); };

  const addSubcat = () => {
    const value = subcatInputRef.current?.value?.trim();
    if (!value) return;
    const exists = form.subcategories.some((s) => s.toLowerCase() === value.toLowerCase());
    if (exists) return;
    setForm((prev) => ({ ...prev, subcategories: [...prev.subcategories, value] }));
    if (subcatInputRef.current) subcatInputRef.current.value = '';
  };

  const removeSubcat = (value: string) => {
    setForm((prev) => ({ ...prev, subcategories: prev.subcategories.filter((s) => s !== value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const method = form.id ? 'PUT' : 'POST';
      const url = form.id ? `/api/admin/categories/${form.id}` : '/api/admin/categories';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: form.name.trim(), subcategories: form.subcategories })
      });
      if (!res.ok) throw new Error('Erreur lors de la sauvegarde');
      onSaved && onSaved();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={modalRef}
        className={`relative w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ease-out ${
          isDark ? 'bg-theme-secondary border border-theme-primary' : 'bg-white border border-gray-200'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="bg-gradient-to-r from-[#118AB2] to-[#073B4C] text-white p-6 cursor-move select-none" data-draggable="true">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg"><Settings className="h-5 w-5" /></div>
              <div>
                <h1 className="text-xl font-bold">{form.id ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h1>
                <p className="text-blue-100">Nom et sous-catégories associées</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors"><X className="h-5 w-5" /></button>
          </div>
        </div>

        <div className={`flex-1 overflow-y-auto max-h-[calc(90vh-180px)] ${isDark ? 'bg-theme-secondary' : 'bg-white'}`}>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className={`rounded-xl shadow-sm border p-6 ${isDark ? 'bg-theme-tertiary border-theme-primary' : 'bg-white border-gray-200'}`}>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-theme-primary' : 'text-gray-700'} mb-2`}>Nom de la catégorie *</label>
                  <input
                    ref={nameInputRef}
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    required
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#118AB2] focus:border-transparent transition-all ${isDark ? 'border-theme-primary bg-theme-secondary text-theme-primary' : 'border-gray-300 bg-white text-gray-900'}`}
                    placeholder="Ex: Modules relais"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-theme-primary' : 'text-gray-700'} mb-2`}>Sous-catégories (optionnel)</label>
                  <div className="flex space-x-2">
                    <input
                      ref={subcatInputRef}
                      type="text"
                      className={`flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#118AB2] focus:border-transparent transition-all ${isDark ? 'border-theme-primary bg-theme-secondary text-theme-primary' : 'border-gray-300 bg-white text-gray-900'}`}
                      placeholder="Ajouter une sous-catégorie et Entrée"
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSubcat(); } }}
                    />
                    <button type="button" onClick={addSubcat} className="px-4 py-3 bg-[#118AB2] text-white rounded-xl hover:opacity-90">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  {form.subcategories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {form.subcategories.map((s, i) => (
                        <span key={`${s}-${i}`} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-gray-100 border border-gray-200">
                          {s}
                          <button type="button" onClick={() => removeSubcat(s)} className="p-1 rounded hover:bg-gray-200">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={`flex justify-end items-center pt-6 border-t ${isDark ? 'border-theme-primary' : 'border-gray-200'}`}>
              <button type="button" onClick={onClose} className={`px-6 py-3 border rounded-xl transition-all ${isDark ? 'border-theme-primary text-theme-primary hover:bg-theme-tertiary' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>Annuler</button>
              <button type="submit" disabled={loading} className="ml-3 px-8 py-3 bg-gradient-to-r from-[#118AB2] to-[#073B4C] text-white rounded-xl hover:shadow-lg transition-all flex items-center disabled:opacity-50">
                {loading ? <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span> : <Save className="h-4 w-4 mr-2" />}
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;


