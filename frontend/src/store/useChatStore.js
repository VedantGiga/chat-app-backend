import {create} from 'zustand'

import toast from 'react-hot-toast'

import {axiosInstance} from '../lib/axios.js'

import { useAuthStore } from './useAuthStore.js'
import { Socket } from 'socket.io-client'
export const useChatStore = create((set,get) => ({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,
    isTyping:false,


    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
          const res = await axiosInstance.get("/messages/users");
          set({ users: res.data });
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isUsersLoading: false });
        }
      },

    getMessages:async (userId) => {
        set({isMessagesLoading: true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
             set({messages:res.data})
        } catch (error) {
            toast.error(error.response.data.message)
        } finally{
            set({isMessagesLoading:false})
        }
    },

    sendMessage:async(messageData) => {
        const {selectedUser,messages} = get()
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData)
            set({messages:[...messages,res.data]})
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    subscribeToMessages:() => {
      const {selectedUser} = get()
      if(!selectedUser) return
      const socket = useAuthStore.getState().socket

      socket.on("newMessage", (newMessage) => {
        const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id
        if(!isMessageSentFromSelectedUser) return
        set({
          messages:[...get().messages,newMessage],
        })
      })

      socket.on("userTyping", (data) => {
        if(data.senderId === selectedUser._id) {
          set({isTyping: data.isTyping})
        }
      })
    },

    unsubscribeFromMessages:() => {
      const socket = useAuthStore.getState().socket
      socket.off("newMessage")
      socket.off("userTyping")
    },

    sendTypingStatus:(isTyping) => {
      const {selectedUser} = get()
      const socket = useAuthStore.getState().socket
      if(selectedUser && socket) {
        socket.emit("typing", {
          receiverId: selectedUser._id,
          isTyping
        })
      }
    },

    setSelectedUser:(selectedUser) => set({selectedUser}),
   
}))