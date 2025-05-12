import { useState } from "react";
import type { Route } from "./+types/signup";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sign up | Sample App" },
    { name: "description", content: "Sign up for the Sample App" },
  ];
}

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: {
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
          },
        }),
      });
      
      if (response.ok) {
        setSuccess(true);
        setName("");
        setEmail("");
        setPassword("");
        setPasswordConfirmation("");
      } else {
        const data = await response.json();
        if (data.errors) {
          setErrors(data.errors);
        }
      }
    } catch (error) {
      console.error("ユーザー登録エラー:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="row">
      <div className="col-md-6 col-md-offset-3">
        <h1>Sign up</h1>
        
        {success && (
          <div className="alert alert-info">
            登録確認メールをご確認ください。アカウントを有効化するにはメール内のリンクをクリックしてください。
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {errors.name && (
              <div className="invalid-feedback">
                {errors.name.join(", ")}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && (
              <div className="invalid-feedback">
                {errors.email.join(", ")}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && (
              <div className="invalid-feedback">
                {errors.password.join(", ")}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password-confirmation">Confirmation</label>
            <input
              type="password"
              id="password-confirmation"
              className={`form-control ${errors.password_confirmation ? "is-invalid" : ""}`}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
            {errors.password_confirmation && (
              <div className="invalid-feedback">
                {errors.password_confirmation.join(", ")}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "送信中..." : "Create my account"}
          </button>
        </form>
      </div>
    </div>
  );
} 