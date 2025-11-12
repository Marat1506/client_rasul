import {configureStore} from '@reduxjs/toolkit';

import auth from './reducers/auth';
import chat from './reducers/chat';
import contents from './reducers/contents';
import pages from './reducers/pages';

export const store = configureStore({
    reducer: {
        contents,
        pages,
        auth,
        chat,
    },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 