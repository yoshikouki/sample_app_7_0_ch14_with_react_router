class StaticPagesController < ApplicationController
  def home
    if logged_in?
      @micropost  = current_user.microposts.build
      @feed_items = current_user.feed.paginate(page: params[:page])

      respond_to do |format|
        format.html
        format.json { render json: @feed_items }
      end
    end
  end

  def help
  end

  def about
  end

  def contact
  end

  def logged_in_status
    respond_to do |format|
      format.json { render json: { logged_in: logged_in?, user_id: current_user&.id } }
    end
  end
end
