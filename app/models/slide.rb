class Slide < ActiveRecord::Base
  
  belongs_to :page_object

  attr_protected :page_object_id
  validates_presence_of :asset_urn
  
  def picture?
    ThriveSmart::Helpers::AssetHelper::asset?(asset_type, asset_urn)
  end
  
  def picture_url
    @picture_url ||= ThriveSmart::Helpers::AssetHelper::asset_url(asset_type, asset_urn)
  end
  
  def new_and_empty?
    new_record? && asset_urn.blank? && title.blank? && link.blank?
  end
  
  ###### Association Specific Code

  # Used for other models that might need to mark a slide as *no longer* associated 
  attr_accessor :destroy_association

  # Used for other models (like an page_object) that might need to mark this slide as *no longer* associated
  def destroy_association?
    destroy_association.to_i == 1
  end
end
