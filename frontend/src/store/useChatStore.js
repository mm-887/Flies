import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  conversations: [],
  users: [],
  messages: [],
  selectedUser: null,
  isLoadingConversations: false,
  isLoadingUsers: false,
  isLoadingMessages: false,
  isSendingMessage: false,

  loadConversations: async () => {
    set({ isLoadingConversations: true });
    try {
      const res = await axiosInstance.get("/messages/conversations");
      set({ conversations: res.data });
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      set({ isLoadingConversations: false });
    }
  },

  loadUsers: async () => {
    set({ isLoadingUsers: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      set({ isLoadingUsers: false });
    }
  },

  selectUser: (user) => {
    set({ selectedUser: user, messages: [] });
    if (user) get().loadMessages(user._id);
  },

  loadMessages: async (userId) => {
    set({ isLoadingMessages: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      set({ isLoadingMessages: false });
    }
  },

  sendMessage: async (text, mediaFile) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) return;

    set({ isSendingMessage: true });
    try {
      let res;
      if (mediaFile) {
        const formData = new FormData();
        if (text) formData.append("text", text);
        formData.append("media", mediaFile);
        res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, { text });
      }
      set({ messages: [...messages, res.data] });
    } catch (err) {
      toast.error("Failed to send message");
      console.error("Failed to send message:", err);
    } finally {
      set({ isSendingMessage: false });
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const isFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isFromSelectedUser) return;

      set({ messages: [...get().messages, newMessage] });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) socket.off("newMessage");
  },
}));