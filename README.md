# Mini Property Listing Platform

A full-stack web application for managing property listings with authentication, CRUD operations, and advanced search/filtering capabilities.

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt for password hashing
- Cloudinary for image uploads
- Multer for file handling

### Frontend
- Next.js 14 (App Router)
- React
- Tailwind CSS
- Axios for API calls
- React Hot Toast for notifications
- JS Cookie for token management

## Features

### Core Features
- ✅ User Registration & Login with JWT
- ✅ Password hashing with bcrypt
- ✅ Full CRUD for property listings
- ✅ Owner-based authorization (403 for non-owners)
- ✅ Search & Filter (by price range and location)
- ✅ Image upload to Cloudinary
- ✅ Pagination support
- ✅ Responsive design with Tailwind CSS
- ✅ Loading states and toast notifications
- ✅ Form validation and error handling

### Bonus Features
- ✅ Image upload with Cloudinary
- ✅ Server-side pagination
- ✅ Loading spinners
- ✅ Toast notifications
- ✅ Clean, modern UI
- ✅ Edit property functionality

## Project Structure

```
estate/
├── backend/              # Express API server
│   ├── config/          # Database configuration
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth & upload middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── server.js        # Entry point
│
└── frontend/            # Next.js application
    ├── app/             # App router pages
    ├── components/      # Reusable components
    ├── services/        # API service layer
    ├── context/         # React context (Auth)
    └── hooks/           # Custom hooks
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/property-listing
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=http://localhost:3000
```

4. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Properties
- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property (Auth required)
- `PUT /api/properties/:id` - Update property (Owner only)
- `DELETE /api/properties/:id` - Delete property (Owner only)

### Query Parameters for GET /api/properties
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `location` - Location keyword (case-insensitive)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

## Environment Variables

### Backend (.env)
| Variable | Description |
|----------|-------------|
| PORT | Server port (default: 5000) |
| MONGODB_URI | MongoDB connection string |
| JWT_SECRET | Secret key for JWT signing |
| JWT_EXPIRE | Token expiration time |
| CLOUDINARY_* | Cloudinary credentials |
| FRONTEND_URL | Frontend URL for CORS |

### Frontend (.env.local)
| Variable | Description |
|----------|-------------|
| NEXT_PUBLIC_API_URL | Backend API base URL |

## Deployment

### Backend (Render/Railway)
1. Create a new web service
2. Connect your GitHub repository
3. Set environment variables
4. Deploy

### Frontend (Vercel)
1. Import your GitHub repository
2. Set environment variables
3. Deploy

## Design Decisions & Trade-offs

### JWT Storage
- **Choice**: HttpOnly cookie vs Authorization header
- **Decision**: Used Authorization header with js-cookie for simplicity
- **Trade-off**: Less secure against XSS but easier to implement and debug

### Image Upload
- **Choice**: Local storage vs Cloudinary
- **Decision**: Cloudinary for production-ready solution
- **Benefit**: Automatic optimization, CDN, no server storage concerns

### State Management
- **Choice**: Redux vs Context API
- **Decision**: Context API for simplicity
- **Reason**: Application size doesn't warrant Redux complexity

### Styling
- **Choice**: CSS Modules vs Tailwind CSS
- **Decision**: Tailwind CSS for rapid development
- **Benefit**: Consistent design system, faster prototyping

## Edge Cases Handled

1. **Authentication Errors**: Redirect to login on 401
2. **Authorization Errors**: Show 403 for non-owners
3. **Invalid Inputs**: Client and server-side validation
4. **Empty States**: Display messages when no properties found
5. **Network Errors**: Toast notifications with error messages
6. **Image Upload**: File type and size validation
7. **Concurrent Requests**: Loading states prevent multiple submissions

## Testing

Manual testing checklist:
- [ ] User registration with valid/invalid data
- [ ] User login with correct/incorrect credentials
- [ ] Create property with/without image
- [ ] View all properties
- [ ] Filter by price range
- [ ] Filter by location
- [ ] View property details
- [ ] Edit own property
- [ ] Delete own property
- [ ] Attempt to edit/delete other's property (should fail)
- [ ] Pagination works correctly
- [ ] Responsive design on mobile/tablet/desktop

## Future Enhancements

- Property categories/tags
- Advanced search with multiple criteria
- User profiles and favorites
- Property reviews and ratings
- Map integration for location display
- Email notifications
- Admin dashboard
- Analytics and insights

## License

MIT

## Author

Built as part of Full-Stack Intern Take-Home Assignment
