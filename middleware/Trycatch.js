// try-catch common function
// export default  (TheFunc) => async (req, res, next) => {
//     try {
//         await Promise.resolve(TheFunc(req, res, next));
//     } catch (error) {
//         next(error);
//     }
// };

module.exports = (TheFunc) => async (req, res, next) => {
    try {
        await Promise.resolve(TheFunc(req, res, next));
    } catch (error) {
        next(error);
    }
}