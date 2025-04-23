require 'graphiti'
require_relative './application_resource'

class EmployeeResource < ApplicationResource
  self.model = Employee
  self.type = :employees
  self.default_page_size = 10

  attribute :first_name, :string
  attribute :last_name, :string
  attribute :age, :integer
  attribute :position, :string
  attribute :department_id, :integer
  belongs_to :department

  # Unclear if this is the correct approach for filtering...
  # I couldn't find any example of filtering on belongs to, only on has many.
  filter :department_name, :string do
    eq do |scope, value|
      scope.joins(:department).where("lower(departments.name) = :value", value: value[0].downcase)
    end 
  end

  filter :name, :string do
    fuzzy_match do |scope, value|
      scope.where("lower(first_name || ' ' || last_name) LIKE :value", value: "%#{value[0].downcase}%")
    end
  end


end