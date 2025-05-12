Rails.application.routes.draw do
  root   "static_pages#home"
  get    "/help",    to: "static_pages#help"
  get    "/about",   to: "static_pages#about"
  get    "/contact", to: "static_pages#contact"
  get    "/signup",  to: "users#new"
  get    "/login",   to: "sessions#new"
  post   "/login",   to: "sessions#create"
  delete "/logout",  to: "sessions#destroy"
  get    "/feed",    to: "static_pages#home", defaults: { format: :json }
  get    "/logged_in_status", to: "static_pages#logged_in_status"

  namespace :api do
    resources :users, only: [:index, :show, :create, :update, :destroy] do
      member do
        get :following, :followers
        get :microposts
      end
    end

    post   "/login",   to: "sessions#create"
    delete "/logout",  to: "sessions#destroy"
    get    "/logged_in_status", to: "static_pages#logged_in_status"

    resources :account_activations, only: [:edit]
    resources :password_resets,     only: [:new, :create, :edit, :update]
    resources :microposts,          only: [:create, :destroy]
    resources :relationships,       only: [:create, :destroy]
  end

  resources :users do
    member do
      get :following, :followers
      get :microposts, defaults: { format: :json }
    end
  end
  resources :account_activations, only: [:edit]
  resources :password_resets,     only: [:new, :create, :edit, :update]
  resources :microposts,          only: [:create, :destroy]
  resources :relationships,       only: [:create, :destroy]

  get '*path', to: 'static_pages#home', constraints: ->(request) do
    !request.xhr? && request.format.html?
  end
end
