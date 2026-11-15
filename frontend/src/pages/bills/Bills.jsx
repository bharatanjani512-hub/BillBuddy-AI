import { useEffect, useState } from "react";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import {
  fetchBills,
  fetchBillStatistics,
  createBill,
  updateBill,
  deleteBill,
  scanBillFile,
  toggleBillStatus,
} from "../../services/billService";

import BillsHeader from "../../components/bills/BillsHeader";
import BillsStats from "../../components/bills/BillsStats";
import BillsToolbar from "../../components/bills/BillsToolbar";
import BillsTable from "../../components/bills/BillsTable";
import Pagination from "../../components/bills/Pagination";
import BillModal from "../../components/bills/BillModal";
import DeleteModal from "../../components/bills/DeleteModal";

const Bills = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [scanning, setScanning] = useState(false);

  const [bills, setBills] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [pagination, setPagination] = useState({});

  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    category: "",
    payment_mode: "",
    status: "",
    min_amount: "",
    max_amount: "",
    from_date: "",
    to_date: "",
    sort: "latest",
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedBill, setSelectedBill] = useState(null);
  const [scannedInitialData, setScannedInitialData] = useState(null);

  // ==========================================
  // Load Bills
  // ==========================================
  const loadBills = async () => {
    try {
      setLoading(true);
      const response = await fetchBills({
        ...filters,
        search,
      });

      const list = response.data?.bills || response.bills || [];
      const pag = response.data?.pagination || response.pagination || {};
      setBills(list);
      setPagination(pag);
    } catch (error) {
      console.error("Error loading bills:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Load Statistics
  // ==========================================
  const loadStatistics = async () => {
    try {
      const response = await fetchBillStatistics();
      setStatistics(response.data || response || {});
    } catch (error) {
      console.error("Error loading bill statistics:", error);
    }
  };

  // ==========================================
  // AI Bill Scanner Handler
  // ==========================================
  const handleScanBill = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setScanning(true);
      const extracted = await scanBillFile(file);

      // Open the modal pre-filled with scanned data
      setScannedInitialData({
        title: extracted.title || "Scanned Bill",
        amount: extracted.amount || 0,
        category: extracted.category || "Electricity",
        merchant: extracted.merchant || "",
        payment_mode: extracted.payment_mode || "UPI",
        date: extracted.date || new Date().toISOString().split("T")[0],
        due_date: extracted.due_date || "",
        status: extracted.status || "Pending",
        notes: extracted.notes || `Scanned from: ${file.name}`,
      });
      setShowAddModal(true);
    } catch (error) {
      console.error("Error scanning bill with AI:", error);
      alert("Failed to scan receipt/bill. You can still enter details manually.");
    } finally {
      setScanning(false);
      // Reset input so same file can be re-scanned if needed
      e.target.value = "";
    }
  };

  // ==========================================
  // Toggle Status (Paid <-> Pending)
  // ==========================================
  const handleToggleStatus = async (bill) => {
    try {
      await toggleBillStatus(bill._id);
      await loadBills();
      await loadStatistics();
    } catch (error) {
      console.error("Error toggling bill status:", error);
    }
  };

  // ==========================================
  // Create Bill
  // ==========================================
  const handleCreateBill = async (formData) => {
    try {
      setSaving(true);
      await createBill(formData);
      setShowAddModal(false);
      setScannedInitialData(null);
      await loadBills();
      await loadStatistics();
    } catch (error) {
      console.error("Failed to create bill:", error);
      alert("Failed to create bill.");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // Update Bill
  // ==========================================
  const handleUpdateBill = async (formData) => {
    try {
      setSaving(true);
      await updateBill(selectedBill._id, formData);
      setShowEditModal(false);
      setSelectedBill(null);
      await loadBills();
      await loadStatistics();
    } catch (error) {
      console.error("Failed to update bill:", error);
      alert("Failed to update bill.");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // Delete Bill
  // ==========================================
  const handleDeleteBill = async () => {
    try {
      setSaving(true);
      await deleteBill(selectedBill._id);
      setShowDeleteModal(false);
      setSelectedBill(null);
      await loadBills();
      await loadStatistics();
    } catch (error) {
      console.error("Failed to delete bill:", error);
      alert("Failed to delete bill.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadBills();
  }, [filters, search]);

  useEffect(() => {
    loadStatistics();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200">
      <DashboardSidebar />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 min-w-0">
        <BillsHeader
          onAddBill={() => {
            setScannedInitialData(null);
            setShowAddModal(true);
          }}
          onScanBill={handleScanBill}
          scanning={scanning}
        />

        <BillsStats statistics={statistics} />

        <BillsToolbar
          search={search}
          setSearch={setSearch}
          filters={filters}
          setFilters={setFilters}
          onRefresh={loadBills}
        />

        <BillsTable
          bills={bills}
          loading={loading}
          onEdit={(bill) => {
            setSelectedBill(bill);
            setShowEditModal(true);
          }}
          onDelete={(bill) => {
            setSelectedBill(bill);
            setShowDeleteModal(true);
          }}
          onToggleStatus={handleToggleStatus}
        />

        <Pagination
          pagination={pagination}
          filters={filters}
          setFilters={setFilters}
        />

        <BillModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setScannedInitialData(null);
          }}
          onSubmit={handleCreateBill}
          initialData={scannedInitialData}
          loading={saving}
        />

        <BillModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedBill(null);
          }}
          onSubmit={handleUpdateBill}
          initialData={selectedBill}
          loading={saving}
        />

        <DeleteModal
          isOpen={showDeleteModal}
          bill={selectedBill}
          loading={saving}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedBill(null);
          }}
          onConfirm={handleDeleteBill}
        />

        <div className="mt-10 text-center text-xs text-slate-400">
          BillBuddy AI • Smart Bill & Business Management Platform
        </div>
      </main>
    </div>
  );
};

export default Bills;
