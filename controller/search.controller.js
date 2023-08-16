const User = require("../models/users.model");

// function filterByOffers(dataArray, offers) {
//   return dataArray.filter(item => offers.some(offer => item.offerProvide.includes(offer)));
// }

function filterByOffers(dataArray, offers) {
  return dataArray.filter((item) => {
    return offers.every((offer) => item.offerProvide.includes(offer));
  });
}

const searchChildCarer = async (req, res) => {
  const { distance, gender } = req.query;
  const offerProvide = req.body.offerProvide || [];

  const filtering = [{ $match: { role: "childcarer" } }];
  if (distance) {
    filtering.push({ $match: { distance: { $lte: Number(distance) } } });
  }
  if (gender) {
    filtering.push({ $match: { gender: gender } });
  }
  if (offerProvide.length > 0) {
    filtering.push({
      $match: {
        offerProvide: {
          $elemMatch: {
            $in: offerProvide,
          },
        },
      },
    });
  }

  try {
    const filteredUser = await User.aggregate(filtering);
    res.send(filteredUser);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { searchChildCarer };
