Rails.application.routes.draw do
  get    "/help",    to: "static_pages#help"
  get    "/about",   to: "static_pages#about"
  get    "/contact", to: "static_pages#contact"
  get    "/signup",  to: "users#new"
  get    "/login",   to: "sessions#new"
  post   "/login",   to: "sessions#create"
  delete "/logout",  to: "sessions#destroy"
  resources :account_activations, only: [:edit]
  resources :password_resets,     only: [:new, :create, :edit, :update]

  namespace :api do
    resources :users do
      member do
        get :following, :followers
      end
    end
    resources :microposts,          only: [:create, :destroy]
    resources :relationships,       only: [:create, :destroy]
    get '/microposts', to: 'static_pages#home'
  end
end
