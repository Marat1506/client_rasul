import { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import { useSocket } from '@/hooks/useSocket';
import { RootState } from '@/redux';

interface Message {
    _id: string;
    text: string;
    posted: number;
    // другие поля сообщения
}

interface Room {
    _id: string;
    title: string;
    // другие поля из вашего объекта чата
}

export const useLatestMessages = (rooms: Room[]) => {
    const [latestMessages, setLatestMessages] = useState<Record<string, Message>>({});
    const { emit, on, off } = useSocket();
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (!rooms.length) return;

        const handleLatestMessage = ({ room, message }: { room: string, message: Message }) => {
            setLatestMessages(prev => ({
                ...prev,
                [room]: message
            }));
        };

        on('latestMessageResponse', handleLatestMessage);

        rooms.forEach(room => {
            emit('latestMessage', {
                room: room._id,
                user: user._id
            });
        });

        return () => {
            off('latestMessageResponse');
        };
    }, [rooms, user._id, emit]);

    return latestMessages;
};