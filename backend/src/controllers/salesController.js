const salesService = require('../services/salesService');

const getSales = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'date_desc',
      search = '',
      regions = '',
      genders = '',
      ageMin = '',
      ageMax = '',
      categories = '',
      tags = '',
      paymentMethods = '',
      dateStart = '',
      dateEnd = ''
    } = req.query;

    const filters = {
      regions: regions ? regions.split(',') : [],
      genders: genders ? genders.split(',') : [],
      ageMin: ageMin ? parseInt(ageMin) : null,
      ageMax: ageMax ? parseInt(ageMax) : null,
      categories: categories ? categories.split(',') : [],
      tags: tags ? tags.split(',') : [],
      paymentMethods: paymentMethods ? paymentMethods.split(',') : [],
      dateStart: dateStart || null,
      dateEnd: dateEnd || null
    };

    const result = await salesService.getSalesData(
      parseInt(page),
      parseInt(limit),
      sortBy,
      search,
      filters
    );

    res.json(result);
  } catch (error) {
    console.error('Error in getSales:', error);
    res.status(500).json({ error: 'Failed to fetch sales data' });
  }
};

const getFilterOptions = async (req, res) => {
  try {
    const options = await salesService.getFilterOptions();
    res.json(options);
  } catch (error) {
    console.error('Error in getFilterOptions:', error);
    res.status(500).json({ error: 'Failed to fetch filter options' });
  }
};

module.exports = {
  getSales,
  getFilterOptions
};