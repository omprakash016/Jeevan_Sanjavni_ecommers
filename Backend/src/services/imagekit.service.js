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

export const deleteImages = async (fileIds) => {
  try {
    if (!fileIds || fileIds.length === 0) return;

    await Promise.all(
      fileIds.map((fileId) => imagekit.deleteFile(fileId))
    );
  } catch (error) {
    throw new Error(error.message);
  }
};