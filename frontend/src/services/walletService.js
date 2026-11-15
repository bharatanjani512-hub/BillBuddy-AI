import api from "./api";

export const getWallets = async (workspaceId = null) => {
  const url = workspaceId ? `/wallets/?workspace_id=${workspaceId}` : "/wallets/";
  const response = await api.get(url);
  return response.data;
};

export const getWalletById = async (walletId) => {
  const response = await api.get(`/wallets/${walletId}`);
  return response.data;
};

export const createWallet = async (walletData) => {
  const response = await api.post("/wallets/", walletData);
  return response.data;
};

export const addFundsToWallet = async (walletId, amount, notes = "") => {
  const response = await api.post(`/wallets/${walletId}/add-funds`, {
    amount: parseFloat(amount),
    notes,
  });
  return response.data;
};
