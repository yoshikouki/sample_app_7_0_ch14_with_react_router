class MicropostsController < ApplicationController
  before_action :logged_in_user, only: [:create, :destroy]
  before_action :correct_user,   only: :destroy

  def create
    @micropost = current_user.microposts.build(micropost_params)
    @micropost.image.attach(params[:micropost][:image])
    if @micropost.save
      flash[:success] = "Micropost created!"

      respond_to do |format|
        format.html { redirect_to root_url }
        format.json { render json: @micropost, status: :created }
      end
    else
      @feed_items = current_user.feed.paginate(page: params[:page])

      respond_to do |format|
        format.html { render 'static_pages/home', status: :unprocessable_entity }
        format.json { render json: { errors: @micropost.errors }, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @micropost.destroy
    flash[:success] = "Micropost deleted"

    respond_to do |format|
      format.html do
        if request.referrer.nil? || request.referrer == microposts_url
          redirect_to root_url, status: :see_other
        else
          redirect_to request.referrer, status: :see_other
        end
      end

      format.json { head :no_content }
    end
  end

  private

    def micropost_params
      params.require(:micropost).permit(:content, :image)
    end

    def correct_user
      @micropost = current_user.microposts.find_by(id: params[:id])

      respond_to do |format|
        format.html { redirect_to root_url, status: :see_other if @micropost.nil? }
        format.json { render json: { error: "Not authorized" }, status: :forbidden if @micropost.nil? }
      end
    end
end
