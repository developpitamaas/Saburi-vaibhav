const Productsize = require("../../model/Product/productsize") 
const Product = require("../../model/Product/product");
const Trycatch = require("../../middleware/Trycatch");
// update product
const UpdateProductsize = Trycatch(async (req, res, next) => {
  const productsize = await Productsize.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // Check if the product size quantity is more than 0
  if (productsize.quantity > 0) {
    productsize.IsOutOfStock = "false";
  } else {
    productsize.IsOutOfStock = "true"; 
  }

  // Save the updated product size
  await productsize.save();

  // Check the stock status of all sizes of the product
  const allSizes = await Productsize.find({ productId: productsize.productId });

  // Check if any size is in stock
  const anySizeInStock = allSizes.some(size => size.IsOutOfStock === "false");

  // Update the product's IsOutOfStock status
  await Product.findByIdAndUpdate(productsize.productId, {
    IsOutOfStock: anySizeInStock ? "false" : "true",
  });

  res.status(200).json({
    success: true,
    productsize,
  });
});


// delete 
 const DeleteProductsize = Trycatch(async (req, res, next) => {
    const productsize = await Productsize.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      productsize,
    });
  });

module.exports = {UpdateProductsize,DeleteProductsize}
