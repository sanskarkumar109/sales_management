import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, X } from 'lucide-react';

const API_BASE = 'http://localhost:3000/api';

const SalesManagement = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('date_desc');
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    regions: [],
    genders: [],
    ageRange: { min: '', max: '' },
    categories: [],
    tags: [],
    paymentMethods: [],
    dateRange: { start: '', end: '' }
  });

  const [filterOptions, setFilterOptions] = useState({
    regions: [],
    genders: [],
    categories: [],
    tags: [],
    paymentMethods: []
  });

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchSales();
  }, [currentPage, sortBy, searchTerm, filters]);

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch(`${API_BASE}/filters`);
      const data = await response.json();
      setFilterOptions(data);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const fetchSales = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        sortBy: sortBy,
        search: searchTerm
      });

      if (filters.regions.length) params.append('regions', filters.regions.join(','));
      if (filters.genders.length) params.append('genders', filters.genders.join(','));
      if (filters.ageRange.min) params.append('ageMin', filters.ageRange.min);
      if (filters.ageRange.max) params.append('ageMax', filters.ageRange.max);
      if (filters.categories.length) params.append('categories', filters.categories.join(','));
      if (filters.tags.length) params.append('tags', filters.tags.join(','));
      if (filters.paymentMethods.length) params.append('paymentMethods', filters.paymentMethods.join(','));
      if (filters.dateRange.start) params.append('dateStart', filters.dateRange.start);
      if (filters.dateRange.end) params.append('dateEnd', filters.dateRange.end);

      const response = await fetch(`${API_BASE}/sales?${params}`);
      const data = await response.json();
      
      setSales(data.data);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const current = prev[filterType];
      if (Array.isArray(current)) {
        return {
          ...prev,
          [filterType]: current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value]
        };
      }
      return { ...prev, [filterType]: value };
    });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      regions: [],
      genders: [],
      ageRange: { min: '', max: '' },
      categories: [],
      tags: [],
      paymentMethods: [],
      dateRange: { start: '', end: '' }
    });
    setCurrentPage(1);
  };

  const activeFilterCount = 
    filters.regions.length + 
    filters.genders.length + 
    filters.categories.length + 
    filters.tags.length + 
    filters.paymentMethods.length +
    (filters.ageRange.min || filters.ageRange.max ? 1 : 0) +
    (filters.dateRange.start || filters.dateRange.end ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Management</h1>
          <p className="text-gray-600">Track and analyze retail sales transactions</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by customer name or phone..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 relative"
            >
              <Filter className="w-5 h-5" />
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="date_desc">Date (Newest First)</option>
              <option value="date_asc">Date (Oldest First)</option>
              <option value="quantity_desc">Quantity (High to Low)</option>
              <option value="quantity_asc">Quantity (Low to High)</option>
              <option value="name_asc">Customer Name (A-Z)</option>
              <option value="name_desc">Customer Name (Z-A)</option>
            </select>
          </div>

          {showFilters && (
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear All
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FilterSection title="Region">
                  {filterOptions.regions.map(region => (
                    <Checkbox
                      key={region}
                      label={region}
                      checked={filters.regions.includes(region)}
                      onChange={() => handleFilterChange('regions', region)}
                    />
                  ))}
                </FilterSection>

                <FilterSection title="Gender">
                  {filterOptions.genders.map(gender => (
                    <Checkbox
                      key={gender}
                      label={gender}
                      checked={filters.genders.includes(gender)}
                      onChange={() => handleFilterChange('genders', gender)}
                    />
                  ))}
                </FilterSection>

                <FilterSection title="Age Range">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.ageRange.min}
                      onChange={(e) => handleFilterChange('ageRange', { ...filters.ageRange, min: e.target.value })}
                      className="w-full px-3 py-1 border border-gray-300 rounded"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.ageRange.max}
                      onChange={(e) => handleFilterChange('ageRange', { ...filters.ageRange, max: e.target.value })}
                      className="w-full px-3 py-1 border border-gray-300 rounded"
                    />
                  </div>
                </FilterSection>

                <FilterSection title="Category">
                  {filterOptions.categories.map(category => (
                    <Checkbox
                      key={category}
                      label={category}
                      checked={filters.categories.includes(category)}
                      onChange={() => handleFilterChange('categories', category)}
                    />
                  ))}
                </FilterSection>

                <FilterSection title="Payment Method">
                  {filterOptions.paymentMethods.map(method => (
                    <Checkbox
                      key={method}
                      label={method}
                      checked={filters.paymentMethods.includes(method)}
                      onChange={() => handleFilterChange('paymentMethods', method)}
                    />
                  ))}
                </FilterSection>

                <FilterSection title="Date Range">
                  <div className="space-y-2">
                    <input
                      type="date"
                      value={filters.dateRange.start}
                      onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
                      className="w-full px-3 py-1 border border-gray-300 rounded"
                    />
                    <input
                      type="date"
                      value={filters.dateRange.end}
                      onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
                      className="w-full px-3 py-1 border border-gray-300 rounded"
                    />
                  </div>
                </FilterSection>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : sales.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500 text-lg">No sales records found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sales.map((sale, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(sale.Date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="font-medium text-gray-900">{sale['Customer Name']}</div>
                          <div className="text-gray-500">{sale['Phone Number']}</div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="font-medium text-gray-900">{sale['Product Name']}</div>
                          <div className="text-gray-500">{sale.Brand}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {sale.Quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="text-gray-900 font-medium">₹{sale['Final Amount'].toLocaleString()}</div>
                          {sale['Discount Percentage'] > 0 && (
                            <div className="text-gray-500 text-xs">
                              {sale['Discount Percentage']}% off
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {sale['Payment Method']}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            sale['Order Status'] === 'Delivered' 
                              ? 'bg-green-100 text-green-800'
                              : sale['Order Status'] === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {sale['Order Status']}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between bg-white rounded-lg shadow-sm px-6 py-4">
              <p className="text-sm text-gray-700">
                Page <span className="font-medium">{currentPage}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const FilterSection = ({ title, children }) => (
  <div>
    <h4 className="font-medium text-gray-700 mb-2 text-sm">{title}</h4>
    <div className="space-y-2 max-h-40 overflow-y-auto">
      {children}
    </div>
  </div>
);

const Checkbox = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
    />
    <span className="text-sm text-gray-700">{label}</span>
  </label>
);

export default SalesManagement;