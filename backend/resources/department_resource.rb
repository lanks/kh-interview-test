require 'graphiti'
require_relative './application_resource'

class DepartmentResource < ApplicationResource
  self.model = Department
  self.type = :departments

  attribute :name, :string

  self.default_page_size = 10
end