import axios from 'axios';

import {getCookie} from '@/hooks/cookies';
import {Leads, LogIn, Register, User} from '@/interfaces';
import {
    ABOUT,
    ABOUT_US,
    ADD_REVIEW,
    ADVANTAGES, ALL_USERS,
    BANNER,
    CAPTCHA,
    FAQ,
    FOOTER, FORGOT_PASSWORD, GET_CURRENT_USER,
    GET_PAGES,
    LEADS,
    LEAVE_REQUEST,
    LOGIN,
    NEW_PASSWORD,
    OTP,
    PASSWORD,
    REGISTER, REQUESTS,
    RESET_PASSWORD,
    RESETTING_USER,
    REVIEWS,
    SOCIAL,
    UPLOAD_IMAGE, UPLOAD_FILE, USERS,
    VERIFY,
    CHAT_CONVERSATIONS,
    CHAT_MESSAGES,
    CHAT_STATS,
} from '@/services/edpoints';
import http from '@/services/http';


class Api {
    static getFaq() {
        return http.get(FAQ);
    }

    static deleteFaq(id) {
        return http.delete(`${FAQ}/${id}`);
    }

    static updateFaq(payload: { answer: string, question: string, id: string }) {
        return http.patch(`${FAQ}/${payload.id}`, {answer: payload.answer, question: payload.question});
    }

    static createFaq(payload: { answer: string, question: string }) {
        return http.post(FAQ, payload);
    }

    static getBanner() {
        return http.get(BANNER);
    }

    static leaveRequest() {
        return http.get(LEAVE_REQUEST);
    }

    static advantages() {
        return http.get(ADVANTAGES);
    }

    static getAboutData() {
        return http.get(ABOUT);
    }

    static footer() {
        return http.get(FOOTER);
    }

    static aboutUs() {
        return http.get(ABOUT_US);
    }

    static updateAbout(payload: { about: string, video: string }) {
        return http.patch(ABOUT_US, payload);
    }

    static users() {
        return http.get(ALL_USERS);
    }

    static requests() {
        return http.get(REQUESTS);
    }

    static deleteRequest(id: string) {
        return http.delete(`${REQUESTS}/${id}`);
    }

    static deleteUser(userIds: string[]) {
        return http.delete(USERS, {
            data: { userIds },
        });
    }

    static getPage(page: string) {
        return http.get(GET_PAGES, {
            params: {
                slug: page,
            },
        });
    }

    static getLogo(logo: string) {
        return;
    }

    static register(payload: Register) {
        return http.post(REGISTER, payload);
    }

    static login(payload: LogIn) {
        return http.post(LOGIN, payload);
    }

    static getCurrentUser() {
        return http.get(GET_CURRENT_USER);
    }

    static leads(payload: Leads) {
        return http.post(LEADS, payload);
    }

    static captcha(token: string | null) {
        return axios.post(CAPTCHA, {token});
    }

    static resettingUser(payload: User) {
        return http.patch(RESETTING_USER, payload);
    }

    static uploadImage(file: any) {
        const formData = new FormData();
        formData.append('file', file);

        return http.post(UPLOAD_IMAGE, formData, {
            headers: {'Content-Type': 'multipart/form-data'},
        });
    }

  static uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return http.post(UPLOAD_FILE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

    static resetPassword(password: string) {
        return http.post(RESET_PASSWORD, {password, token: getCookie('token')});
    }

    static resetPasswordWithToken(token: string, newPassword: string) {
        return http.post(RESET_PASSWORD, { token, newPassword });
    }

    static newPassword(payload: any) {
        // Используем новый эндпоинт для сброса пароля по токену
        if (payload.token && payload.newPassword) {
            return http.post(RESET_PASSWORD, { token: payload.token, newPassword: payload.newPassword });
        }
        // Fallback для старого API (если нужно)
        return http.post(NEW_PASSWORD, payload);
    }

    static getOtpByPhone(phone: string) {
        return http.post(OTP, {phone});
    }

    static verifyByPhone(payload: { otp: string; phone: string }) {
        return http.post(VERIFY, payload);
    }

    static addReview(payload: any) {
        return http.post(ADD_REVIEW, payload);
    }

    static getReviews() {
        return http.get(REVIEWS);
    }

    static social() {
        return http.get(SOCIAL);
    }

    static changePassword({oldPassword, newPassword}) {
        return http.put(PASSWORD, {oldPassword, newPassword});
    }

    static forgot_password(email: string) {
        return http.post(FORGOT_PASSWORD, {email});
    }

    // Chat methods
    static createConversation(priority: 'low' | 'medium' | 'high' = 'medium') {
        return http.post(CHAT_CONVERSATIONS, { priority });
    }

    static getConversations(params?: { status?: string; user_id?: string; search?: string }) {
        return http.get(CHAT_CONVERSATIONS, { params });
    }

    static getMyConversations() {
        return http.get(`${CHAT_CONVERSATIONS}/my`);
    }

    static getConversationById(id: string) {
        return http.get(`${CHAT_CONVERSATIONS}/${id}`);
    }

    static updateConversation(id: string, data: { status?: string; priority?: string }) {
        return http.put(`${CHAT_CONVERSATIONS}/${id}`, data);
    }

    static deleteConversation(id: string) {
        return http.delete(`${CHAT_CONVERSATIONS}/${id}`);
    }

    static sendMessage(conversationId: string, content: string) {
        return http.post(CHAT_MESSAGES, { conversation_id: conversationId, content });
    }

    static getMessages(conversationId: string, limit = 50, offset = 0) {
        return http.get(`${CHAT_CONVERSATIONS}/${conversationId}/messages`, {
            params: { limit, offset },
        });
    }

    static markAsRead(conversationId: string) {
        return http.put(`${CHAT_CONVERSATIONS}/${conversationId}/read`);
    }

    static getChatStats() {
        return http.get(CHAT_STATS);
    }
}

export default Api;
