import React from 'react';

const ProcurementRequest: React.FC = () => {
  return (
    <div className="max-w-[1400px] mx-auto p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">New Material Request</h2>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold border border-blue-100">Draft</span>
          </div>
          <p className="text-slate-500">Request ID: <span className="font-mono text-slate-700 font-medium">#MR-2023-849</span></p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-sm">
            Save Draft
          </button>
          <button className="px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors shadow-sm shadow-primary/30 flex items-center gap-2 text-sm">
            <span className="material-symbols-outlined text-[18px]">send</span>
            Submit Request
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
            
          {/* Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
             <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">info</span>
                General Information
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Requester</label>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">AM</div>
                        <div>
                            <p className="text-sm font-medium text-slate-900">Alex Morgan</p>
                            <p className="text-xs text-slate-500">ID: EMP-0922</p>
                        </div>
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Target Department</label>
                    <div className="flex gap-2">
                        <select className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary">
                            <option>Central Warehouse</option>
                            <option>IT Storage</option>
                        </select>
                        <select className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary">
                            <option>Hardware</option>
                            <option>Office Supplies</option>
                        </select>
                    </div>
                </div>
             </div>
          </div>

          {/* Line Items */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
             <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">shopping_cart</span>
                    Request Items
                </h3>
                <button className="text-sm font-medium text-primary hover:text-rose-700 flex items-center gap-1">
                    <span className="material-symbols-outlined text-lg">add</span> Add Item
                </button>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4">Item Details</th>
                            <th className="px-6 py-4">SKU / Code</th>
                            <th className="px-6 py-4 text-center">Qty</th>
                            <th className="px-6 py-4 text-right">Est. Price</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        <tr>
                            <td className="px-6 py-4">
                                <div className="font-medium text-slate-900">Barcode Scanner - Handheld</div>
                                <div className="text-xs text-slate-500">Wireless, Bluetooth 5.0, Ruggedized</div>
                            </td>
                            <td className="px-6 py-4"><span className="bg-slate-100 px-2 py-0.5 rounded text-xs">HWA-SCN-001</span></td>
                            <td className="px-6 py-4 text-center font-bold">5</td>
                            <td className="px-6 py-4 text-right font-medium">$120.00</td>
                            <td className="px-6 py-4"><span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-red-500">delete</span></td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4">
                                <div className="font-medium text-slate-900">Zebra Thermal Labels 4x6</div>
                                <div className="text-xs text-slate-500">Roll of 500, Perforated</div>
                            </td>
                            <td className="px-6 py-4"><span className="bg-slate-100 px-2 py-0.5 rounded text-xs">SUP-LBL-4X6</span></td>
                            <td className="px-6 py-4 text-center font-bold">20</td>
                            <td className="px-6 py-4 text-right font-medium">$15.50</td>
                            <td className="px-6 py-4"><span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-red-500">delete</span></td>
                        </tr>
                    </tbody>
                    <tfoot className="bg-slate-50 border-t border-slate-200">
                        <tr>
                            <td colSpan={3} className="px-6 py-4 text-right text-sm font-semibold text-slate-500">Total Estimated Cost</td>
                            <td className="px-6 py-4 text-right text-lg font-bold text-primary">$910.00</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
             </div>
          </div>
          
           {/* Justification */}
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">edit_note</span>
                    Business Justification
                </h3>
                <textarea className="w-full border border-slate-200 rounded-lg p-4 text-sm text-slate-800 min-h-[120px] focus:ring-primary focus:border-primary resize-none" placeholder="Explain why these items are needed..."></textarea>
           </div>
        </div>

        {/* Sidebar Column */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">timeline</span>
                    Procurement Lifecycle
                </h3>
                <div className="relative pl-4 border-l-2 border-slate-100 space-y-8">
                    {/* Active */}
                    <div className="relative">
                        <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-white"></span>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900">Request Created</span>
                            <span className="text-xs text-slate-500 mt-0.5">Today, 10:23 AM</span>
                            <div className="mt-2 bg-rose-50 border border-rose-100 p-3 rounded-lg">
                                <p className="text-xs text-rose-800 font-medium">Currently Drafting</p>
                                <p className="text-[10px] text-rose-600 mt-1">Please complete all required fields.</p>
                            </div>
                        </div>
                    </div>
                     {/* Pending */}
                    <div className="relative opacity-50">
                        <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-slate-200 border-2 border-white"></span>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-900">Dept. Manager Approval</span>
                            <span className="text-xs text-slate-500 mt-0.5">Pending Submission</span>
                        </div>
                    </div>
                     {/* Pending */}
                     <div className="relative opacity-50">
                        <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-slate-200 border-2 border-white"></span>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-900">Purchasing Review</span>
                            <span className="text-xs text-slate-500 mt-0.5">Pending Approval</span>
                        </div>
                    </div>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default ProcurementRequest;