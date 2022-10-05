const path = require('path');
const { StatusCodes } = require('http-status-codes');

const uploadProjectImage = async (req, res) => {
    // acces a req.files.image grace a express-fileupload
    // When you upload a file, the file will be accessible from req.files.<nom input>
    const projectImage = req.files.image; // the uploaded file object
   
    // Make the image available publically
    // => construct a path toward public repo where moving the image received in the req
    //The path.join() method joins all given path segments together using the platform-specific separator as a delimiter, then normalizes the resulting path.
    const imagePath = path.join(__dirname, '../public/uploads/' + `${projectImage.name}`);
    await projectImage.mv(imagePath);
    // send the image back with the correct path
    return res.status(StatusCodes.OK).json({image:{src:`/uploads/${projectImage.name}`}});
};


module.exports = {
  uploadProjectImage
};
