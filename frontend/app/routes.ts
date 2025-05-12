import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/signup", "routes/signup.tsx"),
  route("/login", "routes/login.tsx"),
  route("/users", "routes/users/index.tsx"),
  route("/users/:id", "routes/users/user.tsx"),
  route("/microposts", "routes/microposts/index.tsx"),
  route("/microposts/new", "routes/microposts/new.tsx"),
] satisfies RouteConfig;
