require './app'
require 'rack/cors'
require 'rack/contrib'

use Rack::Cors do
  allow do
    origins '*'
    resource '*', headers: :any, methods: %i[get post delete put options]
  end
end

use Rack::JSONBodyParser, verbs: ['POST', 'PATCH'], media: ['application/json', 'application/vnd.api+json']

run EmployeeDirectoryApp
