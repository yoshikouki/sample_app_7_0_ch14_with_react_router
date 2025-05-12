class ApplicationController < ActionController::Base
  include SessionsHelper

  # API リクエストに対して CSRF トークン検証をスキップ
  skip_before_action :verify_authenticity_token, if: :json_request?

  private

    def json_request?
      request.format.json?
    end

    # ユーザーのログインを確認する
    def logged_in_user
      unless logged_in?
        store_location
        flash[:danger] = "Please log in."
        redirect_to login_url, status: :see_other
      end
    end
end
