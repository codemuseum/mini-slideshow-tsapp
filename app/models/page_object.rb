class PageObject < ActiveRecord::Base
  DEFAULT_DELAY_SECONDS = 4

  include ThriveSmartObjectMethods
  self.caching_default = :page_update #[in :forever, :page_update, :any_page_update, 'data_update[datetimes]', :never, 'interval[5]']

  
  has_many :slides, :order => "position", :dependent => :destroy
  attr_accessor :added_slides
  
  validates_numericality_of :delay, :only_integer => true, :greater_than => 0
  validates_associated :slides

  before_validation :set_default_delay
  after_save :save_slides

  def validate
    unless self.added_slides.nil?
      self.added_slides.each do |slide|
        unless slide.valid?
          errors.add(:slides, " have an error that must be corrected - did you forget to give it a picture?")
        end
      end
    end
  end
  
  def after_initialize
    if new_record?
      self.delay = DEFAULT_DELAY_SECONDS
    end
  end
  
  # Responsible for removing and adding all slides to this page_object. The general flow is:
  #  If the slide isn't a part of the slides array already, save to added_slides for after_save
  #  If the slide is missing from the array, mark it to be removed for after_save 
  def assigned_slides=(array_hash)
    # Find new slides (but no duplicates)
    self.added_slides = []
    array_hash.each do |h|
      unless slides.detect { |c| c.id.to_s == h[:id] } || self.added_slides.detect { |f| f.id.to_s == h[:id] }
        c = !h[:id].blank? ? Slide.find(h[:id]) : Slide.new({:page_object => self})
        c.attributes = h.reject { |k,v| k == :id } # input values, but don't try to overwrite the id
        self.added_slides << c unless c.nil?
      end
    end
    # Delete removed slides
    slides.each do |c|
      if h = array_hash.detect { |h| h[:id] == c.id.to_s }
        c.attributes = h.reject { |k,v| k == :id }
      else
        c.destroy_association = 1
      end
    end
  end
  
  protected
    # If delay isn't set, defaults to a sane number
    def set_default_delay
      self.delay = DEFAULT_DELAY_SECONDS if self.delay.nil?
    end
    
    # Destroy slides marked for deletion, and adds slides marked for addition.
    # Done this way to account for association auto-saves.
    def save_slides
      self.slides.each { |c| if c.destroy_association? then c.destroy else c.save end }
      self.added_slides.each { |c| c.save unless c.nil? } unless self.added_slides.nil?
    end
end
