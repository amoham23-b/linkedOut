import React, { useState, useEffect, useContext } from 'react';
import { SupabaseContext } from '@/App';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { BriefcaseBusiness, Search, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

interface Conversation {
  contact: {
    uid: string;
    display_name: string;
    photo_url: string | null;
    headline: string | null;
  };
  lastMessage: {
    content: string;
    created_at: string;
    read: boolean;
    sent_by_me: boolean;
  } | null;
}

const MessagesPage = () => {
  const supabase = useContext(SupabaseContext);
  const { toast } = useToast();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch current user on component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUserId(session.user.id);
      }
    };

    fetchCurrentUser();
  }, [supabase]);

  // Fetch conversations when user is loaded
  useEffect(() => {
    if (currentUserId) {
      fetchConversations();
    }
  }, [currentUserId]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation);
      
      // Set up real-time subscription for new messages
      const subscription = supabase
        .channel('messages')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `receiver_id=eq.${currentUserId}` 
        }, (payload) => {
          if (payload.new.sender_id === activeConversation) {
            fetchMessages(activeConversation);
          }
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [activeConversation, currentUserId]);

  // Fetch conversations
  const fetchConversations = async () => {
    setLoading(true);
    try {
      // Get all conversations where the current user is involved
      const { data: sentMessages, error: sentError } = await supabase
        .from('messages')
        .select('receiver_id, content, created_at, read')
        .eq('sender_id', currentUserId)
        .order('created_at', { ascending: false });
        
      const { data: receivedMessages, error: receivedError } = await supabase
        .from('messages')
        .select('sender_id, content, created_at, read')
        .eq('receiver_id', currentUserId)
        .order('created_at', { ascending: false });
        
      if (sentError || receivedError) throw sentError || receivedError;
      
      // Combine and get unique conversation partners
      const contactIds = new Set<string>();
      sentMessages?.forEach(msg => contactIds.add(msg.receiver_id));
      receivedMessages?.forEach(msg => contactIds.add(msg.sender_id));
      
      // Get contact details
      const conversationList: Conversation[] = [];
      
      for (const contactId of contactIds) {
        const { data: contact } = await supabase
          .from('user_profiles')
          .select('uid, display_name, photo_url, headline')
          .eq('uid', contactId)
          .single();
          
        if (contact) {
          // Find last message
          const sentToContact = sentMessages?.filter(msg => msg.receiver_id === contactId) || [];
          const receivedFromContact = receivedMessages?.filter(msg => msg.sender_id === contactId) || [];
          
          const allMessages = [
            ...sentToContact.map(msg => ({ ...msg, sent_by_me: true })),
            ...receivedFromContact.map(msg => ({ ...msg, sent_by_me: false }))
          ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          
          const lastMessage = allMessages.length > 0 ? {
            content: allMessages[0].content,
            created_at: allMessages[0].created_at,
            read: allMessages[0].read,
            sent_by_me: allMessages[0].sent_by_me
          } : null;
          
          conversationList.push({
            contact,
            lastMessage
          });
        }
      }
      
      setConversations(conversationList);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: 'Error fetching conversations',
        description: 'Could not load your conversations. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a conversation
  const fetchMessages = async (contactId: string) => {
    try {
      // Get messages sent to the contact
      const { data: sent, error: sentError } = await supabase
        .from('messages')
        .select('*')
        .eq('sender_id', currentUserId)
        .eq('receiver_id', contactId)
        .order('created_at', { ascending: true });
        
      // Get messages received from the contact
      const { data: received, error: receivedError } = await supabase
        .from('messages')
        .select('*')
        .eq('sender_id', contactId)
        .eq('receiver_id', currentUserId)
        .order('created_at', { ascending: true });
        
      if (sentError || receivedError) throw sentError || receivedError;
      
      // Combine and sort messages by timestamp
      const allMessages = [...(sent || []), ...(received || [])].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      
      setMessages(allMessages);
      
      // Mark received messages as read
      const unreadMessages = received?.filter(msg => !msg.read) || [];
      if (unreadMessages.length > 0) {
        await supabase
          .from('messages')
          .update({ read: true })
          .in('id', unreadMessages.map(msg => msg.id));
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error fetching messages',
        description: 'Could not load your messages. Please try again later.',
        variant: 'destructive'
      });
    }
  };

  // Send a new message
  const sendMessage = async () => {
    if (!messageText.trim() || !activeConversation || !currentUserId) return;
    
    try {
      const messageId = Math.random().toString(36).substring(2, 15);
      
      const { error } = await supabase
        .from('messages')
        .insert({
          id: messageId,
          sender_id: currentUserId,
          receiver_id: activeConversation,
          content: messageText.trim(),
          read: false
        });
        
      if (error) throw error;
      
      // Update local state
      setMessages(prev => [
        ...prev,
        {
          id: messageId,
          sender_id: currentUserId,
          receiver_id: activeConversation,
          content: messageText.trim(),
          created_at: new Date().toISOString(),
          read: false
        }
      ]);
      
      // Clear input
      setMessageText('');
      
      // Refresh conversations list to show latest message
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Failed to send message',
        description: 'Your message could not be sent. Please try again.',
        variant: 'destructive'
      });
    }
  };

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today - show time only
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      // This week - show day of week
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      // Older - show date
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Filter conversations by search query
  const filteredConversations = conversations.filter(conv => 
    conv.contact.display_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-linkedout-gray/30 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-linkedout-blue flex items-center justify-center gap-2">
            <BriefcaseBusiness size={32} />
            LinkedOut
          </h1>
          <p className="text-gray-600 mt-2">Messages</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-12 h-[calc(80vh-120px)]">
            {/* Left sidebar - conversations list */}
            <div className="col-span-4 border-r border-gray-200 overflow-y-auto">
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder="Search conversations"
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {loading ? (
                  <div className="p-4 text-center">
                    <span className="animate-spin inline-block h-5 w-5 border-2 border-linkedout-blue border-t-transparent rounded-full mr-2"></span>
                    Loading conversations...
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    {searchQuery ? 'No conversations match your search' : 'No conversations yet'}
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <div
                      key={conv.contact.uid}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${activeConversation === conv.contact.uid ? 'bg-blue-50' : ''}`}
                      onClick={() => setActiveConversation(conv.contact.uid)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                          {conv.contact.photo_url ? (
                            <img
                              src={conv.contact.photo_url}
                              alt={conv.contact.display_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              {conv.contact.display_name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline">
                            <h3 className="font-medium text-gray-900 truncate">{conv.contact.display_name}</h3>
                            {conv.lastMessage && (
                              <span className="text-xs text-gray-500">
                                {formatTime(conv.lastMessage.created_at)}
                              </span>
                            )}
                          </div>
                          {conv.contact.headline && (
                            <p className="text-xs text-gray-500 truncate">{conv.contact.headline}</p>
                          )}
                          {conv.lastMessage && (
                            <p className={`text-sm truncate ${!conv.lastMessage.read && !conv.lastMessage.sent_by_me ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                              {conv.lastMessage.sent_by_me ? 'You: ' : ''}{conv.lastMessage.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Right side - message thread */}
            <div className="col-span-8 flex flex-col">
              {activeConversation ? (
                <>
                  {/* Conversation header */}
                  <div className="p-4 border-b border-gray-200 flex items-center">
                    {conversations.find(c => c.contact.uid === activeConversation)?.contact && (
                      <>
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                          {conversations.find(c => c.contact.uid === activeConversation)?.contact.photo_url ? (
                            <img
                              src={conversations.find(c => c.contact.uid === activeConversation)?.contact.photo_url || ''}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              {conversations.find(c => c.contact.uid === activeConversation)?.contact.display_name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {conversations.find(c => c.contact.uid === activeConversation)?.contact.display_name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {conversations.find(c => c.contact.uid === activeConversation)?.contact.headline || ''}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto">
                    {messages.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-gray-500">
                        No messages yet. Start the conversation!
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                message.sender_id === currentUserId
                                  ? 'bg-linkedout-blue text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p>{message.content}</p>
                              <p className={`text-xs mt-1 ${message.sender_id === currentUserId ? 'text-blue-100' : 'text-gray-500'}`}>
                                {formatTime(message.created_at)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Message input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        className="flex-1"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                      />
                      <Button 
                        onClick={sendMessage} 
                        disabled={!messageText.trim()}
                        className="bg-linkedout-blue"
                      >
                        <Send size={18} />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <Card className="max-w-md mx-auto">
                    <CardHeader>
                      <h3 className="text-xl font-semibold text-center">Your Messages</h3>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="mb-4">
                        Select a conversation from the sidebar or start a new one from a profile page.
                      </p>
                      <p className="text-sm text-gray-500">
                        Connect with professionals by sending them a message!
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;