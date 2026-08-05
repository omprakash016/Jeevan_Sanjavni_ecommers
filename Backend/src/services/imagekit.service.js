import imagekit from "../config/imagekit.js";

export const uploadImages = async (files) => {
  const uploadedImages = [];

  for (const file of files) {
    const response = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: "/Jeevan-Sanjivani/products",
    });

    uploadedImages.push({
      fileId: response.fileId,
      fileName: response.name,
      url: response.url,
    });
  }
  return uploadedImages;
};