import { createContext, useContext, useState, useEffect } from "react";
import { getWorkspaces, createWorkspace, deleteWorkspace, inviteMember } from "../services/workspaceService";
import { getWallets, addFundsToWallet } from "../services/walletService";
import { useAuth } from "../hooks/useAuth";

export const WorkspaceContext = createContext();

export function WorkspaceProvider({ children }) {
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState([]);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkspaces = async () => {
    if (!user) {
      setWorkspaces([]);
      setCurrentWorkspace(null);
      setWallets([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await getWorkspaces();
      const list = res.data || [];
      setWorkspaces(list);

      // Find saved workspace or default
      const savedId = localStorage.getItem("billbuddy_workspace_id");
      let active = list.find((w) => w._id === savedId) || list[0] || null;
      setCurrentWorkspace(active);

      if (active) {
        localStorage.setItem("billbuddy_workspace_id", active._id);
        // Fetch wallets for this workspace
        await fetchWallets(active._id);
      }
    } catch (err) {
      console.error("Error loading workspaces:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWallets = async (workspaceId) => {
    try {
      const res = await getWallets(workspaceId);
      setWallets(res.data || []);
    } catch (err) {
      console.error("Error fetching wallets:", err);
      setWallets([]);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, [user]);

  const selectWorkspace = async (workspace) => {
    setCurrentWorkspace(workspace);
    localStorage.setItem("billbuddy_workspace_id", workspace._id);
    await fetchWallets(workspace._id);
  };

  const handleCreateWorkspace = async (data) => {
    const res = await createWorkspace(data);
    await fetchWorkspaces();
    return res;
  };

  const handleAddFunds = async (walletId, amount, notes) => {
    const res = await addFundsToWallet(walletId, amount, notes);
    if (currentWorkspace) {
      await fetchWallets(currentWorkspace._id);
    }
    return res;
  };

  const handleInvite = async (workspaceId, email) => {
    const res = await inviteMember(workspaceId, email);
    await fetchWorkspaces();
    return res;
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        currentWorkspace,
        wallets,
        loading,
        selectWorkspace,
        createWorkspace: handleCreateWorkspace,
        addFunds: handleAddFunds,
        inviteMember: handleInvite,
        refresh: fetchWorkspaces,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  return useContext(WorkspaceContext);
}
