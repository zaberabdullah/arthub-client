"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, Button, TextField, Label, InputGroup, Input } from "@heroui/react";
import { useSession } from "@/lib/auth-client";

const CATEGORIES = ["Painting", "Digital", "Sculpture", "Photography", "Drawing", "Other"];

export default function EditArtworkPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: session } = useSession();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/artworks/${id}`)
      .then(r => r.json())
      .then(data => {
        setTitle(data.title || "");
        setDescription(data.description || "");
        setPrice(data.price || "");
        setCategory(data.category || "");
        setImageUrl(data.imageUrl || "");
        setImagePreview(data.imageUrl || "");
      })
      .catch(() => setError("Failed to load artwork."))
      .finally(() => setFetching(false));
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("Image must be less than 5MB."); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`, { method: "POST", body: formData });
    const data = await res.json();
    if (!data.success) throw new Error("Image upload failed.");
    return data.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!title.trim()) return setError("Title is required.");
    if (!description.trim()) return setError("Description is required.");
    if (!price || Number(price) <= 0) return setError("Enter a valid price.");
    if (!category) return setError("Please select a category.");

    setIsLoading(true);
    try {
      let finalImageUrl = imageUrl;
      if (imageFile) finalImageUrl = await uploadToImgBB(imageFile);

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/artworks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, description, price: Number(price), category, imageUrl: finalImageUrl }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to update artwork."); return; }
      setSuccess("Artwork updated successfully!");
      setTimeout(() => router.push("/dashboard/artist"), 1500);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  if (fetching) return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-4">
      {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-zinc-100 rounded-xl animate-pulse" />)}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Edit Artwork</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Update your artwork details</p>
      </div>

      <Card className="p-6 border border-zinc-200 dark:border-zinc-800">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && <div className="p-3.5 text-xs font-medium rounded-xl bg-red-100/60 text-red-700 border border-red-200"><span className="font-semibold">Error:</span> {error}</div>}
          {success && <div className="p-3.5 text-xs font-medium rounded-xl bg-emerald-100/60 text-emerald-800 border border-emerald-200"><span className="font-semibold">Success:</span> {success}</div>}

          {/* Image */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Artwork Image</label>
            <div onClick={() => document.getElementById("editImageInput").click()}
              className="relative w-full h-52 rounded-xl border-2 border-dashed border-violet-400 cursor-pointer flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-sm font-medium">Click to change</p>
                  </div>
                </>
              ) : (
                <p className="text-zinc-400 text-sm">Click to upload image</p>
              )}
            </div>
            <input id="editImageInput" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </div>

          {/* Title */}
          <TextField isRequired name="title" className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Title</Label>
            <InputGroup className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 bg-zinc-50 dark:bg-zinc-900 focus-within:border-violet-500 transition-colors">
              <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Artwork title"
                className="w-full bg-transparent py-2.5 text-sm outline-none border-none text-zinc-900 dark:text-zinc-100" />
            </InputGroup>
          </TextField>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Describe your artwork..."
              className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm outline-none focus:border-violet-500 transition-colors resize-none" />
          </div>

          {/* Price */}
          <TextField isRequired name="price" className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Price (USD)</Label>
            <InputGroup className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 bg-zinc-50 dark:bg-zinc-900 focus-within:border-violet-500 transition-colors">
              <span className="text-zinc-400 text-sm">$</span>
              <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" min="1"
                className="w-full bg-transparent py-2.5 text-sm outline-none border-none text-zinc-900 dark:text-zinc-100" />
            </InputGroup>
          </TextField>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button key={cat} type="button" onClick={() => setCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${category === cat ? "bg-violet-600 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200"}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" color="primary" className="w-full font-semibold rounded-xl h-12 mt-2" isLoading={isLoading} isDisabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Card>
    </div>
  );
}