
class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // search
  search() {
    const name = this.queryStr.name
      ? {
          name: {
            $regex: this.queryStr.name,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...name });
    return this;
  }

  // paginate
  paginate(perPage) {
    const page = parseInt(this.queryStr.page) || 1;
    const limit = parseInt(this.queryStr.limit) || perPage;
    const skip = (page - 1) * limit;

    this.query = this.query.limit(limit).skip(skip);
    return this;
  }

  // search products by price range
  filterByPriceRange(minPrice, maxPrice) {
    const priceFilter = {
      PriceAfterDiscount: {
        $gte: minPrice,
        $lte: maxPrice,
      },
    };
    this.query = this.query.find(priceFilter);
    return this;
  }
//   filterByPriceRange(minPrice, maxPrice) {
//     const priceFilter = {
//         'size.FinalPrice': { 
//             $gte: minPrice,
//             $lte: maxPrice,
//         },
//     };
//     this.query = this.query.find(priceFilter);
//     return this;
// }


  filterByStatus(status) {
    const statusFilter = { status };
    this.query = this.query.find(statusFilter);
    return this;
  }

  filterByProductType(productType) {
    const productTypeFilter = { productType };
    this.query = this.query.find(productTypeFilter);
    return this;
  }

  filterByCategory(categoryId) {
    const categoryFilter = categoryId ? { category: categoryId } : {};
    this.query = this.query.find(categoryFilter);
    return this;
  }

  filterByStock(stock) {
    if (stock === 'true' || stock === true) {
      this.query = this.query.where('IsOutOfStock').equals(true);
    } else if (stock === 'false' || stock === false) {
      this.query = this.query.where('IsOutOfStock').equals(false);
    }
    return this;
  }
}

module.exports = ApiFeatures;
