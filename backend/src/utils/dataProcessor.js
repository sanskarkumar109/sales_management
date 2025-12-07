const filterData = (data, filters) => {
  return data.filter(item => {
    // Region filter
    if (filters.regions.length > 0) {
      if (!filters.regions.includes(item['Customer Region'])) return false;
    }

    // Gender filter
    if (filters.genders.length > 0) {
      if (!filters.genders.includes(item.Gender)) return false;
    }

    // Age range filter
    if (filters.ageMin !== null || filters.ageMax !== null) {
      const age = item.Age;
      if (filters.ageMin !== null && age < filters.ageMin) return false;
      if (filters.ageMax !== null && age > filters.ageMax) return false;
    }

    // Category filter
    if (filters.categories.length > 0) {
      if (!filters.categories.includes(item['Product Category'])) return false;
    }

    // Tags filter
    if (filters.tags.length > 0) {
      const itemTags = item.Tags ? item.Tags.split(',').map(t => t.trim()) : [];
      const hasMatchingTag = filters.tags.some(tag => itemTags.includes(tag));
      if (!hasMatchingTag) return false;
    }

    // Payment method filter
    if (filters.paymentMethods.length > 0) {
      if (!filters.paymentMethods.includes(item['Payment Method'])) return false;
    }

    // Date range filter
    if (filters.dateStart || filters.dateEnd) {
      const itemDate = new Date(item.Date);
      if (filters.dateStart) {
        const startDate = new Date(filters.dateStart);
        if (itemDate < startDate) return false;
      }
      if (filters.dateEnd) {
        const endDate = new Date(filters.dateEnd);
        endDate.setHours(23, 59, 59, 999);
        if (itemDate > endDate) return false;
      }
    }

    return true;
  });
};

const sortData = (data, sortBy) => {
  const sortedData = [...data];

  switch (sortBy) {
    case 'date_desc':
      sortedData.sort((a, b) => new Date(b.Date) - new Date(a.Date));
      break;
    case 'date_asc':
      sortedData.sort((a, b) => new Date(a.Date) - new Date(b.Date));
      break;
    case 'quantity_desc':
      sortedData.sort((a, b) => b.Quantity - a.Quantity);
      break;
    case 'quantity_asc':
      sortedData.sort((a, b) => a.Quantity - b.Quantity);
      break;
    case 'name_asc':
      sortedData.sort((a, b) => 
        (a['Customer Name'] || '').localeCompare(b['Customer Name'] || '')
      );
      break;
    case 'name_desc':
      sortedData.sort((a, b) => 
        (b['Customer Name'] || '').localeCompare(a['Customer Name'] || '')
      );
      break;
    default:
      break;
  }

  return sortedData;
};

const paginateData = (data, page, limit) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(data.length / limit),
      totalItems: data.length,
      itemsPerPage: limit
    }
  };
};

module.exports = {
  filterData,
  sortData,
  paginateData
};