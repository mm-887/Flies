import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

export const useAuthStore = create((set,get) => ({
    authUser : null,
    isCheckingAuth : true,
    onlineUsers : [],
    socket : null,
    checkAuth: async () =>{
        try{
            const res = await axiosInstance.get("/auth/check");
            set({authUser:res.data});
            
            get().connectToSocket(res.data);
        }catch(err){
            console.log(err);
            set({authUser:null});
        }
        finally{
            set({isCheckingAuth:false});
        }
    },
    clearAuth: () => {
        set({authUser:null, isCheckingAuth:false, onlineUsers:[], socket:null});
        get().disconnectSocket();
    },
    connectToSocket: (user) => {
        if(!user || get().socket?.connected){
            return;
        }
        const socket = io(BASE_URL,{query:{userId:user._id}});
            
        set({socket});

        socket.on("getOnlineUsers",(users)=>{
            set({onlineUsers:users});
        });
    },
    disconnectSocket: () => {
        const socket = get().socket;
        if (socket?.connected) socket.disconnect();
        set({ socket: null });
    }
}));