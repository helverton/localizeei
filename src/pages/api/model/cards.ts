import {connectToDatabase} from '@/services/mongodb';

async function addCard(req, res) {
  try {
      // connect to the database
      const { db } = await connectToDatabase();
      // add the profile
      await db.collection('cards').insertOne(JSON.parse(req.body));
      // return a message
      return res.json({
          message: 'Card added successfully',
          success: true,
      });
  } catch (error) {
      // return an error
      return res.json({
          message: new Error(error).message,
          success: false,
      });
  }
}

async function getCards(req,res){
  try {
    // connect to the database
    const { db } = await connectToDatabase();
    const { _id, idx, make, model, year, version, state, city, priceClass, fVisiteds, originData, priceGt, priceLt, fipePrcntGt, fipePrcntLt, sortYear, sortPrice, sortFipePrcnt } = req.body
    let $match = (fipePrcntGt != 0 || fipePrcntLt != 0) ? { '$match': { percentFipe: { $gt: fipePrcntGt, $lt: fipePrcntLt } } } : (priceClass == 'Excelente') ? { '$match': { percentFipe: {$lte: -15} } } : (priceClass == 'Bom') ? { '$match': { percentFipe: {$gt: -15, $lt: 0} } } : (priceClass == 'Justo') ? { '$match': { percentFipe: 0 }} : (priceClass == 'Alto') ? { '$match': { percentFipe: {$gt: 0} }} : {'$match': {}}

    let $sort = {}

    $sort = {'$sort': { price: 1 }}

    if (sortYear != 0) {
      $sort = {'$sort': { year: sortYear }}
    }
    if (sortPrice != 0) {
      $sort = {'$sort': { price: sortPrice }}
    }
    if (sortFipePrcnt != 0) {
      $sort = {'$sort': { percentFipe: sortFipePrcnt }}
    }

    let filters = []
    if (_id) { filters.push({ _id: _id }) }
    if (idx) { filters.push({ idx: idx }) }

    if (make) { filters.push({ make: make }) }
    if (model) { filters.push({ model: model }) }
    if (year) { filters.push({ year: year }) }
    if (version) { filters.push({ version: version }) }
    //if (priceClass) { filters.push({ priceClass: priceClass }) }

    if (originData) { filters.push({ origin: originData }) }

    if (fVisiteds[0] !== '1') { filters.push({ _id: { $in: fVisiteds } }); } //{ filters.push({ _id: { $in: [ fVisiteds ] } }) } else { filters.push({ _id: '*' }) }

    if (state) { filters.push({ state: state }) }
    if (city) { filters.push({ city: city }) }

    //console.log(`${priceGt} -- ${priceLt}`)

    if (priceGt > 0 && priceLt > 0) {
      filters.push({ price: { '$gt': priceGt, '$lt': priceLt } })
    }

    if (priceGt > 0 && priceLt == 0) {
      filters.push({ price: { '$gt': priceGt } })
    }

    if (priceGt == 0 && priceLt > 0) {
      filters.push({ price: { '$lt': priceLt } })
    }



    // if (fipePrcntGt != 0 || fipePrcntLt != 0) {
    //   priceCls = { percentFipe: { $gt: fipePrcntGt, $lt: fipePrcntLt } }
    // }

    // if (fipePrcntGt > 0 && fipePrcntLt == 0) {
    //   priceCls = { percentFipe: { $gt: fipePrcntGt } }
    // }

    // if (fipePrcntGt == 0 && fipePrcntLt > 0) {
    //   priceCls = { percentFipe: { $lte: fipePrcntLt } }
    // }



    // if (sortPrice != 0 || sortFipePrcnt != 0) {





      // if (sortPrice == 0 && sortFipePrcnt == 0) {
      //   sort = { price: 1 }
      // }
    // }

    //console.log($sort)
    // console.log($match)



    //console.log(fVisiteds[0])
     //console.log(filters)
    // console.log(fVisiteds)
    // console.log(priceCls)

    // fetch the cards
    if (filters.length > 0) {
      //console.log(priceCls)

      const cards = await db
      .collection('cards')
      //.find({ $and: filters })
      .aggregate([
        {
          $match:{ $and: filters }
        },
        // {
        //   $sort: sort
        // },
        {
          $lookup: {
            from: 'fipe',
            localField: 'fipeId',
            foreignField: '_id',
            as: 'fipe'
          }
        },
        {
          $project: {
            _id: 1,
            bodystyleId: 1,
            created_at: 1,
            detail: 1,
            fipeId: 1,
            fuelId: 1,
            fuelName: 1,
            href: 1,
            idx: 1,
            img: 1,
            make: 1,
            model: 1,
            name: 1,
            origin: 1,
            state: 1,
            city: 1,
            percent: 1,
            price: 1,
            region: 1,
            vehicleType: 1,
            version: 1,
            visited: 1,
            closed: 1,
            year: 1,
            fipe: {
              $arrayElemAt: [
                '$fipe',
                0
              ]
            },
            fipeLast: {
              $arrayElemAt: [
                '$fipe',
                0
              ]
            }
          }
        },
        {
          $project: {
            _id: 1,
            bodystyleId: 1,
            created_at: 1,
            detail: 1,
            fipeId: 1,
            fuelId: 1,
            fuelName: 1,
            href: 1,
            idx: 1,
            img: 1,
            make: 1,
            model: 1,
            name: 1,
            origin: 1,
            state: 1,
            city: 1,
            percent: 1,
            price: 1,
            region: 1,
            vehicleType: 1,
            version: 1,
            visited: 1,
            closed: 1,
            year: 1,
            fipe: 1,
            fipeLast: {
              $arrayElemAt: [
                '$fipe.history',
                0
              ]
            }
          }
        },
        {
          $project: {
            _id: 1,
            bodystyleId: 1,
            created_at: 1,
            detail: 1,
            fipeId: 1,
            fuelId: 1,
            fuelName: 1,
            href: 1,
            idx: 1,
            img: 1,
            make: 1,
            model: 1,
            name: 1,
            origin: 1,
            state: 1,
            city: 1,
            percent: 1,
            price: 1,
            region: 1,
            vehicleType: 1,
            version: 1,
            visited: 1,
            closed: 1,
            year: 1,
            fipe: 1,
            fipeLast: 1,
            percentFipe: { $subtract: [{ "$multiply" : [100, { "$divide" : ["$price", "$fipeLast.price"] } ] }, 100]}
          }
        },
        $match,
        $sort
        // {
        //   $sort: sort
        // }
      ])

      // .aggregate({
      //   $lookup: {
      //     from: "fipe",
      //     localField: "fipeId",    // field in the orders collection
      //     foreignField: "fipeId",  // field in the items collection
      //     as: "fipeHistory"
      //   }
      // })
      // .sort({ExternalID: 1})
      .toArray();

      const cardsAll = await db
      .collection('cards')
      .find({})
      .toArray();
      // return the cards
      //console.log(cards)
      return res.json({
        message: JSON.parse(JSON.stringify([cards, cardsAll])),
        success: true,
      });
    } else {
      const cards = await db
      .collection('cards')
      .aggregate([
        // {
        //   $sort: sort
        // },
        {
          $lookup: {
            from: 'fipe',
            localField: 'fipeId',
            foreignField: '_id',
            as: 'fipe'
          }
        },
        {
          $project: {
            _id: 1,
            bodystyleId: 1,
            created_at: 1,
            detail: 1,
            fipeId: 1,
            fuelId: 1,
            fuelName: 1,
            href: 1,
            idx: 1,
            img: 1,
            make: 1,
            model: 1,
            name: 1,
            origin: 1,
            state: 1,
            city: 1,
            percent: 1,
            price: 1,
            region: 1,
            vehicleType: 1,
            version: 1,
            visited: 1,
            closed: 1,
            year: 1,
            fipe: {
              $arrayElemAt: [
                '$fipe',
                0
              ]
            },
            fipeLast: {
              $arrayElemAt: [
                '$fipe',
                0
              ]
            }
          }
        },
        {
          $project: {
            _id: 1,
            bodystyleId: 1,
            created_at: 1,
            detail: 1,
            fipeId: 1,
            fuelId: 1,
            fuelName: 1,
            href: 1,
            idx: 1,
            img: 1,
            make: 1,
            model: 1,
            name: 1,
            origin: 1,
            state: 1,
            city: 1,
            percent: 1,
            price: 1,
            region: 1,
            vehicleType: 1,
            version: 1,
            visited: 1,
            closed: 1,
            year: 1,
            fipe: 1,
            fipeLast: {
              $arrayElemAt: [
                '$fipe.history',
                0
              ]
            }
          }
        },
        {
          $project: {
            _id: 1,
            bodystyleId: 1,
            created_at: 1,
            detail: 1,
            fipeId: 1,
            fuelId: 1,
            fuelName: 1,
            href: 1,
            idx: 1,
            img: 1,
            make: 1,
            model: 1,
            name: 1,
            origin: 1,
            state: 1,
            city: 1,
            percent: 1,
            price: 1,
            region: 1,
            vehicleType: 1,
            version: 1,
            visited: 1,
            closed: 1,
            year: 1,
            fipe: 1,
            fipeLast: 1,
            percentFipe: { $subtract: [{ "$multiply" : [100, { "$divide" : ["$price", "$fipeLast.price"] } ] }, 100]}
          }
        },
        $match,
        $sort

        // ,
        // {
        //   $sort: sort
        // }
      ])
      // .sort({ExternalID: 1})
      .toArray();

      const cardsAll = await db
      .collection('cards')
      .find({})
      .toArray();

      // return the cards
      return res.json({
        message: JSON.parse(JSON.stringify([cards, cardsAll])),
        success: true,
      });
    }
  } catch (error) {
      // return the error
      return res.json({
          message: new Error(error).message,
          success: false,
      });
  }
}

async function updateCard(req, res) {
  try {
    // connect to the database
    const { db } = await connectToDatabase();

    const { _id, email, plan } = req.body

    // update the published status of the post
    await db.collection('cards').updateOne(
      { _id: _id },
      { $set: { "plan": plan } }
    );

    // return a message
    return res.json({
      message: 'Card updated successfully',
      success: true,
    });
  } catch (error) {

    // return an error
    return res.json({
      message: new Error(error).message,
      success: false,
    });
  }
}

async function deleteCard(req, res) {
  try {
      // Connecting to the database
      const { db } = await connectToDatabase();

      const { _id, email, plan } = req.body

      // Deleting the post
      await db.collection('cards').deleteOne({
          _id: _id,
      });

      // returning a message
      return res.json({
          message: 'Card deleted successfully',
          success: true,
      });
  } catch (error) {

      // returning an error
      return res.json({
          message: new Error(error).message,
          success: false,
      });
  }
}

export default async function handler(req, res) {
  //const { _id, email, plan } = req.body

  // switch the methods
  switch (req.method) {
    // case 'GET': {
    //   return res.json({error: "invalid"})
    //   //return getCard(req, res)
    // }

    case 'POST': {
      if (req.body._id) {
        return addCard(req, res)
      } else {
        return getCards(req, res)
      }
    }

    case 'PUT': {
      return updateCard(req, res)
    }

    case 'DELETE': {
      return deleteCard(req, res);
    }
  }
}
