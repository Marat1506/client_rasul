import React from 'react';
import {useEffect} from 'react';

import {useRouter} from 'next/router';
import {useSelector} from 'react-redux';

import ContentManagement from '@/components/Admin/ContentManagement';
import AdminLayout from '@/layout/AdminLayout';
import {RootState} from '@/redux';

const AdminContentPage = () => {
    return (
        <ContentManagement/>
    );
};


export default AdminContentPage; 