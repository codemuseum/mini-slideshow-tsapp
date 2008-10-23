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
  
end
