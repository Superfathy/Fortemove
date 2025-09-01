class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // Manual filter handling with explicit date conversion
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['fields', 'limit', 'page', 'sort', 'search'];
    excludedFields.forEach((e) => delete queryObj[e]);
    
    // Handle date filters manually
    const filters = {};
    
    for (const key in queryObj) {
      if (key.includes('[') && key.includes(']')) {
        // Handle operators like appliedAt[gte]
        const fieldName = key.split('[')[0];
        const operator = key.split('[')[1].replace(']', '');
        
        if (!filters[fieldName]) {
          filters[fieldName] = {};
        }
        
        // Convert to Date if it's a date field
        const value = this.isDateField(fieldName) 
          ? new Date(queryObj[key]) 
          : queryObj[key];
        
        filters[fieldName][`$${operator}`] = value;
      } else {
        // Handle simple equality
        filters[key] = this.isDateField(key) 
          ? new Date(queryObj[key]) 
          : queryObj[key];
      }
    }
    
    this.query = this.query.find(filters);
    return this;
  }

  // Helper to check if a field is a date field
  isDateField(fieldName) {
    const dateFields = ['appliedAt', 'createdAt', 'updatedAt', 'date', 'timestamp'];
    return dateFields.includes(fieldName);
  }

  // Keep your existing search, sort, limitFields, and paginate methods
  search() {
    // Your working search implementation
    if (this.queryString.search) {
      const searchTerm = this.queryString.search;
      this.query = this.query.find({
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } },
          { coverLetter: { $regex: searchTerm, $options: 'i' } },
          { 'job.title': { $regex: searchTerm, $options: 'i' } },
          { 'job.location': { $regex: searchTerm, $options: 'i' } },
          { 'job.company': { $regex: searchTerm, $options: 'i' } },
          { 'user.name': { $regex: searchTerm, $options: 'i' } },
          { 'user.email': { $regex: searchTerm, $options: 'i' } }
        ]
      });
    }
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-appliedAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
export default APIFeatures;