const Category = require("../../model/Product/Categories");
const Trycatch = require("../../middleware/Trycatch");
const Product = require("../../model/Product/product");
const NodeCache = require("node-cache");
const cache = new NodeCache();
// create product category
const CreateCategory = Trycatch(async (req, res, next) => {
  const category = await Category.create(req.body);
  cache.del("categories");
  cache.del("totalCategories");
  res.status(201).json({
    success: true,
    category,
  });
});

// get all product categories
const GetAllCategories = Trycatch(async (req, res, next) => {
  // check cache
  if (cache.has("categories")) {
    const categories = cache.get("categories");
    const totalCategories = cache.get("totalCategories");
    return res.status(200).json({
      success: true,
      categories,
      totalCategories
    });
  }
  else {
    const categories = await Category.find();
    const totalCategories = categories.length;
    cache.set("categories", categories, 10);
    cache.set("totalCategories", totalCategories, 10);
    res.status(200).json({
      success: true,
      totalCategories,
      categories,
    });
    
  }
});

// get single product category
const GetSingleCategory = Trycatch(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }
  res.status(200).json({
    success: true,
    category,
  });
});

// update product category
const UpdateCategory = Trycatch(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  cache.del("categories");
  cache.del("totalCategories");
 


  res.status(200).json({
    success: true,
    category,
  });
});

// delete product category
const DeleteCategory = Trycatch(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }
  cache.del("categories");

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});

// get all products by category
const GetAllProductsByCategory = Trycatch(async (req, res, next) => {
  const products = await Product.find({ category: req.params.id });
  const totalProducts = products.length;
  res.status(200).json({
    success: true,
    totalProducts,
    products,
  });
});

// exports
module.exports = {
  CreateCategory,
  GetAllCategories,
  GetSingleCategory,
  UpdateCategory,
  DeleteCategory,
  GetAllProductsByCategory,
};

// const Category = require("../../model/Product/Categories");
// const Trycatch = require("../../middleware/Trycatch");
// const Product = require("../../model/Product/product");
// const NodeCache = require("node-cache");
// const cache = new NodeCache();

// // Create product category
// const CreateCategory = Trycatch(async (req, res, next) => {
//   const category = await Category.create(req.body);
//   cache.del("categories");
//   cache.del("totalCategories");
//   res.status(201).json({
//     success: true,
//     category,
//   });
// });

// // Get all product categories
// const GetAllCategories = Trycatch(async (req, res, next) => {
//   if (cache.has("categories")) {
//     const categories = cache.get("categories");
//     const totalCategories = cache.get("totalCategories");
//     return res.status(200).json({
//       success: true,
//       categories,
//       totalCategories
//     });
//   } else {
//     const categories = await Category.find();
//     const totalCategories = categories.length;
//     cache.set("categories", categories, 600); // Cache for 10 minutes
//     cache.set("totalCategories", totalCategories, 600);
//     res.status(200).json({
//       success: true,
//       totalCategories,
//       categories,
//     });
//   }
// });

// // Get single product category
// const GetSingleCategory = Trycatch(async (req, res, next) => {
//   const cacheKey = `category_${req.params.id}`;
//   if (cache.has(cacheKey)) {
//     const category = cache.get(cacheKey);
//     return res.status(200).json({
//       success: true,
//       category,
//     });
//   }

//   const category = await Category.findById(req.params.id);
//   if (!category) {
//     return res.status(404).json({
//       success: false,
//       message: "Category not found",
//     });
//   }

//   cache.set(cacheKey, category, 600); // Cache for 10 minutes
//   res.status(200).json({
//     success: true,
//     category,
//   });
// });

// // Update product category
// const UpdateCategory = Trycatch(async (req, res, next) => {
//   const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//     useFindAndModify: false,
//   });

//   if (!category) {
//     return res.status(404).json({
//       success: false,
//       message: "Category not found",
//     });
//   }

//   cache.del("categories");
//   cache.del("totalCategories");
//   cache.del(`category_${req.params.id}`);
//   res.status(200).json({
//     success: true,
//     category,
//   });
// });

// // Delete product category
// const DeleteCategory = Trycatch(async (req, res, next) => {
//   const category = await Category.findByIdAndDelete(req.params.id);
//   if (!category) {
//     return res.status(404).json({
//       success: false,
//       message: "Category not found",
//     });
//   }

//   cache.del("categories");
//   cache.del("totalCategories");
//   cache.del(`category_${req.params.id}`);
//   res.status(200).json({
//     success: true,
//     message: "Category deleted successfully",
//   });
// });

// // Get all products by category
// const GetAllProductsByCategory = Trycatch(async (req, res, next) => {
//   const cacheKey = `productsByCategory_${req.params.id}`;
//   if (cache.has(cacheKey)) {
//     const { products, totalProducts } = cache.get(cacheKey);
//     return res.status(200).json({
//       success: true,
//       totalProducts,
//       products,
//     });
//   }

//   const products = await Product.find({ category: req.params.id });
//   const totalProducts = products.length;

//   cache.set(cacheKey, { products, totalProducts }, 600); // Cache for 10 minutes
//   res.status(200).json({
//     success: true,
//     totalProducts,
//     products,
//   });
// });

// // Exports
// module.exports = {
//   CreateCategory,
//   GetAllCategories,
//   GetSingleCategory,
//   UpdateCategory,
//   DeleteCategory,
//   GetAllProductsByCategory,
// };
