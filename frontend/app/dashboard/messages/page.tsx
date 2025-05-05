"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Send, Paperclip, MoreVertical } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

// Mock data for conversations
const mockConversations = [
  {
    id: "1",
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I'm interested in your campaign",
    timestamp: "10:30 AM",
    unread: true,
    online: true,
  },
  {
    id: "2",
    name: "StyleCo",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thanks for applying to our campaign",
    timestamp: "Yesterday",
    unread: false,
    online: true,
  },
  {
    id: "3",
    name: "TechWorld",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "We'd like to schedule a call to discuss",
    timestamp: "Yesterday",
    unread: false,
    online: false,
  },
  {
    id: "4",
    name: "Samantha Lee",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Looking forward to working with you",
    timestamp: "Monday",
    unread: false,
    online: false,
  },
]

// Mock data for messages in a conversation
const mockMessages = [
  {
    id: "1",
    senderId: "user",
    text: "Hi there! I saw your Summer Fashion campaign and I'm very interested in collaborating.",
    timestamp: "10:15 AM",
  },
  {
    id: "2",
    senderId: "other",
    text: "Hello! Thanks for reaching out. We'd love to hear more about your ideas for the campaign.",
    timestamp: "10:20 AM",
  },
  {
    id: "3",
    senderId: "user",
    text: "Great! I have experience working with fashion brands and my audience is primarily interested in summer styles.",
    timestamp: "10:22 AM",
  },
  {
    id: "4",
    senderId: "other",
    text: "That sounds perfect for what we're looking for. Could you share some examples of your previous work?",
    timestamp: "10:25 AM",
  },
  {
    id: "5",
    senderId: "user",
    text: "Of course! I've attached some links to my recent fashion collaborations. Let me know what you think!",
    timestamp: "10:28 AM",
  },
  {
    id: "6",
    senderId: "other",
    text: "These look great! I'm impressed with your content quality. Let's discuss the specifics of the campaign. Are you available for a quick call tomorrow?",
    timestamp: "10:30 AM",
  },
]

export default function MessagesPage() {
  const { user } = useAuth()
  const [activeConversation, setActiveConversation] = useState(mockConversations[0])
  const [messageText, setMessageText] = useState("")
  const [conversations, setConversations] = useState(mockConversations)
  const [messages, setMessages] = useState(mockMessages)

  const handleSendMessage = () => {
    if (!messageText.trim()) return

    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId: "user",
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages([...messages, newMessage])
    setMessageText("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="h-[calc(100vh-5rem)]">
      <div className="flex h-full">
        {/* Conversations Sidebar */}
        <div className="w-80 border-r border-border hidden md:flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-8" />
            </div>
          </div>

          <ScrollArea className="flex-1">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-secondary/50 transition-colors ${activeConversation.id === conversation.id ? "bg-secondary" : ""}`}
                onClick={() => setActiveConversation(conversation)}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={conversation.avatar || "/placeholder.svg"} alt={conversation.name} />
                    <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {conversation.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span
                      className={`font-medium truncate ${conversation.unread ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {conversation.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                  </div>
                  <p
                    className={`text-sm truncate ${conversation.unread ? "font-medium text-foreground" : "text-muted-foreground"}`}
                  >
                    {conversation.lastMessage}
                  </p>
                </div>
                {conversation.unread && <div className="h-2 w-2 rounded-full bg-primary"></div>}
              </div>
            ))}
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
                    <AvatarImage src={activeConversation.avatar || "/placeholder.svg"} alt={activeConversation.name} />
                    <AvatarFallback>{activeConversation.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{activeConversation.name}</h3>
                    <p className="text-xs text-muted-foreground">{activeConversation.online ? "Online" : "Offline"}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-lg ${
                          message.senderId === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"
                        }`}
                      >
                        <p>{message.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.senderId === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}
                        >
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
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
