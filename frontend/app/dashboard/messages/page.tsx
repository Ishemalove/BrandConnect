"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Send, Paperclip, MoreVertical } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { messageService } from "@/lib/api-service"
import { useToast } from "@/components/ui/use-toast"

// Message interface
interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

// Conversation interface
interface Conversation {
  id: string;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar?: string;
  otherUserOnline?: boolean;
  totalMessages?: number;
  lastMessage?: string;
  lastMessageTime?: string;
  user1: { id: string; name: string };
  user2: { id: string; name: string };
  user1Id?: string;
  user2Id?: string;
  user1Name?: string;
  user2Name?: string;
}

export default function MessagesPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [messageText, setMessageText] = useState("")
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch conversations on component mount
  useEffect(() => {
    async function fetchConversations() {
      try {
        setLoading(true)
        const response = await messageService.getConversations()
        console.log("Conversations response:", response.data)
        if (response.data && Array.isArray(response.data)) {
          setConversations(response.data)
          if (response.data.length > 0) {
            setActiveConversation(response.data[0])
            fetchMessages(response.data[0].id)
          }
        } else {
          setConversations([])
        }
      } catch (error) {
        setConversations([])
      } finally {
        setLoading(false)
      }
    }
    fetchConversations()
  }, [toast])

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id)
    }
  }, [activeConversation])

  // Function to fetch messages for a conversation
  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await messageService.getConversation(conversationId)
      console.log("Messages response:", response.data)
      if (response.data && response.data.messages && Array.isArray(response.data.messages)) {
        // Map API response to our Message interface
        const formattedMessages = response.data.messages.map(msg => {
          const senderId = String(msg.sender_id || msg.sender?.id || "");
          console.log('Raw message:', msg, 'Extracted senderId:', senderId);
          return {
          id: msg.id || String(msg._id),
            senderId,
          text: msg.content || msg.text || "",
          timestamp: msg.timestamp 
            ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
        })
        setMessages(formattedMessages)
      } else if (response.data && Array.isArray(response.data)) {
        // Alternative format - the messages are directly in the data array
        const formattedMessages = response.data.map(msg => {
          const senderId = String(msg.sender_id || msg.sender?.id || "");
          console.log('Raw message:', msg, 'Extracted senderId:', senderId);
          return {
          id: msg.id || String(msg._id),
            senderId,
          text: msg.content || msg.text || "",
          timestamp: msg.timestamp 
            ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
        })
        setMessages(formattedMessages)
      } else {
        setMessages([])
      }
    } catch (error) {
      setMessages([])
    }
  }

  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeConversation) return

    // Create new message object for optimistic UI update
    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId: user?.id ?? "user",
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    // Optimistically update UI
    setMessages([...messages, newMessage])
    const messageToSend = messageText
    setMessageText("")

    try {
      // Send message to API
      await messageService.sendMessage(activeConversation.id, messageToSend)
      
      // Update conversations list with new last message
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === activeConversation.id 
            ? { 
                ...conv, 
                lastMessage: messageToSend,
                lastMessageTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              } 
            : conv
        )
      )
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
      
      // Remove the optimistically added message on error
      setMessages(messages => messages.filter(msg => msg.id !== newMessage.id))
      // Restore the message text so the user can try again
      setMessageText(messageToSend)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Filter conversations by search
  const filteredConversations = conversations.filter(conv => 
    (conv.otherUserName || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-[calc(100vh-5rem)]">
      <div className="flex h-full">
        {/* Conversations Sidebar */}
        <div className="w-80 border-r border-border hidden md:flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search messages..." 
                className="pl-8" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            {loading ? (
              // Loading skeleton for conversations
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="p-3 flex items-center gap-3 border-b border-border">
                  <div className="w-10 h-10 rounded-full bg-muted animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 w-24 bg-muted animate-pulse rounded mb-2"></div>
                    <div className="h-3 w-32 bg-muted animate-pulse rounded"></div>
                  </div>
                </div>
              ))
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                {searchQuery ? "No conversations match your search" : "No conversations yet"}
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-secondary/50 transition-colors ${activeConversation?.id === conversation.id ? "bg-secondary" : ""}`}
                  onClick={() => setActiveConversation(conversation)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={conversation.otherUserAvatar || "/placeholder.jpg"} alt={conversation.otherUserName} />
                      <AvatarFallback>{conversation.otherUserName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {conversation.otherUserOnline && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-medium truncate">{conversation.otherUserName}</span>
                      <span className="text-xs text-muted-foreground">{conversation.lastMessageTime}</span>
                    </div>
                    <p className="text-sm truncate text-muted-foreground">{conversation.lastMessage}</p>
                    <p className="text-xs text-muted-foreground">Total messages: {conversation.totalMessages}</p>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={activeConversation.otherUserAvatar || "/placeholder.jpg"} alt={activeConversation.otherUserName} />
                    <AvatarFallback>{activeConversation.otherUserName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{activeConversation.otherUserName}</h3>
                    <p className="text-xs text-muted-foreground">{activeConversation.otherUserOnline ? "Online" : "Offline"}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                {loading ? (
                  // Loading skeleton for messages
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                        <div className={`w-2/3 h-16 rounded-lg ${i % 2 === 0 ? "bg-primary/20" : "bg-muted"} animate-pulse`}></div>
                      </div>
                    ))}
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, idx) => {
                      const isSender = user && String(message.senderId) === String(user.id);
                      // Determine the other user's name from the conversation using user1Id/user2Id
                      let otherUserName = '';
                      if (activeConversation && activeConversation.user1Id && activeConversation.user2Id) {
                        if (String(activeConversation.user1Id) === String(user.id)) {
                          otherUserName = activeConversation.user2Name;
                        } else {
                          otherUserName = activeConversation.user1Name;
                        }
                      }
                      const userName = isSender
                        ? 'You'
                        : (otherUserName || 'User');
                      return (
                      <div
                        key={message.id}
                          className={`flex flex-col mb-4 ${isSender ? 'items-end' : 'items-start'}`}
                        >
                          <span className={`text-xs text-gray-400 mb-1 ${isSender ? 'text-right pr-2' : 'text-left pl-2'}`}>{userName}</span>
                          <div className={`max-w-xs ${isSender ? 'self-end' : 'self-start'}`}>
                        <div
                              className={`px-4 py-2 rounded-2xl shadow ${isSender ? 'bg-pink-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-900 rounded-bl-none'}`}
                        >
                              {message.text}
                            </div>
                            <div className={`text-xs text-gray-400 mt-1 ${isSender ? 'text-right' : 'text-left'}`}>
                            {message.timestamp}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                  />
                  <Button size="icon" onClick={handleSendMessage} disabled={!messageText.trim()}>
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
