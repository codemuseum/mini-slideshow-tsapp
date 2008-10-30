class DataController < ApplicationController

  # GET /data.xml
  def index
    @page_objects = PageObject.find(:all, :conditions => { :urn => params[:from] })
    @data = @page_objects.collect { |po| { :urn => po.urn, :pictures => po.slides.collect(&:picture_url).join('|'), :picture => po.slides.first.picture_url} }
    
    respond_to do |format|
      format.xml  { render :xml => @data }
    end
  end

end
