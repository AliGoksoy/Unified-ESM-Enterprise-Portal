import React from 'react';

const HRRequest: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto p-8 flex flex-col gap-8">
      {/* Page Title & Intro */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
          <span className="hover:text-primary cursor-pointer">Home</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="hover:text-primary cursor-pointer">HR Portal</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 font-medium">New Leave Request</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">New Leave Request</h1>
        <p className="text-slate-500">Submit a request for time off. Your manager will be notified automatically.</p>
      </div>

      {/* Workflow Stepper */}
      <div className="w-full bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-900">Request Workflow</span>
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">Step 1 of 4</span>
        </div>
        <div className="relative flex items-center justify-between w-full mt-6">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 -z-10 rounded-full"></div>
          
          {/* Active */}
          <div className="flex flex-col items-center gap-2 relative">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 ring-4 ring-white">
              <span className="material-symbols-outlined text-[18px]">edit_document</span>
            </div>
            <span className="text-xs font-semibold text-primary absolute -bottom-6 w-20 text-center">Draft</span>
          </div>
          
          <div className="absolute left-8 right-[75%] top-1/2 -translate-y-1/2 h-1 bg-primary -z-0"></div>

          {/* Steps */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-300 text-slate-400 flex items-center justify-center z-10">
              <span className="material-symbols-outlined text-[18px]">supervisor_account</span>
            </div>
            <span className="text-xs font-medium text-slate-400 absolute mt-10">Approval</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-300 text-slate-400 flex items-center justify-center z-10">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
            </div>
            <span className="text-xs font-medium text-slate-400 absolute mt-10">Review</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-300 text-slate-400 flex items-center justify-center z-10">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
            </div>
            <span className="text-xs font-medium text-slate-400 absolute mt-10">Done</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">calendar_month</span>
              Leave Details
            </h2>
            <form className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">Leave Type</label>
                  <select className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option>Annual Leave</option>
                    <option>Sick Leave</option>
                    <option>Casual Leave</option>
                    <option>Unpaid Leave</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">Handover To (Optional)</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">search</span>
                    <input className="w-full pl-10 bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Search colleague..." type="text"/>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">Start Date</label>
                  <input className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary" type="date" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">End Date</label>
                  <input className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary" type="date" />
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-3">
                <span className="material-symbols-outlined text-blue-600">info</span>
                <p className="text-sm text-blue-800">
                   You are requesting <span className="font-bold">3 days</span> of leave. This includes 3 working days and 0 weekends.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Reason / Comments</label>
                <textarea className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" placeholder="Please provide a brief reason for your leave..." rows={4}></textarea>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Attachments (Optional)</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="p-3 bg-slate-100 rounded-full mb-3 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-slate-500">cloud_upload</span>
                  </div>
                  <p className="text-sm font-medium text-slate-900">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-500 mt-1">Medical certificates, travel tickets (Max 5MB)</p>
                </div>
              </div>
            </form>
          </div>
          
          {/* Action Bar */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
            <button className="px-6 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
                Cancel
            </button>
            <button className="px-6 py-2.5 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                Save Draft
            </button>
            <button className="px-6 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg shadow-lg shadow-primary/25 transition-all flex items-center gap-2">
                Submit Request
                <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-primary/20 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-blue-500/20 blur-2xl"></div>
                
                <h3 className="text-lg font-semibold mb-6 relative z-10">Leave Balance</h3>
                <div className="flex flex-col gap-4 relative z-10">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-300 uppercase tracking-wider font-medium">Annual</span>
                            <span className="text-2xl font-bold">12</span>
                        </div>
                        <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">+2 accrued</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/5">
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Sick</span>
                            <span className="text-2xl font-bold text-slate-200">5</span>
                        </div>
                        <div className="h-1.5 w-16 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-rose-400 w-1/2 rounded-full"></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/5">
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Casual</span>
                            <span className="text-2xl font-bold text-slate-200">3</span>
                        </div>
                        <div className="h-1.5 w-16 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-400 w-3/4 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Policy */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Policy Reminder</h3>
                <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-xs text-slate-600">
                        <span className="material-symbols-outlined text-[16px] text-primary mt-0.5 shrink-0">warning</span>
                        Annual leave requests for more than 5 days must be submitted 2 weeks in advance.
                    </li>
                    <li className="flex items-start gap-3 text-xs text-slate-600">
                        <span className="material-symbols-outlined text-[16px] text-primary mt-0.5 shrink-0">medical_services</span>
                        Sick leave exceeding 2 days requires a medical certificate.
                    </li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HRRequest;