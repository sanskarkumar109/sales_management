# Retail Sales Management System

## Overview
A full-stack web application for managing and analyzing retail sales data with advanced search, filtering, sorting, and pagination capabilities. Built with React and Node.js, this system provides an intuitive interface for tracking sales transactions, analyzing customer behavior, and monitoring product performance in real-time.

## Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **CORS** - Cross-origin resource sharing middleware

## Features

### Core Functionality
- ✅ **Full-Text Search** - Search across customer names and phone numbers
- ✅ **Advanced Filtering** - Multi-select filters for regions, categories, payment methods, and more
- ✅ **Dynamic Sorting** - Sort by date, quantity, or customer name
- ✅ **Pagination** - Efficient data loading with 10 items per page
- ✅ **Responsive Design** - Works seamlessly on desktop and mobile devices
- ✅ **Real-Time Updates** - Instant UI feedback on all interactions

### Search Capabilities
- Case-insensitive search
- Searches customer names and phone numbers simultaneously
- Works alongside active filters and sorting
- Real-time results as you type

### Filter Options
- **Customer Region** - Filter by geographical regions
- **Gender** - Male/Female filtering
- **Age Range** - Min/Max age selection
- **Product Category** - Filter by product types
- **Tags** - Multi-tag filtering support
- **Payment Method** - Credit Card, Cash, UPI, etc.
- **Date Range** - Filter by specific date periods

### Additional Features
- Loading states for better UX
- Empty state handling
- Filter badge counter
- Clear all filters option
- Persistent state across operations

## Search Implementation Summary
Implements case-insensitive full-text search across Customer Name and Phone Number fields using JavaScript string matching. Search queries are normalized and matched against field values in real-time, maintaining full compatibility with active filters and sorting operations. The search uses toLowerCase() for normalization and includes() for substring matching, providing instant results without database overhead.

## Filter Implementation Summary
Multi-select filtering system supporting seven filter categories: Customer Region, Gender, Age Range, Product Category, Tags, Payment Method, and Date Range. Filters operate independently and in combination using array-based matching for categorical data and range validation for numeric/date fields. The implementation uses functional programming patterns with immutable data operations, ensuring filter state persistence across pagination and sorting. Multi-select filters within the same category use OR logic, while different categories use AND logic for precise data refinement.

## Sorting Implementation Summary
Dynamic sorting supporting six sort options: Date (newest/oldest first), Quantity (high/low), and Customer Name (A-Z/Z-A). Implemented using JavaScript's native sort() function with custom comparator functions for each data type. Date sorting uses Date object comparison, quantity uses numeric comparison, and name sorting uses localeCompare() for proper alphabetical ordering. Sorting operations preserve active search queries and all filter selections, maintaining consistent user context throughout the application.

## Pagination Implementation Summary
Server-side pagination implementation with 10 items per page using offset-based slicing. The system calculates start and end indices based on current page number and page size, then returns the appropriate data slice along with pagination metadata (current page, total pages, total items). State consistency is maintained across all filter, search, and sort operations through React's useEffect hooks. Navigation controls include Previous/Next buttons with proper disabled states at boundaries, ensuring seamless user experience.

## Project Structure

```
retail-sales-management/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── salesController.js      # Request handlers
│   │   ├── services/
│   │   │   └── salesService.js         # Business logic
│   │   ├── utils/
│   │   │   ├── dataLoader.js           # JSON data loading
│   │   │   └── dataProcessor.js        # Filter, sort, paginate
│   │   ├── routes/
│   │   │   └── salesRoutes.js          # API endpoints
│   │   └── index.js                    # Server entry point
│   ├── data/
│   │   └── sales.json                  # Sales dataset
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── SalesManagement.jsx     # Main component
│   │   ├── styles/
│   │   │   └── index.css               # Global styles
│   │   ├── App.jsx                     # Root component
│   │   └── main.jsx                    # Entry point
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── README.md
│
├── docs/
│   └── architecture.md                 # System architecture
│
└── README.md                           # This file
```

## Setup Instructions

### Prerequisites
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - For version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sanskarkumar109/sales_management.git
   cd retail-sales-management
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Add your data**
   
   Place your `sales.json` file in the `backend/data/` directory:
   ```bash
   backend/data/sales.json
   ```

   The JSON file should be an array of sales objects with the following structure:
   ```json
   [
     {
       "Customer ID": "C001",
       "Customer Name": "John Doe",
       "Phone Number": "9876543210",
       "Gender": "Male",
       "Age": 30,
       "Customer Region": "North",
       "Product Name": "Laptop",
       "Brand": "Dell",
       "Product Category": "Electronics",
       "Quantity": 2,
       "Final Amount": 90000,
       "Date": "2024-01-15",
       "Payment Method": "Credit Card",
       "Order Status": "Delivered"
     }
   ]
   ```

### Running the Application

#### Development Mode

1. **Start the backend server** (Terminal 1)
   ```bash
   cd backend
   npm start
   ```
   
   Server will run on: `http://localhost:3000`
   
   You should see:
   ```
   Server is running on port 3000
   Loaded X sales records from JSON
   ```

2. **Start the frontend dev server** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```
   
   Frontend will run on: `http://localhost:5173`
   
   You should see:
   ```
   VITE v5.0.8  ready in 500 ms
   ➜  Local:   http://localhost:5173/
   ```

3. **Open your browser**
   
   Navigate to `http://localhost:5173` to use the application

#### Production Build

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```
   
   This creates an optimized production build in `frontend/dist/`

2. **Preview the production build**
   ```bash
   npm run preview
   ```

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### 1. Get Sales Data
```http
GET /api/sales
```

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | number | Page number (default: 1) | `page=1` |
| `limit` | number | Items per page (default: 10) | `limit=10` |
| `sortBy` | string | Sort field and direction | `sortBy=date_desc` |
| `search` | string | Search term | `search=john` |
| `regions` | string | Comma-separated regions | `regions=North,South` |
| `genders` | string | Comma-separated genders | `genders=Male,Female` |
| `ageMin` | number | Minimum age | `ageMin=25` |
| `ageMax` | number | Maximum age | `ageMax=50` |
| `categories` | string | Comma-separated categories | `categories=Electronics` |
| `tags` | string | Comma-separated tags | `tags=Premium,Sale` |
| `paymentMethods` | string | Comma-separated methods | `paymentMethods=Credit Card` |
| `dateStart` | string | Start date (YYYY-MM-DD) | `dateStart=2024-01-01` |
| `dateEnd` | string | End date (YYYY-MM-DD) | `dateEnd=2024-12-31` |

**Sort Options:**
- `date_desc` - Date (Newest First)
- `date_asc` - Date (Oldest First)
- `quantity_desc` - Quantity (High to Low)
- `quantity_asc` - Quantity (Low to High)
- `name_asc` - Customer Name (A-Z)
- `name_desc` - Customer Name (Z-A)

**Response:**
```json
{
  "data": [
    {
      "Customer Name": "John Doe",
      "Phone Number": "9876543210",
      "Product Name": "Laptop",
      "Quantity": 2,
      "Final Amount": 90000,
      "Date": "2024-01-15",
      "Payment Method": "Credit Card",
      "Order Status": "Delivered"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 95,
    "itemsPerPage": 10
  }
}
```

#### 2. Get Filter Options
```http
GET /api/filters
```

**Response:**
```json
{
  "regions": ["North", "South", "East", "West"],
  "genders": ["Male", "Female"],
  "categories": ["Electronics", "Clothing", "Food"],
  "tags": ["Premium", "Sale", "New"],
  "paymentMethods": ["Credit Card", "Cash", "UPI"]
}
```

#### 3. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

## Usage Guide

### Basic Search
1. Type in the search bar to find customers by name or phone number
2. Results update in real-time
3. Search works with active filters

### Applying Filters
1. Click the "Filters" button to open the filter panel
2. Select multiple options from any filter category
3. Filters apply automatically
4. View active filter count on the Filters button
5. Click "Clear All" to reset filters

### Sorting Data
1. Use the sort dropdown next to the Filters button
2. Choose from 6 sorting options
3. Sorting preserves search and filters

### Navigation
1. Use Previous/Next buttons at the bottom
2. View current page and total pages
3. Buttons disable at first/last page

## Development

### Running in Development Mode

**Backend with auto-reload:**
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

**Frontend with hot reload:**
```bash
cd frontend
npm run dev  # Vite provides instant HMR
```

### Code Structure

**Backend follows MVC pattern:**
- **Routes** - Define API endpoints
- **Controllers** - Handle requests and responses
- **Services** - Business logic and data processing
- **Utils** - Helper functions (load, filter, sort, paginate)

**Frontend uses component-based architecture:**
- **Components** - Reusable UI elements
- **Hooks** - useState, useEffect for state management
- **Styles** - Tailwind utility classes

### Adding New Features

**Adding a new filter:**
1. Update filter state in `SalesManagement.jsx`
2. Add filter UI in the filters panel
3. Update `filterData()` in `dataProcessor.js`
4. Add filter option extraction in `salesService.js`

**Adding a new sort option:**
1. Add option to sort dropdown in `SalesManagement.jsx`
2. Add case in `sortData()` in `dataProcessor.js`

## Deployment

### Backend Deployment (Railway/Render)

1. **Connect Repository**
   - Link your GitHub repository
   - Set root directory to `backend`

2. **Configure Build**
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Environment Variables**
   - `PORT` - Will be auto-assigned
   - `NODE_ENV=production`

### Frontend Deployment (Vercel/Netlify)

1. **Connect Repository**
   - Link your GitHub repository
   - Set root directory to `frontend`

2. **Configure Build**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Update Frontend Code**
   
   In `frontend/src/components/SalesManagement.jsx`:
   ```javascript
   const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
   ```

### Post-Deployment

1. Test all functionality on live URLs
2. Update README with live application URL
3. Verify CORS settings if needed

## Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Kill the process using port 3000
# Linux/Mac:
lsof -ti:3000 | xargs kill -9
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**CSV/JSON file not found:**
- Ensure file is in `backend/data/sales.json`
- Check file permissions
- Verify file is valid JSON

**No data loading:**
- Check console for error messages
- Verify JSON format matches expected structure
- Check file path in `dataLoader.js`

### Frontend Issues

**API connection failed:**
- Ensure backend is running on port 3000
- Check CORS configuration
- Verify API_BASE URL is correct

**Styles not loading:**
```bash
# Reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Build errors:**
- Clear build cache: `rm -rf dist .vite`
- Update dependencies: `npm update`

## Performance Optimization

### Current Optimizations
- Data cached in memory after first load
- Efficient array filtering and sorting
- Pagination reduces data transfer
- React memo and useCallback for expensive operations

### Future Improvements
- Implement debouncing for search input
- Add virtual scrolling for large datasets
- Implement Redis caching for API responses
- Add database indexing when scaling

## Testing

### Manual Testing Checklist

**Search:**
- [ ] Search by customer name
- [ ] Search by phone number
- [ ] Case-insensitive search
- [ ] Search with filters active

**Filters:**
- [ ] Single filter selection
- [ ] Multiple filter combinations
- [ ] Age range validation
- [ ] Date range validation
- [ ] Clear all filters

**Sorting:**
- [ ] Sort by date (both directions)
- [ ] Sort by quantity (both directions)
- [ ] Sort by name (both directions)
- [ ] Sort with filters active

**Pagination:**
- [ ] Next/Previous navigation
- [ ] First page (Previous disabled)
- [ ] Last page (Next disabled)
- [ ] Page numbers accurate

**Edge Cases:**
- [ ] No search results
- [ ] Empty filters
- [ ] Invalid age range
- [ ] Invalid date range

## Contributing

### Code Style

**JavaScript:**
- Use ES6+ features
- Consistent naming (camelCase for variables, PascalCase for components)
- Add comments for complex logic
- Keep functions small and focused

**React:**
- Functional components with hooks
- PropTypes for type checking
- Meaningful component names
- Extract reusable components

### Git Workflow

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and commit: `git commit -m "Add new feature"`
3. Push to branch: `git push origin feature/new-feature`
4. Create Pull Request

## License

This project is created for the TruEstate SDE Intern Assignment.

## Support

For issues or questions:
- Create an issue in the repository
- Contact: [0703krsanskar@gmail.com]

## Acknowledgments

- Built with React and Express.js
- UI components inspired by modern design systems
- Icons by Lucide React

---

**Live Demo:** [Add your deployed URL here]

**Repository:** [Add your GitHub URL here]

**Submission Date:** December 08, 2025

---

Made with ❤️ for TruEstate SDE Intern Assignment
