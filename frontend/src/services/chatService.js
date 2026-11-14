import api from "./api";

export const sendChatMessage = async (question) => {
  const response = await api.post("/chat/", { question });
  return response.data;
};
