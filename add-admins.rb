require "json"
require 'csv'
require 'net/http'


  def post_http_request(url,content)
    uri = URI.parse(url)
    http = Net::HTTP.new(uri.host,uri.port)
    request = Net::HTTP::Post.new(uri.path,{"Accept"=> "application/json"})
    request.content_type='application/json'
    request.body=content

    http.request(request) do |resp|
      #raise "Unable to access" unless resp.is_a?(Net::HTTPSuccess)
      return resp.body
    end
  end

agents = CSV.read('admins.csv',{ :col_sep => ';' })
agents.each do |admin|
  content = {:employeeId =>admin[0], :fullName =>admin[1], :isAdmin => true}
  post_http_request('http://localhost:1337/user/',content.to_json)
  sleep(0.1)
end
