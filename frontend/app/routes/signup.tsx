import type { Route } from "./+types/signup";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sign up | Sample App" },
    { name: "description", content: "Sign up for the Sample App" },
  ];
}

export default function Signup() {
  return (
    <div className="row">
      <div className="col-md-6 col-md-offset-3">
        <h1>Sign up</h1>
        <p>This will be a signup page for new users.</p>
      </div>
    </div>
  );
} 