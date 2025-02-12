const ExistingOffer = require("../../model/offer/Existingoffer");

const TryCatch = require("../../middleware/Trycatch");

const CreateExisitingOfferBanner = TryCatch(async (req, res, next) => {
    const banner = await ExistingOffer.create(req.body);
    res.status(201).json({
        success: true,
        banner
    })
})

const GetAllExisitingOfferBanner = TryCatch(async (req, res, next) => {
    const banner = await ExistingOffer.find();
    res.status(200).json({
        success: true,
        banner
    })
})

const GetSingleExisitingOfferBanner = TryCatch(async (req, res, next) => {
    const banner = await ExistingOffer.findById(req.params.id);
    res.status(200).json({
        success: true,
        banner
    })
})

const UpdateExisitingOfferBanner = TryCatch(async (req, res, next) => {
    const banner = await ExistingOffer.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true,
        banner
    })
})

const DeleteExisitingOfferBanner = TryCatch(async (req, res, next) => {
    const banner = await ExistingOffer.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        banner
    })
})


module.exports = {
    CreateExisitingOfferBanner,
    GetAllExisitingOfferBanner,
    GetSingleExisitingOfferBanner,
    UpdateExisitingOfferBanner,
    DeleteExisitingOfferBanner
}

// const ExistingOffer = require("../../model/offer/Existingoffer");

// const TryCatch = require("../../middleware/Trycatch");
// const NodeCache = require("node-cache"); // Import node-cache

// const cache = new NodeCache({ stdTTL: 600 }); // Cache with 600 seconds (10 minutes) TTL

// const CreateExisitingOfferBanner = TryCatch(async (req, res, next) => {
//   const banner = await ExistingOffer.create(req.body);
//   res.status(201).json({
//     success: true,
//     banner,
//   });
//   // No need to cache created banners
// });

// const GetAllExisitingOfferBanner = TryCatch(async (req, res, next) => {
//   const cachedBanners = cache.get("allBanners");
//   if (cachedBanners) {
//     return res.status(200).json({
//       success: true,
//       banner: cachedBanners,
//     });
//   }

//   const banners = await ExistingOffer.find();
//   cache.set("allBanners", banners);
//   res.status(200).json({
//     success: true,
//     banner: banners,
//   });
// });

// const GetSingleExisitingOfferBanner = TryCatch(async (req, res, next) => {
//   const cachedBanner = cache.get(`banner-${req.params.id}`);
//   if (cachedBanner) {
//     return res.status(200).json({
//       success: true,
//       banner: cachedBanner,
//     });
//   }

//   const banner = await ExistingOffer.findById(req.params.id);
//   if (!banner) {
//     return res.status(404).json({ message: "ExistingOffer not found" });
//   }
//   cache.set(`banner-${req.params.id}`, banner);
//   res.status(200).json({
//     success: true,
//     banner,
//   });
// });

// const UpdateExisitingOfferBanner = TryCatch(async (req, res, next) => {
//   const banner = await ExistingOffer.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//     useFindAndModify: false,
//   });
//   if (!banner) {
//     return res.status(404).json({ message: "ExistingOffer not found" });
//   }
//   // Invalidate relevant cache entries on update
//   cache.del("allBanners");
//   cache.del(`banner-${req.params.id}`);
//   res.status(200).json({
//     success: true,
//     banner,
//   });
// });

// const DeleteExisitingOfferBanner = TryCatch(async (req, res, next) => {
//   const banner = await ExistingOffer.findByIdAndDelete(req.params.id);
//   if (!banner) {
//     return res.status(404).json({ message: "ExistingOffer not found" });
//   }
//   // Invalidate relevant cache entries on delete
//   cache.del("allBanners");
//   cache.del(`banner-${req.params.id}`);
//   res.status(200).json({
//     success: true,
//     banner,
//   });
// });

// module.exports = {
//   CreateExisitingOfferBanner,
//   GetAllExisitingOfferBanner,
//   GetSingleExisitingOfferBanner,
//   UpdateExisitingOfferBanner,
//   DeleteExisitingOfferBanner,
// };
