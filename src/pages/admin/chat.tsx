import React from 'react';
import {useEffect} from 'react';

import {useRouter} from 'next/router';
import {useSelector} from 'react-redux';

import ChatManagement from '@/components/Admin/ChatManagement';
import AdminLayout from '@/layout/AdminLayout';
import {RootState} from '@/redux';

const AdminChatPage = () => {
    return (
        <ChatManagement/>
    );
};

export default AdminChatPage; 