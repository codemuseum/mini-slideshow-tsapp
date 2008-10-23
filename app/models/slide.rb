class Slide < ActiveRecord::Base
  
  belongs_to :page_object

  attr_protected :page_object_id
  validates_presence_of :asset_urn
  
  def picture?
    @picture || ( !self.asset_urn.blank? && !self.asset_type.blank? )
  end
  
  def picture_url
    @picture_url ||= "#{ThriveSmart::Constants.ts_platform_host}/#{asset_type.downcase.pluralize}/#{asset_urn}.img"
  end
  
  ###### Association Specific Code

  # Used for other models that might need to mark a slide as *no longer* associated 
  attr_accessor :destroy_association

  # Used for other models (like an page_object) that might need to mark this slide as *no longer* associated
  def destroy_association?
    destroy_association.to_i == 1
  end
end
