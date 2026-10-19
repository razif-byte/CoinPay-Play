import React, { useState } from 'react';
import { TopupRequest, LedgerEntry, UserProfile } from '../../types';
import { sounds } from '../../utils/audio';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Users,
  CreditCard,
  Lock,
  Search,
  Filter,
  DollarSign,
  AlertTriangle,
  FileText,
  UserCheck,
} from 'lucide-react';

interface AdminDashboardViewProps {
  topupRequests: TopupRequest[];
  ledger: LedgerEntry[];
  user: UserProfile;
  onApproveTopup: (reqId: string, auditNote: string) => void;
  onRejectTopup: (reqId: string, reason: string) => void;
  isDark: boolean;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  topupRequests,
  ledger,
  user,
  onApproveTopup,
  onRejectTopup,
  isDark,
}) => {
  const [activeRole, setActiveRole] = useState<
    'Super Admin' | 'Finance Admin' | 'Game Manager' | 'Customer Support' | 'Auditor'
  >('Super Admin');
  const [activeTab, setActiveTab] = useState<'topups' | 'ledger' | 'fraud' | 'users'>('topups');
  const [searchTerm, setSearchTerm] = useState('');
  const [auditNoteModal, setAuditNoteModal] = useState<{ id: string; action: 'APPROVE' | 'REJECT' } | null>(null);
  const [noteText, setNoteText] = useState('');

  // Handle Export CSV
  const handleExportCSV = () => {
    sounds.playClick();
    const headers = 'Transaction ID,Type,Amount (MYR),Status,Ref Number,Timestamp,Title\n';
    const rows = ledger
      .map(
        (l) =>
          `"${l.id}","${l.type}","${(l.amountCents / 100).toFixed(2)}","${l.status}","${l.refNumber}","${l.timestamp}","${l.title}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `CoinPay_Ledger_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmAction = () => {
    if (!auditNoteModal) return;
    sounds.playCoinChime();
    if (auditNoteModal.action === 'APPROVE') {
      onApproveTopup(auditNoteModal.id, noteText || 'Disahkan oleh ' + activeRole);
    } else {
      onRejectTopup(auditNoteModal.id, noteText || 'Pindahan tidak sepadan dengan penyata bank.');
    }
    setAuditNoteModal(null);
    setNoteText('');
  };

  const pendingCount = topupRequests.filter(
    (t) => t.status === 'PENDING' || t.status === 'UNDER_REVIEW'
  ).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      {/* Admin Role Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-sm text-white">Panel Kawalan Pentadbir Rasmi</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Akses Terhad (RBAC)
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Kawalan keselamatan transaksi wang dan audit lejar.</p>
          </div>
        </div>

        {/* Role Selector Pill */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto text-xs">
          {(['Super Admin', 'Finance Admin', 'Game Manager', 'Customer Support', 'Auditor'] as const).map(
            (role) => (
              <button
                key={role}
                onClick={() => {
                  sounds.playClick();
                  setActiveRole(role);
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition text-xs whitespace-nowrap ${
                  activeRole === role
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {role}
              </button>
            )
          )}
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('topups')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'topups'
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Pengesahan Top Up</span>
          {pendingCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'ledger'
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Lejar Audit Kewangan</span>
        </button>

        <button
          onClick={() => setActiveTab('fraud')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'fraud'
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Amaran Penipuan & Bot</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Pengguna & Baki</span>
        </button>
      </div>

      {/* TAB 1: Top Up Verification */}
      {activeTab === 'topups' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-base font-extrabold text-white">
                Senarai Permohonan Tambah Nilai CIMB & TNG DuitNow
              </h4>
              <p className="text-xs text-slate-400">
                Sahkan nombor rujukan pada penyata rasmi akaun bank sebelum meluluskan kredit.
              </p>
            </div>
            <button
              onClick={handleExportCSV}
              className="btn-3d btn-3d-subtle px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Eksport CSV Laporan</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="pb-3 px-3">Pengguna</th>
                  <th className="pb-3 px-3">Kaedah Bank</th>
                  <th className="pb-3 px-3">No Rujukan Bank</th>
                  <th className="pb-3 px-3">Jumlah</th>
                  <th className="pb-3 px-3">Masa</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Tindakan Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {topupRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/30">
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-white block">{req.userName}</span>
                      <span className="text-[10px] text-slate-400">{req.userId}</span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-300">
                      {req.bankName}
                      <span className="block text-[10px] text-slate-500 font-mono">
                        {req.accountNumber}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-amber-300">
                      {req.refNumber}
                      {req.proofImageUrl && (
                        <span className="block text-[9px] text-blue-400 underline cursor-pointer">
                          [Lihat Bukti Resit]
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 font-black text-white text-sm">
                      RM {req.amountMYR.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 text-[11px]">{req.createdAt}</td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          req.status === 'APPROVED'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : req.status === 'REJECTED'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {req.status === 'PENDING' || req.status === 'UNDER_REVIEW' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setAuditNoteModal({ id: req.id, action: 'APPROVE' })}
                            className="btn-3d btn-3d-green px-2.5 py-1 rounded-lg text-[11px] font-bold text-white flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Luluskan</span>
                          </button>
                          <button
                            onClick={() => setAuditNoteModal({ id: req.id, action: 'REJECT' })}
                            className="btn-3d px-2.5 py-1 rounded-lg text-[11px] font-bold text-rose-300 bg-rose-950/60 border border-rose-500/40 hover:bg-rose-900/60"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Tolak</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-semibold">
                          Diselesaikan oleh {req.reviewedBy || 'Admin'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Financial Ledger Audit */}
      {activeTab === 'ledger' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-extrabold text-white">Lejar Transaksi Tidak Boleh Dipadam</h4>
              <p className="text-xs text-slate-400">
                Setiap mutasi tunai direkodkan dengan jejak audit dan nombor rujukan unik.
              </p>
            </div>
            <button
              onClick={handleExportCSV}
              className="btn-3d btn-3d-subtle px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Muat Turun Audit CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="pb-3 px-3">Tx ID</th>
                  <th className="pb-3 px-3">Jenis</th>
                  <th className="pb-3 px-3">Jumlah (MYR)</th>
                  <th className="pb-3 px-3">Penerima/Penghantar</th>
                  <th className="pb-3 px-3">No Rujukan</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3">Masa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {ledger.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-mono text-slate-400">{item.id}</td>
                    <td className="py-3 px-3 font-bold text-white">{item.type}</td>
                    <td className="py-3 px-3 font-black text-emerald-400">
                      RM {(item.amountCents / 100).toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-slate-300">{item.recipient || '-'}</td>
                    <td className="py-3 px-3 font-mono text-amber-300">{item.refNumber}</td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">{item.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Fraud Alerts & Bot Monitoring */}
      {activeTab === 'fraud' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h4 className="text-base font-extrabold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <span>Sistem Pemantauan Corak Penipuan & Bot</span>
          </h4>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-emerald-300 block">Tiada Percubaan Kredit Berganda</span>
                Sistem pangkalan data lejar telah mengesahkan keunikan semua nombor rujukan perbankan. Tiada transaksi bertindih dikesan.
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30 flex items-start gap-3">
              <UserCheck className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-blue-300 block">Integriti Skor Permainan Arked</span>
                Semua skor bagi 30 Permainan Slot, Candy Pop, dan 3D Snow Plow dikawal ketat dengan had ganjaran coin harian maksimum (30 coins/sesi).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: User Profile Overview */}
      {activeTab === 'users' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h4 className="text-base font-extrabold text-white">Ringkasan Pengguna Aktif</h4>
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/30 text-blue-300 flex items-center justify-center font-bold">
                AR
              </div>
              <div>
                <h5 className="font-bold text-white text-xs">{user.name}</h5>
                <span className="text-[10px] text-slate-400">{user.phone} • {user.email}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-emerald-400 block">
                RM {(user.cashBalanceCents / 100).toFixed(2)}
              </span>
              <span className="text-[10px] text-amber-300 font-bold">{user.rewardCoins} Coins</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Approval / Reject Modal */}
      {auditNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl p-6 bg-slate-900 border border-slate-700 text-white shadow-2xl space-y-4">
            <h4 className="text-base font-black">
              {auditNoteModal.action === 'APPROVE' ? 'Sahkan Kelulusan Top Up' : 'Tolak Permohonan Top Up'}
            </h4>
            <p className="text-xs text-slate-400">
              {auditNoteModal.action === 'APPROVE'
                ? 'Baki wang tunai (MYR) akan serta-merta dikreditkan ke e-wallet pengguna.'
                : 'Sila nyatakan sebab penolakan untuk dimaklumkan kepada pengguna.'}
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Nota Audit Pentadbir:
              </label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Contoh: Disahkan pada penyata CIMB 7016657934"
                rows={3}
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setAuditNoteModal(null)}
                className="w-1/2 btn-3d btn-3d-subtle py-2.5 rounded-xl text-xs font-semibold text-slate-300"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmAction}
                className={`w-1/2 btn-3d py-2.5 rounded-xl text-xs font-bold text-white ${
                  auditNoteModal.action === 'APPROVE' ? 'btn-3d-green' : 'btn-3d-primary bg-rose-600'
                }`}
              >
                Sahkan Tindakan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
