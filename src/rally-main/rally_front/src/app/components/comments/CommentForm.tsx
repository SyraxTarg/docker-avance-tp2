"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { createComment } from "@/app/events/[event_id]/server_actions/create_comment";
import { z } from "zod";

// Définir le schéma Zod
const commentSchema = z.object({
  comment: z
    .string()
    .min(1, { message: "Le commentaire ne peut pas être vide." })
    .max(500, { message: "Le commentaire ne peut pas dépasser 500 caractères." }),
});

type CommentFormProps = {
  event_id: number;
};

export default function CommentForm({ event_id }: CommentFormProps) {
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");

  const addComment = async () => {
    const validation = commentSchema.safeParse({ comment: newComment });

    if (!validation.success) {
      const errorMessage = validation.error.format().comment?._errors[0];
      setError(errorMessage || "Erreur de validation");
      toast.error(errorMessage);
      return;
    }

    try {
      await createComment(newComment.trim(), event_id);
      toast.success("Commentaire ajouté");
      setNewComment("");
      setError("");
    } catch (error) {
      console.error("Erreur réseau :", error);
      toast.error(`Erreur lors de l'ajout : ${error}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addComment();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white p-4 rounded-xl shadow space-y-4">
      <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
        Laisser un commentaire
      </label>
      <div className="flex items-center space-x-2">
        <input
          id="comment"
          name="comment"
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Écrivez un commentaire..."
          className={`flex-1 block w-full px-4 py-2 text-sm text-gray-800 placeholder-gray-400 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#0F172A] focus:border-[#0F172A]"
            }`}
        />
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#4338CA] border border-transparent rounded-lg hover:bg-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
          </svg>
          Envoyer
        </button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </form>
  );
}
