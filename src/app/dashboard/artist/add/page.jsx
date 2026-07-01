"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, TextField, Label, InputGroup, Input } from "@heroui/react";
import { useSession } from "@/lib/auth-client";

const CATEGORIES = ["Painting", "Digital", "Sculpture", "Photography", "Drawing", "Other"];
 
export default function AddArtworkPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Image select & preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB.");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  // Upload to imgBB
  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
      { method: "POST", body: formData }
    );
    const data = await res.json();
    if (!data.success) throw new Error("Image upload failed.");
    return data.data.url;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError("");
    setSuccess("");
   const res = await authFetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/artworks`, {
  method: "POST",
  body: JSON.stringify({ title, description, price: Number(price), category, imageUrl }),
});

    if (!title.trim()) return setError("Title is required.");
    if (!description.trim()) return setError("Description is required.");
    if (!price || Number(price) <= 0) return setError("Enter a valid price.");
    if (!category) return setError("Please select a category.");
    if (!imageFile) return setError("Please upload an image.");

    setIsLoading(true);
    try {
      // 1. Upload image to imgBB
      setUploadingImage(true);
      const imageUrl = await uploadToImgBB(imageFile);
      setUploadingImage(false);

      // 2. Save artwork to server
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/artworks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, description, price: Number(price), category, imageUrl }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to add artwork."); return; }

      setSuccess("Artwork published successfully!");
      setTimeout(() => router.push("/dashboard/artist"), 1500);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
      setUploadingImage(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Add New Artwork</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Fill in the details to publish your artwork</p>
      </div>

      <Card className="p-6 border border-zinc-200 dark:border-zinc-800">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Error / Success */}
          {error && (
            <div className="p-3.5 text-xs font-medium rounded-xl bg-red-100/60 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900">
              <span className="font-semibold">Error:</span> {error}
            </div>
          )}
          {success && (
            <div className="p-3.5 text-xs font-medium rounded-xl bg-emerald-100/60 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
              <span className="font-semibold">Success:</span> {success}
            </div>
          )}

          {/* Image Upload */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Artwork Image</label>
            <div
              onClick={() => document.getElementById("imageInput").click()}
              className={`relative w-full h-52 rounded-xl border-2 border-dashed cursor-pointer transition-colors flex items-center justify-center overflow-hidden ${
                imagePreview
                  ? "border-violet-400"
                  : "border-zinc-200 dark:border-zinc-700 hover:border-violet-400"
              }`}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-sm font-medium">Click to change</p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-zinc-400">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="m21 15-5-5L5 21"/>
                  </svg>
                  <p className="text-sm">Click to upload image</p>
                  <p className="text-xs">PNG, JPG, WEBP up to 5MB</p>
                </div>
              )}
            </div>
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Title */}
          <TextField isRequired name="title" className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Title</Label>
            <InputGroup className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 bg-zinc-50 dark:bg-zinc-900 focus-within:border-violet-500 transition-colors">
              <Input
                type="text"
                placeholder="e.g. Sunset Over the Mountains"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent py-2.5 text-sm outline-none border-none text-zinc-900 dark:text-zinc-100"
              />
            </InputGroup>
          </TextField>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label>
            <textarea
              placeholder="Describe your artwork, inspiration, techniques used..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm outline-none focus:border-violet-500 transition-colors resize-none"
            />
          </div>

          {/* Price */}
          <TextField isRequired name="price" className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Price (USD)</Label>
            <InputGroup className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 bg-zinc-50 dark:bg-zinc-900 focus-within:border-violet-500 transition-colors">
              <span className="text-zinc-400 text-sm">$</span>
              <Input
                type="number"
                placeholder="0.00"
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-transparent py-2.5 text-sm outline-none border-none text-zinc-900 dark:text-zinc-100"
              />
            </InputGroup>
          </TextField>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    category === cat
                      ? "bg-violet-600 text-white"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            color="primary"
            className="w-full font-semibold rounded-xl h-12 mt-2"
            isLoading={isLoading}
            isDisabled={isLoading}
          >
            {uploadingImage ? "Uploading image..." : isLoading ? "Publishing..." : "Publish Artwork"}
          </Button>

        </form>
      </Card>
    </div>
  );
}