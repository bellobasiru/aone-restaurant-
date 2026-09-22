// Cloudinary unsigned upload helper.
// Uploads an image file directly from the browser to Cloudinary and returns
// the public URL. No secret key needed here — the "unsigned" upload preset
// (configured in the Cloudinary dashboard) handles that safely.

const CLOUD_NAME = "vrps6idx";
const UPLOAD_PRESET = "ml_default";

export async function uploadToCloudinary(file) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(`Cloudinary upload failed: ${errText || response.status}`);
  }

  const data = await response.json();
  return data.secure_url;
}