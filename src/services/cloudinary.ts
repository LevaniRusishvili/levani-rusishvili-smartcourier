export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "YOUR_PRESET");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/YOUR_NAME/image/upload",
    {
      method: "POST",
      body: formData,
    },
  );

  return res.json();
};
