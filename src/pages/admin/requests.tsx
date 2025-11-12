import React from 'react';
import {useEffect} from 'react';

import {useRouter} from 'next/router';
import {useSelector} from 'react-redux';

import RequestManagement from '@/components/Admin/RequestManagement';
import AdminLayout from '@/layout/AdminLayout';
import {RootState} from '@/redux';

const AdminRequestsPage = () => {
    return (
        <RequestManagement/>
    );
};

export default AdminRequestsPage; 