# Admin Panel Integration Guide

## Overview
The admin panel has been configured to show only registered users from the platform. Initially, all sections will show 0 users/requests/chats since no one has registered yet.

## Current State
- **Dashboard**: Shows 0 users, 0 requests, 0 chats, 0% growth
- **User Management**: Empty table with message "Пока нет зарегистрированных пользователей на платформе"
- **Request Management**: Empty table with message "Пока нет заявок от зарегистрированных пользователей"
- **Chat Management**: Empty table with message "Пока нет чатов от зарегистрированных пользователей"

## API Integration Points

### 1. User Management (`UserManagement/AdminLayout.tsx`)
```typescript
// TODO: Replace with actual API call to get all users
// Example: const response = await Api.getAllUsers();
// const registeredUsers = response.data.filter(user => user.isRegistered);
// setUsers(registeredUsers);
```

### 2. Request Management (`RequestManagement/AdminLayout.tsx`)
```typescript
// TODO: Replace with actual API call to get all requests
// Only show requests from registered platform users
// const response = await Api.getAllRequests();
// const requestsFromRegisteredUsers = response.data.filter(request => 
//   request.userId && registeredUserIds.includes(request.userId)
// );
```

### 3. Chat Management (`ChatManagement/AdminLayout.tsx`)
```typescript
// TODO: Replace with actual API call to get all conversations
// Only show conversations from registered platform users
// const response = await Api.getAllConversations();
// const conversationsFromRegisteredUsers = response.data.filter(conversation => 
//   conversation.userId && registeredUserIds.includes(conversation.userId)
// );
```

### 4. Dashboard (`Dashboard/AdminLayout.tsx`)
```typescript
// TODO: Replace with actual API calls to get dashboard statistics
// const usersResponse = await Api.getUsersCount();
// const requestsResponse = await Api.getRequestsCount();
// const chatsResponse = await Api.getActiveChatsCount();
```

## Expected Behavior After Integration

1. **When a user registers**: They will appear in the User Management section
2. **When a registered user submits a request**: It will appear in Request Management
3. **When a registered user starts a chat**: It will appear in Chat Management
4. **Dashboard will update**: To reflect real numbers based on registered users

## Access Control
- Only users with `role: 'admin'` or `role: 'moderator'` can access the admin panel
- Admin panel link appears in the navbar for authorized users
- All admin routes are protected with role-based access control

## Navigation
- Admin panel accessible at `/admin`
- Individual sections:
  - `/admin` - Dashboard
  - `/admin/users` - User Management
  - `/admin/requests` - Request Management
  - `/admin/content` - Content Management (About Us, FAQ)
  - `/admin/chat` - Chat Management
  - `/admin/profile` - Admin Profile/Settings

## Future Enhancements
1. Real-time updates when new users register
2. WebSocket integration for live chat management
3. Email notifications for new requests
4. Export functionality for user lists and reports
5. Advanced filtering and search capabilities

## Notes
- All components are designed to handle empty states gracefully
- User-friendly messages are displayed when no data is available
- The UI is fully responsive and works on all device sizes
- All text is in Russian as requested