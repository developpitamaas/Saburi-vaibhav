const Coupan = require("../../model/coupan/coupan");
const TryCatch = require("../../middleware/Trycatch");

// create coupan
const CreateCoupan = TryCatch(async (req, res, next) => {
  const coupan = await Coupan.create(req.body);
  res.status(201).json({
    success: true,
    coupan,
  });
});
// await Coupan.updateOne({ _id: coupan._id }, { Isexpired: true });

// get all coupan
const GetAllCoupans = TryCatch(async (req, res, next) => {
  const coupan = await Coupan.find();

  // if coupan endDate is less than current date then set Isexpired to true
  const currentDate = new Date();
  const updatedCoupan = coupan.map((coupan) => {
    if (coupan.endDate < currentDate) {
      return { ...coupan._doc, Isexpired: true };
    }
    return coupan;
  });

  const totalCoupan = coupan.length;
  res.status(200).json({
    success: true,
    totalCoupan,
    // coupan,
    Coupans: updatedCoupan,
  });
});
const GetAllCoupan = TryCatch(async (req, res, next) => {
  const coupan = await Coupan.find();

  // if coupan endDate is less than current date then set Isexpired to true
  const currentDate = new Date();
  const updatedCoupan = coupan.map(async (coupan) => {
    if (coupan.endDate < currentDate) {
      // Update the Isexpired field in the database
      await Coupan.updateOne({ _id: coupan._id }, { Isexpired: true });
      return { ...coupan._doc, Isexpired: true };
    }

    return coupan;
  });

  const totalCoupan = coupan.length;
  const Newcoupans = await Coupan.find()
  .populate({ path: "applicableProducts" })
  .populate({ path: "applicableCategories" })

  res.status(200).json({
    success: true,
    totalCoupan,
    // Coupans: updatedCoupan,
    coupan: Newcoupans,
  });
});

// get coupan code by Coupancode
const GetCoupanByCoupancode = TryCatch(async (req, res, next) => {
  const coupan = await Coupan.findOne({ Coupancode: req.params.coupancode });
  res.status(200).json({
    success: true,
    coupan,
  });
});

// get coupan by id
const GetCoupanById = TryCatch(async (req, res, next) => {
  const coupan = await Coupan.findById(req.params.id)
  .populate({ path: "applicableProducts" })
  .populate({ path: "applicableCategories" })

  res.status(200).json({
    success: true,
    coupan,
  });
});

// update coupan
const UpdateCoupan = TryCatch(async (req, res, next) => {
  const coupan = await Coupan.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    coupan,
  });
});

// delete coupan
const deleteCoupan = TryCatch(async (req, res, next) => {
  const coupan = await Coupan.findByIdAndDelete(req.params.id);
  if (!coupan) {
    return res.status(404).json({
      success: false,
      message: "Coupan not found",
    });
  }
  res.status(200).json({
    success: true,
    coupan,
  });
});

// export controller
module.exports = {
  CreateCoupan,
  GetAllCoupan,
  GetCoupanByCoupancode,
  GetCoupanById,
  UpdateCoupan,
  deleteCoupan,
};
