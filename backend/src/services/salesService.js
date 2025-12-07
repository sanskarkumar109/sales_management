const dataLoader = require('../utils/dataLoader');
const { filterData, sortData, paginateData } = require('../utils/dataProcessor');

let salesData = [];
let filterOptions = null;

const loadData = async () => {
  if (salesData.length === 0) {
    salesData = await dataLoader.loadSalesData();
  }
};

const getSalesData = async (page, limit, sortBy, search, filters) => {
  await loadData();

  let filteredData = [...salesData];

  // Apply search
  if (search) {
    const searchLower = search.toLowerCase();
    filteredData = filteredData.filter(item => {
      const customerName = (item['Customer Name'] || '').toLowerCase();
      const phoneNumber = (item['Phone Number'] || '').toString().toLowerCase();
      return customerName.includes(searchLower) || phoneNumber.includes(searchLower);
    });
  }

  // Apply filters
  filteredData = filterData(filteredData, filters);

  // Apply sorting
  filteredData = sortData(filteredData, sortBy);

  // Apply pagination
  const paginatedResult = paginateData(filteredData, page, limit);

  return paginatedResult;
};

const getFilterOptions = async () => {
  await loadData();

  if (filterOptions) {
    return filterOptions;
  }

  const regions = [...new Set(salesData.map(item => item['Customer Region']).filter(Boolean))].sort();
  const genders = [...new Set(salesData.map(item => item.Gender).filter(Boolean))].sort();
  const categories = [...new Set(salesData.map(item => item['Product Category']).filter(Boolean))].sort();
  const paymentMethods = [...new Set(salesData.map(item => item['Payment Method']).filter(Boolean))].sort();
  
  const allTags = salesData
    .map(item => item.Tags)
    .filter(Boolean)
    .flatMap(tags => tags.split(',').map(t => t.trim()));
  const tags = [...new Set(allTags)].sort();

  filterOptions = {
    regions,
    genders,
    categories,
    tags,
    paymentMethods
  };

  return filterOptions;
};

module.exports = {
  getSalesData,
  getFilterOptions
};