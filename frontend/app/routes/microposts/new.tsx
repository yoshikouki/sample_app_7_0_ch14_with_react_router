import { useState, useRef } from "react";

export function meta() {
  return [
    { title: "New Micropost | Sample App" },
    { name: "description", content: "Create a new micropost" },
  ];
}

export default function NewMicropost() {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      const formData = new FormData();
      formData.append("micropost[content]", content);
      
      if (fileInputRef.current?.files && fileInputRef.current.files.length > 0) {
        formData.append("micropost[image]", fileInputRef.current.files[0]);
      }
      
      const response = await fetch("/api/microposts", {
        method: "POST",
        body: formData,
      });
      
      if (response.ok) {
        setSuccess(true);
        setContent("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        // 3秒後にフィードページにリダイレクトする
        setTimeout(() => {
          window.location.href = "/microposts";
        }, 3000);
      } else {
        const data = await response.json();
        if (data.errors) {
          if (typeof data.errors === "string") {
            setError(data.errors);
          } else if (Array.isArray(data.errors)) {
            setError(data.errors.join(", "));
          } else if (typeof data.errors === "object") {
            const errorMessages = Object.values(data.errors).flat();
            setError(errorMessages.join(", "));
          }
        } else {
          throw new Error("An error occurred");
        }
      }
    } catch (err) {
      console.error("投稿エラー:", err);
      setError("投稿の作成に失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="row">
      <div className="col-md-8">
        <h1>New Micropost</h1>
        
        {success && (
          <div className="alert alert-success">
            投稿が作成されました。フィードページにリダイレクトします...
          </div>
        )}
        
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <textarea
              className="form-control"
              rows={5}
              placeholder="Compose new micropost..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              maxLength={140}
            />
            <small className="text-muted">
              {content.length}/140 characters
            </small>
          </div>
          
          <div className="form-group">
            <input
              type="file"
              className="form-control-file"
              accept="image/jpeg,image/png,image/gif"
              ref={fileInputRef}
            />
            <small className="text-muted">
              Maximum file size: 5MB. Supported formats: JPEG, PNG, GIF.
            </small>
          </div>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || content.trim().length === 0}
          >
            {isSubmitting ? "投稿中..." : "Post"}
          </button>
          <a href="/microposts" className="btn btn-secondary ml-2">
            Cancel
          </a>
        </form>
      </div>
    </div>
  );
} 