import {createReducer} from '@reduxjs/toolkit';

import {
    about,
    aboutUs,
    advantages,
    banner,
    faq,
    footer,
    leaveRequest,
    requests,
    reviews,
    users
} from '@/redux/actions/contents';
 
interface InitialState {
    faq: {
        data: any
        isLoading: boolean,
        isFail: boolean,
    },
    banner: {
        data: any
        isLoading: boolean,
        isFail: boolean,
    },
    leaveRequest: {
        data: any
        isLoading: boolean,
        isFail: boolean,
    },
    advantages: {
        data: any
        isLoading: boolean,
        isFail: boolean,
    },
    requests: {
        data: any
        isLoading: boolean,
        isFail: boolean,
    },
    about: {
        data: any
        isLoading: boolean,
        isFail: boolean,
    },
    users: {
        data: any
        isLoading: boolean,
        isFail: boolean,
    },
    reviews: {
        data: any
        isLoading: boolean,
        isFail: boolean,
    },
    footer: {
        data: any
        isLoading: boolean,
        isFail: boolean,
    },
    aboutUs: {
        data: any
        isLoading: boolean,
        isFail: boolean,
    },
    logo: {
        data: any
        isLoading: boolean,
        isFail: boolean,
    },
}

const initialState: InitialState = {
    faq: {
        data: [],
        isLoading: true,
        isFail: false,
    },
    banner: {
        data: [],
        isLoading: true,
        isFail: false,
    },
    leaveRequest: {
        data: [],
        isLoading: true,
        isFail: false,
    },
    advantages: {
        data: [],
        isLoading: true,
        isFail: false,
    },
    requests: {
        data: [],
        isLoading: true,
        isFail: false,
    },
    about: {
        data: [],
        isLoading: true,
        isFail: false,
    },
    users: {
        data: [],
        isLoading: true,
        isFail: false,
    },
    reviews: {
        data: [],
        isLoading: true,
        isFail: false,
    },
    footer: {
        data: [],
        isLoading: true,
        isFail: false,
    },
    aboutUs: {
        data: [],
        isLoading: true,
        isFail: false,
    },
    logo: {
        data: [],
        isLoading: true,
        isFail: false,
    },
};

export default createReducer(initialState, (builder) => {
    builder
        .addCase(faq.pending, (state) => {
            state.faq.isLoading = true;
        })
        .addCase(faq.fulfilled, (state, action) => {
            state.faq.isLoading = false;
            state.faq.data = action.payload;
        })
        .addCase(faq.rejected, (state) => {
            state.faq.isFail = true;
        })

        //----------------------------------------//

        .addCase(banner.pending, (state) => {
            state.banner.isLoading = true;
        })
        .addCase(banner.fulfilled, (state, action) => {
            state.banner.isLoading = false;
            state.banner.data = action.payload;
        })
        .addCase(banner.rejected, (state) => {
            state.banner.isFail = true;
        })

        //----------------------------------------//

        .addCase(leaveRequest.pending, (state) => {
            state.leaveRequest.isLoading = true;
        })
        .addCase(leaveRequest.fulfilled, (state, action) => {
            state.leaveRequest.isLoading = false;
            state.leaveRequest.data = action.payload;
        })
        .addCase(leaveRequest.rejected, (state) => {
            state.leaveRequest.isFail = true;
        })

        //----------------------------------------//

        .addCase(advantages.pending, (state) => {
            state.advantages.isLoading = true;
        })
        .addCase(advantages.fulfilled, (state, action) => {
            state.advantages.isLoading = false;
            state.advantages.data = action.payload;
        })
        .addCase(advantages.rejected, (state) => {
            state.advantages.isFail = true;
        })

        //----------------------------------------//

        .addCase(about.pending, (state) => {
            state.about.isLoading = true;
        })
        .addCase(about.fulfilled, (state, action) => {
            state.about.isLoading = false;
            state.about.data = action.payload;
        })
        .addCase(about.rejected, (state) => {
            state.about.isFail = true;
        })

        //----------------------------------------//

        .addCase(users.pending, (state) => {
            state.users.isLoading = true;
        })
        .addCase(users.fulfilled, (state, action) => {
            state.users.isLoading = false;
            state.users.data = action.payload;
        })
        .addCase(users.rejected, (state) => {
            state.users.isFail = true;
        })

        //----------------------------------------//

        .addCase(requests.pending, (state) => {
            state.requests.isLoading = true;
        })
        .addCase(requests.fulfilled, (state, action) => {
            state.requests.isLoading = false;
            state.requests.data = action.payload;
        })
        .addCase(requests.rejected, (state) => {
            state.requests.isFail = true;
        })

        //----------------------------------------//

        .addCase(reviews.pending, (state) => {
            state.reviews.isLoading = true;
        })
        .addCase(reviews.fulfilled, (state, action) => {
            state.reviews.isLoading = false;
            state.reviews.data = action.payload;
        })
        .addCase(reviews.rejected, (state) => {
            state.reviews.isFail = true;
        })

        //----------------------------------------//

        .addCase(footer.pending, (state) => {
            state.footer.isLoading = true;
        })
        .addCase(footer.fulfilled, (state, action) => {
            state.footer.isLoading = false;
            state.footer.data = action.payload;
        })
        .addCase(footer.rejected, (state) => {
            state.footer.isFail = true;
        })

        //----------------------------------------//

        .addCase(aboutUs.pending, (state) => {
            state.aboutUs.isLoading = true;
        })
        .addCase(aboutUs.fulfilled, (state, action) => {
            state.aboutUs.isLoading = false;
            state.aboutUs.data = action.payload;
        })
        .addCase(aboutUs.rejected, (state) => {
            state.aboutUs.isFail = true;
        });

});