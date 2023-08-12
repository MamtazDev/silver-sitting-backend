const User = require("../models/users.model");


// function filterByOffers(dataArray, offers) {
//   return dataArray.filter(item => offers.some(offer => item.offerProvide.includes(offer)));
// }

function filterByOffers(dataArray, offers) {
  return dataArray.filter(item => {
    return offers.every(offer => item.offerProvide.includes(offer));
  });
}


const searchController = async (req, res) => {
  const offersQueryParam = req.query.offers;

  if (!offersQueryParam) {
    return res.status(400).json({ error: 'Missing offers parameter' });
  }

  let offersArray = [];

  try {
    offersArray = JSON.parse(offersQueryParam);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid offers parameter format' });
  }
  try {

    const user = await User.find().select("-password")
    // const offersToFilter = ["Homework help classes"];



    // For multiple offers
    const multipleOffers = ["Homework help classes", "Child care for children from 4 years"];
    const filteredDataWithMultipleOffers = filterByOffers(user, multipleOffers);
    console.log("Filtered Data with Multiple Offers:", filteredDataWithMultipleOffers);

    // For a single offer
    const singleOffer = ["Homework help classes"];
    const filteredDataWithSingleOffer = filterByOffers(user, singleOffer);
    console.log("Filtered Data with Single Offer:", filteredDataWithSingleOffer);






    // const filteredData = filterByOffers(user, offersToFilter);
    // console.log("user data", user);

    //call user by user if from query

    res.status(200).send({
      message: `Thanks for your feedback. ${offersArray}`,
      data: filteredDataWithMultipleOffers,
      single: filteredDataWithSingleOffer,
      status: 200,
    });

  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};



module.exports = {
  searchController
};
