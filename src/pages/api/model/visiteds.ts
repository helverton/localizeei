import {connectToDatabase} from '@/services/mongodb';

async function addVisited(req, res) {
  try {
      // connect to the database
      const { db } = await connectToDatabase();

      const { _id, card } = req.body

      const visited = await db
          .collection('visiteds')
          .findOne({ _id: _id })

      if (visited) {
        const query = { _id : _id };
        const update = { $addToSet : { "cards" : card } };
        //const options = { upsert: true };
        db.collection('visiteds').updateOne(query, update);

        return res.json({
          message: 'Visited added successfully',
          success: true,
        });

      } else {

        const query = { _id : _id };
        const update = { $set: { cards: [ card ]}};
        const options = { upsert: true };
        db.collection('visiteds').updateOne(query, update, options);

        return res.json({
          message: 'Visited added successfully',
          success: true,
        });
      }
  } catch (error) {
      // return an error
      return res.json({
          message: new Error(error).message,
          success: false,
      });
  }
}

async function getVisited(req,res){
  try {
      // connect to the database
      const { db } = await connectToDatabase();
      const { _id } = req.body

      // fetch the visiteds
      const visiteds = await db
          .collection('visiteds')
          .findOne({ _id: _id })
          //.sort({ExternalID: 1})
          //.toArray();
      // return the visiteds
      return res.json({
          message: JSON.parse(JSON.stringify(visiteds)),
          success: true,
      });
  } catch (error) {
      // return the error
      return res.json({
          message: new Error(error).message,
          success: false,
      });
  }
}

export default async function handler(req, res) {
  const { _id, card } = req.body

  // switch the methods
  switch (req.method) {
    case 'POST': {
      if (_id && card) {
        return addVisited(req, res)
      }
      if (_id) {
        //console.log(req.body)
        return getVisited(req, res)
      }
    }

    return res.json({
      message: new Error("error").message,
      success: false,
    });
  }
}
