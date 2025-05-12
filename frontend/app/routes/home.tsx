import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sample App" },
    { name: "description", content: "Ruby on Rails Tutorial Sample App" },
  ];
}

export default function Home() {
  return (
    <div className="center jumbotron">
      <h1>Welcome to the Sample App</h1>
      <p>
        This is the home page for the{" "}
        <a href="https://railstutorial.jp/">Ruby on Rails Tutorial</a>
        {" "}sample application.
      </p>
      <a href="/signup" className="btn btn-lg btn-primary">Sign up now!</a>
    </div>
  );
}
