# System Architecture

## Overview
The Retail Sales Management System follows a client-server architecture with clear separation between frontend presentation and backend data processing.

## Backend Architecture

### Structure
```
backend/
├── controllers/     # Handle HTTP requests and responses
├── services/        # Business logic and data processing
├── utils/           # Helper functions and data operations
├── routes/          # API endpoint definitions
└── data/            # CSV data storage
```

### Components

**Controllers Layer**
- `salesController.js`: Handles API requests, validates input, orchestrates service calls
- Responsibilities: Request parsing, response formatting, error handling

**Services Layer**
- `salesService.js`: Core business logic for data retrieval and filtering
- Manages data caching and coordinates data processing operations
- Provides abstraction between controllers and data layer

**Utils Layer**
- `dataLoader.js`: CSV file parsing and initial data loading
- `dataProcessor.js`: Filtering, sorting, and pagination logic
- Stateless, reusable functions for data manipulation

**Routes Layer**
- `salesRoutes.js`: API endpoint definitions and route mapping
- Maps HTTP endpoints to controller methods

### Data Flow (Backend)

1. Client sends HTTP request to Express server
2. Route handler matches endpoint and calls appropriate controller
3. Controller validates and parses query parameters
4. Service layer retrieves and processes data:
   - Loads CSV data (cached after first load)
   - Applies search filtering
   - Applies multi-field filters
   - Sorts results
   - Paginates data
5. Controller formats response and sends to client

### Key Design Decisions

**In-Memory Data Storage**
- CSV loaded once and cached in memory
- Eliminates database dependency
- Fast query performance for assignment scope
- Suitable for read-heavy operations

**Functional Data Processing**
- Immutable data operations
- Chainable filter/sort/paginate functions
- Predictable behavior and easy testing

**Stateless API**
- Each request is independent
- No server-side session management
- Horizontally scalable design

## Frontend Architecture

### Structure
```
frontend/
├── components/      # React components
│   └── SalesManagement.jsx
├── services/        # API communication
├── utils/           # Helper functions
├── hooks/           # Custom React hooks
├── styles/          # CSS and Tailwind
└── main.jsx         # Application entry
```

### Components

**SalesManagement Component**
- Main application component
- Manages application state (filters, search, pagination, sorting)
- Coordinates API calls and UI updates
- Handles user interactions

**Sub-Components**
- `FilterSection`: Reusable filter group display
- `Checkbox`: Custom checkbox component for multi-select filters

### State Management

**Local State (useState)**
- `sales`: Current page of sales data
- `loading`: Loading indicator state
- `searchTerm`: Search query
- `currentPage`: Active pagination page
- `totalPages`: Total number of pages
- `sortBy`: Active sort field and direction
- `showFilters`: Filter panel visibility
- `filters`: Active filter selections
- `filterOptions`: Available filter values

### Data Flow (Frontend)

1. User interacts with UI (search, filter, sort, paginate)
2. State updates trigger useEffect hooks
3. API request constructed with current state
4. Loading state set to true
5. Axios makes HTTP request to backend
6. Response data updates component state
7. UI re-renders with new data
8. Loading state set to false

### Key Design Decisions

**React Hooks Pattern**
- Functional components with hooks
- `useEffect` for side effects (API calls)
- `useState` for local state management
- `useCallback` for memoized functions (if needed)

**Controlled Components**
- Form inputs controlled by React state
- Single source of truth for all user inputs
- Predictable state updates

**Optimistic State Updates**
- Immediate UI feedback on user actions
- Loading states for async operations
- Error boundaries for graceful failure handling

**Tailwind CSS**
- Utility-first styling approach
- Consistent design system
- Responsive design built-in
- Small bundle size

## API Contract

### Endpoints

**GET /api/sales**
Returns paginated sales data with applied filters

Request:
```
GET /api/sales?page=1&limit=10&sortBy=date_desc&search=john&regions=North,South
```

Response:
```json
{
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 95,
    "itemsPerPage": 10
  }
}
```

**GET /api/filters**
Returns available filter options

Response:
```json
{
  "regions": ["North", "South", "East", "West"],
  "genders": ["Male", "Female"],
  "categories": ["Electronics", "Clothing", ...],
  "tags": ["Premium", "Sale", ...],
  "paymentMethods": ["Credit Card", "Cash", ...]
}
```

## Data Processing Pipeline

### Search
1. Normalize search term (lowercase, trim)
2. Filter records where normalized customer name or phone contains search term
3. Pass filtered results to next stage

### Filtering
1. Apply each active filter as AND condition
2. Multi-select filters use OR within same category
3. Range filters check min/max boundaries
4. Date filters parse and compare date objects
5. Pass filtered results to next stage

### Sorting
1. Create copy of filtered data
2. Apply sort comparator based on selected field
3. Handle ascending/descending direction
4. Use stable sort to maintain order for equal elements
5. Pass sorted results to next stage

### Pagination
1. Calculate start and end indices
2. Slice sorted data array
3. Calculate pagination metadata
4. Return page data with metadata

## Error Handling

**Backend**
- Try-catch blocks in controllers
- Graceful error responses with appropriate HTTP status codes
- Detailed error logging for debugging
- Validation of query parameters

**Frontend**
- Try-catch around API calls
- Error state management
- User-friendly error messages
- Fallback UI for error states

## Performance Considerations

**Backend**
- Data cached after first load (no repeated file reads)
- Efficient array operations for filtering
- Pagination reduces data transfer
- Stateless design enables horizontal scaling

**Frontend**
- Debouncing search input (can be added)
- Lazy loading filter options
- Optimized re-renders with React
- Minimal bundle size with Vite
- Code splitting opportunities

## Security Considerations

- CORS configuration for API access control
- Input validation and sanitization
- No SQL injection risk (no database)
- Rate limiting can be added for production
- Environment variables for sensitive configuration

## Scalability Path

For production scale:
1. Add database (PostgreSQL/MongoDB)
2. Implement caching layer (Redis)
3. Add search engine (Elasticsearch)
4. Implement authentication/authorization
5. Add rate limiting and request throttling
6. Set up monitoring and logging
7. Containerize with Docker
8. Deploy with load balancing

## Testing Strategy

**Backend**
- Unit tests for utilities (filter, sort, paginate)
- Integration tests for API endpoints
- Test edge cases (empty results, invalid ranges)

**Frontend**
- Component unit tests with React Testing Library
- Integration tests for user flows
- E2E tests with Cypress/Playwright

## Module Responsibilities

**Backend**

| Module | Responsibility |
|--------|---------------|
| index.js | Server setup, middleware, error handling |
| salesRoutes.js | Route definitions and mapping |
| salesController.js | Request handling, validation, response formatting |
| salesService.js | Business logic, data orchestration |
| dataLoader.js | CSV parsing and loading |
| dataProcessor.js | Filtering, sorting, pagination algorithms |

**Frontend**

| Module | Responsibility |
|--------|---------------|
| main.jsx | Application bootstrap |
| App.jsx | Root component, provider setup |
| SalesManagement.jsx | Main UI, state management, API coordination |
| FilterSection.jsx | Filter group display |
| Checkbox.jsx | Multi-select checkbox UI |

## Folder Structure Rationale

**Backend**
- Separation by technical role (controllers, services, utils)
- Clear dependency flow: routes → controllers → services → utils
- Easy to locate and modify specific functionality
- Supports test organization

**Frontend**
- Component-based organization
- Services layer abstracts API details
- Utilities for shared helper functions
- Hooks for reusable stateful logic
- Styles centralized for consistency