const path = require('path');
const { StatusCodes } = require('http-status-codes');

const uploadProductImage = async (req, res) => {
    // acces a req.files.image grace a express-fileupload
    // When you upload a file, the file will be accessible from req.files.<nom input>
    // dans postman, on a nomme la cle de notre fichier "image" et la valeur "computer-1.jpeg"
     console.log('files', req.files)
    const productImage = req.files.image; // the uploaded file object
   
    // Make the image available publically
    // => construct a path toward public repo where moving the image received in the req
    //The path.join() method joins all given path segments together using the platform-specific separator as a delimiter, then normalizes the resulting path.
    const imagePath = path.join(__dirname, '../public/uploads/' + `${productImage.name}`);
    await productImage.mv(imagePath);
    // send the image back with the correct path
    return res.status(StatusCodes.OK).json({image:{src:`/uploads/${productImage.name}`}});
};


module.exports = {
  uploadProductImage
};
