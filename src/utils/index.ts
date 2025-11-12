import {url_slug} from 'cyrillic-slug';

const hex = (value: any) => {
    return Math.floor(value).toString(16);
};

export const objectId = () => {
    return hex(Date.now() / 1000) + ' '.repeat(16).replace(/./g, () => hex(Math.random() * 16));
}; 

export const toSlug = (title: string) => {
    return url_slug(title);
};

export const getCurrentDate = () => {
    const current = new Date();
    const options: Intl.DateTimeFormatOptions = {weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'};
    return current.toLocaleDateString('en-US', options);
};

export const getCurrentTime = () => {
    const current = new Date();
    const hours = current.getHours();
    const minutes = current.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

export const formatDate = (timestamp: number) => {
    const messageDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        return messageDate.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    }
};