import { useState } from "react";
import type { Route } from "./+types/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Log in | Sample App" },
    { name: "description", content: "Log in to the Sample App" },
  ];
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session: {
            email,
            password,
            remember_me: rememberMe ? "1" : "0",
          },
        }),
      });
      
      if (response.ok) {
        // セッションが確立されたら、ユーザーページにリダイレクト
        window.location.href = "/";
      } else {
        setError("メールアドレスとパスワードの組み合わせが無効です");
      }
    } catch (error) {
      console.error("ログインエラー:", error);
      setError("ログイン中にエラーが発生しました。後でもう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="row">
      <div className="col-md-6 col-md-offset-3">
        <h1>Log in</h1>
        
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="checkbox">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />{" "}
              Remember me on this computer
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "ログイン中..." : "Log in"}
          </button>
        </form>

        <p>
          New user? <a href="/signup">Sign up now!</a>
        </p>
        <p>
          <a href="/password_resets/new">Forgot password?</a>
        </p>
      </div>
    </div>
  );
} 