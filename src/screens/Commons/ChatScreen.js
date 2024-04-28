import React, { useEffect, useState } from 'react';
import { Alert, Text } from 'react-native';
import { GiftedChat, MessageContainer } from 'react-native-gifted-chat';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

const socket = io('http://192.168.1.5:8000'); // Replace 'http://your-server-url' with your server URL

const ChatScreen = () => {
    const [messages, setMessages] = useState([]);
    const { userId } = useSelector(state => state.userReducer)


    useEffect(() => {
        socket.emit('join', userId);
        // socket.on('chat message', handleReceiveMessage);

        socket.on("chat message", handleReceiveMessage);

        return () => {
            socket.off('chat message', handleReceiveMessage);
        };
    }, [socket]);

    const handleReceiveMessage = ({ content, from, socketId }) => {

        console.warn(socket.id != socketId)
        setMessages((prevMessages) => GiftedChat.append(prevMessages, [{ ...content[0], other: socket.id != socketId }]));
    };

    const handleSendMessage = (newMessages) => {
        // setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
        socket.emit("chat message", {
            content: newMessages,
            to: userId,
        });
    };


    // Custom message renderer to set alignment based on sender
    const renderMessage = (messageProps) => {
        const { currentMessage } = messageProps;
        return (
            <MessageContainer
                {...messageProps}
                position={'right'} // Set alignment based on sender's ID
            />
        );
    };



    if (socket.connected) {
        return (
            <GiftedChat
                messages={messages}
                // renderMessage={renderMessage}
                onSend={handleSendMessage}
                user={{ _id: userId }} // Change this to your user ID
            />
        );
    } else {
        return <Text>Connecting please wait</Text>
    }
};






export default ChatScreen;
