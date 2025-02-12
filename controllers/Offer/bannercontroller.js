// const Banner = require("../../model/offer/Banner");

// const TryCatch = require("../../middleware/Trycatch");

// const CreateBanner = TryCatch(async (req, res, next) => {
//     const banner = await Banner.create(req.body);
//     res.status(201).json({
//         success: true,
//         banner
//     })
// })

// const GetAllBanner = TryCatch(async (req, res, next) => {
//     const banner = await Banner.find();
//     res.status(200).json({
//         success: true,
//         banner
//     })
// })

// const GetSingleBanner = TryCatch(async (req, res, next) => {
//     const banner = await Banner.findById(req.params.id);
//     res.status(200).json({
//         success: true,
//         banner
//     })
// })

// const UpdateBanner = TryCatch(async (req, res, next) => {
//     const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//         runValidators: true,
//         useFindAndModify: false
//     });
//     res.status(200).json({
//         success: true,
//         banner
//     })
// })

// const DeleteBanner = TryCatch(async (req, res, next) => {
//     const banner = await Banner.findByIdAndDelete(req.params.id);
//     res.status(200).json({
//         success: true,
//         banner
//     })
// })


// module.exports = {
//     CreateBanner,
//     GetAllBanner,
//     GetSingleBanner,
//     UpdateBanner,
//     DeleteBanner
// }


const Banner = require("../../model/offer/Banner");
const TryCatch = require("../../middleware/Trycatch");
const NodeCache = require("node-cache"); // Import node-cache

const cache = new NodeCache({ stdTTL: 600 }); // Cache with 600 seconds (10 minutes) TTL

const CreateBanner = TryCatch(async (req, res, next) => {
  const banner = await Banner.create(req.body);
  cache.del("allBanners");
  res.status(201).json({
    success: true,
    banner,   
  });
  // No need to cache created banners
});

const GetAllBanner = TryCatch(async (req, res, next) => {

  const cachedBanners = cache.get("allBanners");
  if (cachedBanners) {
    return res.status(200).json({
      success: true,
      banner: cachedBanners,
    });
  }

  const banners = await Banner.find();
  cache.set("allBanners", banners);
  res.status(200).json({
    success: true,
    banner: banners,
  });
});

const GetSingleBanner = TryCatch(async (req, res, next) => {
  const cachedBanner = cache.get(`banner-${req.params.id}`);
  if (cachedBanner) {
    return res.status(200).json({
      success: true,
      banner: cachedBanner,
    });
  }

  const banner = await Banner.findById(req.params.id);
  if (!banner) {
    return res.status(404).json({ message: "Banner not found" });
  }
  cache.set(`banner-${req.params.id}`, banner);
  res.status(200).json({
    success: true,
    banner,
  });
});

const UpdateBanner = TryCatch(async (req, res, next) => {
  const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  if (!banner) {
    return res.status(404).json({ message: "Banner not found" });
  }
  // Invalidate relevant cache entries on update
  cache.del("allBanners");
  cache.del(`banner-${req.params.id}`);
  res.status(200).json({
    success: true,
    banner,
  });
});

const DeleteBanner = TryCatch(async (req, res, next) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);
  if (!banner) {
    return res.status(404).json({ message: "Banner not found" });
  }
  // Invalidate relevant cache entries on delete
  cache.del("allBanners");
  cache.del(`banner-${req.params.id}`);
  res.status(200).json({
    success: true,
    banner,
  });
});

module.exports = {
  CreateBanner,
  GetAllBanner,
  GetSingleBanner,
  UpdateBanner,
  DeleteBanner,
};
