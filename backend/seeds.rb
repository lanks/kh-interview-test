ActiveRecord::Base.establish_connection adapter: 'sqlite3',
                                        database: 'sqlite3:employee-directory.sqlite3'

seeded = !ActiveRecord::Base.connection.tables.empty?

unless seeded
  ActiveRecord::Migration.verbose = true
  ActiveRecord::Schema.define(version: 1) do
    create_table :employees do |t|
      t.string :first_name
      t.string :last_name
      t.integer :age
      t.string :position
      t.integer :department_id, index: true
    end

    create_table :departments do |t|
      t.string :name
    end
  end
end

class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true
end

class Employee < ApplicationRecord
  belongs_to :department
  validates :first_name, :last_name, :age, :position, :department_id, presence: true
  validate :not_in_department?, on: :create

  private
  def not_in_department?
    # Check if an employee with same name exists in the department
    existing = Employee.where(
      first_name: self.first_name,
      last_name: self.last_name,
      department_id: self.department_id
    ).none?
  end
end

class Department < ApplicationRecord
  has_many :employees
end

unless seeded
  departments = [
    Department.create!(name: 'Engineering'),
    Department.create!(name: 'Product'),
    Department.create!(name: 'Legal'),
    Department.create!(name: 'Marketing'),
    Department.create!(name: 'Sales'),
    Department.create!(name: 'Support'),
    Department.create!(name: 'HR'),
    Department.create!(name: 'Finance'),
    Department.create!(name: 'Operations'),
    Department.create!(name: 'IT')
  ]

  1000.times do
    Employee.create!(
      first_name: Faker::Name.first_name,
      last_name: Faker::Name.last_name,
      age: rand(18..65),
      position: Faker::Job.title,
      department: departments.sample
    )
  end
end
