require 'faker'
require 'active_record'
require 'graphiti'
require 'graphiti/adapters/active_record'
require './seeds'
require 'kaminari'
require 'sinatra/base'
require './resources/department_resource'
require './resources/employee_resource'

Graphiti.setup!
Graphiti.configure do |c|
  c.debug_models = true
end

class EmployeeDirectoryApp < Sinatra::Application
  configure do
    mime_type :jsonapi, 'application/vnd.api+json'
  end

  before do
    content_type :jsonapi
  end

  after do
    ActiveRecord::Base.connection_handler.clear_active_connections!
  end

  get '/api/v1/employees' do
    employees = EmployeeResource.all(params)
    employees.to_jsonapi
  end

  post '/api/v1/employees' do
    employee = EmployeeResource.build(params)
    employee.save
    employee.to_jsonapi
  end

  get '/api/v1/departments' do
    departments = DepartmentResource.all(params)
    departments.to_jsonapi
  end

  get '/api/v1/departments/:id' do
    departments = DepartmentResource.find(params)
    departments.to_jsonapi
  end
end
