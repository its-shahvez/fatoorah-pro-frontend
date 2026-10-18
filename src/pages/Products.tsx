import React, { useState } from 'react';
import {
  PackagePlus,
  Search,
  Edit3,
  Archive,
  X,
  Package,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppStore } from '../store/useAppStore';
import { formatSAR } from '../lib/utils';
import type { Product, VatCategory } from '../types';

export const Products: React.FC = () => {
  const { products, addProduct, updateProduct, lang } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [unit, setUnit] = useState('PCE');
  const [price, setPrice] = useState(1000);
  const [vatCategory, setVatCategory] = useState<VatCategory>('S');

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameAr.includes(searchQuery)
  );

  const openAddModal = () => {
    setEditingId(null);
    setSku(`IT-NEW-0${products.length + 1}`);
    setName('');
    setNameAr('');
    setUnit('PCE');
    setPrice(500);
    setVatCategory('S');
    setModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingId(prod.id);
    setSku(prod.sku);
    setName(prod.name);
    setNameAr(prod.nameAr);
    setUnit(prod.unit);
    setPrice(prod.price);
    setVatCategory(prod.vatCategory);
    setModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProduct(editingId, {
        sku,
        name,
        nameAr,
        unit,
        price,
        vatCategory,
      });
      toast.success(`Updated product "${name}"!`);
    } else {
      addProduct({
        sku,
        name,
        nameAr: nameAr || 'منتج قياسي',
        unit,
        price,
        vatCategory,
        status: 'Active',
      });
      toast.success(`Added product "${name}" to catalog!`);
    }
    setModalOpen(false);
  };

  const renderVatBadge = (cat: VatCategory) => {
    switch (cat) {
      case 'S':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            S — 15% Standard
          </span>
        );
      case 'Z':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            Z — 0% Zero-Rated
          </span>
        );
      case 'E':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            E — Exempt
          </span>
        );
      case 'O':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
            O — Out-of-Scope
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-extrabold text-slate-900">
              {lang === 'en' ? 'Products & Services Catalog' : 'دليل المنتجات والخدمات'}
            </h2>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {products.length}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'en'
              ? 'Pre-configured with UN/ECE unit codes (PCE, HUR, DAY) and ZATCA VAT tax categories'
              : 'المنتجات مصنفة حسب فئات ضريبة القيمة المضافة المعتمدة'}
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <PackagePlus className="w-4 h-4" />
          <span>{lang === 'en' ? '+ Add Product' : '+ إضافة منتج'}</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by SKU, English or Arabic item name..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[11px] uppercase font-bold border-b border-slate-200">
                <th className="py-3.5 px-6">SKU</th>
                <th className="py-3.5 px-6">Product / Service Name</th>
                <th className="py-3.5 px-6">UN/ECE Unit</th>
                <th className="py-3.5 px-6">Unit Price (Excl. VAT)</th>
                <th className="py-3.5 px-6">ZATCA VAT Category</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-mono text-xs font-bold text-slate-600">
                    {prod.sku}
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-900">{prod.name}</p>
                    <p className="text-xs font-arabic text-slate-400">{prod.nameAr}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                      {prod.unit}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-extrabold text-slate-900">
                    {formatSAR(prod.price)}
                  </td>
                  <td className="py-4 px-6">{renderVatBadge(prod.vatCategory)}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        prod.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {prod.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(prod)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-emerald-600"
                        title="Edit Product"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          const nextStatus =
                            prod.status === 'Active' ? 'Archived' : 'Active';
                          updateProduct(prod.id, { status: nextStatus });
                          toast.success(
                            `${prod.name} marked as ${nextStatus}`
                          );
                        }}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-amber-600"
                        title="Toggle Archive Status"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveProduct}
            className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900">
                  {editingId ? 'Edit Product / Service' : 'Add New Product / Service'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  SKU Code *
                </label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  UN/ECE Unit *
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold"
                >
                  <option value="PCE">PCE (Piece)</option>
                  <option value="HUR">HUR (Hour)</option>
                  <option value="DAY">DAY (Day)</option>
                  <option value="MON">MON (Month)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Item Name (English) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Cloud ERP Annual Subscription"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Item Name (Arabic)
              </label>
              <input
                type="text"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder="اشتراك نظام سحابي سنوي"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-arabic"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Unit Price (SAR) *
                </label>
                <input
                  type="number"
                  min={0}
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  ZATCA VAT Category *
                </label>
                <select
                  value={vatCategory}
                  onChange={(e) => setVatCategory(e.target.value as VatCategory)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold"
                >
                  <option value="S">S — 15% Standard</option>
                  <option value="Z">Z — 0% Zero Rated</option>
                  <option value="E">E — Exempt</option>
                  <option value="O">O — Out of Scope</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
              >
                {editingId ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};