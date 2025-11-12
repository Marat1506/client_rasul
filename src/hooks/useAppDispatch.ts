import {useDispatch} from 'react-redux';

import type {AppDispatch} from '@/redux';

const useAppDispatch: () => AppDispatch = useDispatch;

export default useAppDispatch;
 