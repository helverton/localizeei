import {connectToDatabase} from '@/services/mongodb';

async function addProfile(req, res) {
  try {
      // connect to the database
      const { db } = await connectToDatabase();

      const query = { _id : req.body._id };
      const update = { $set: req.body };
      const options = { upsert: true };
      db.collection('profiles').updateOne(query, update, options);

      return res.json({
        message: 'Profile added successfully',
        success: true,
      });
      // // add the profile
      // await db.collection('profiles').insertOne(req.body);
      // // return a message
      // return res.json({
      //     message: 'Profile added successfully',
      //     success: true,
      // });
  } catch (error) {
      // return an error
      return res.json({
          message: new Error(error).message,
          success: false,
      });
  }
}

async function getProfile(req,res){
  try {
      // connect to the database
      const { db } = await connectToDatabase();
      const { _id } = req.body

      // fetch the profiles
      const profiles = await db
          .collection('profiles')
          .findOne({ _id: _id })
          // .sort({ExternalID: 1})
          // .toArray();
      // return the profiles
      if (profiles) {
        return res.json({
          message: JSON.parse(JSON.stringify(profiles)),
          success: true,
        });
      } else {
        return res.json({
          message: JSON.parse(JSON.stringify(profiles)),
          success: false,
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

async function updateProfile(req, res) {
  try {
    // connect to the database
    const { db } = await connectToDatabase();

    const { _id, email, plan } = req.body

    // update the published status of the post
    await db.collection('profiles').updateOne(
      { _id: _id },
      { $set: { "plan": plan } }
    );

    // return a message
    return res.json({
      message: 'Profile updated successfully',
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

// async function deleteProfile(req, res) {
//   try {
//       // Connecting to the database
//       const { db } = await connectToDatabase();

//       // Deleting the post
//       await db.collection('profiles').deleteOne({
//           _id: req.body.id,
//       });

//       // returning a message
//       return res.json({
//           message: 'Profile deleted successfully',
//           success: true,
//       });
//   } catch (error) {

//       // returning an error
//       return res.json({
//           message: new Error(error).message,
//           success: false,
//       });
//   }
// }

export default async function handler(req, res) {
  //const { _id, email, plan } = req.body

  // switch the methods
  switch (req.method) {
    // case 'GET': {
    //   return res.json({error: "invalid"})
    //   //return getProfile(req, res)
    // }

    case 'POST': {
      if (req.body._id && req.body.email) {
        return addProfile(req, res)
      }
      if (req.body._id) {
        return getProfile(req, res)
      }
    }

    case 'PUT': {
      return updateProfile(req, res)
    }

    // case 'DELETE': {
    //   return deleteProfile(req, res);
    // }
  }
}
