require 'rubygems'
require 'sinatra'
require 'haml'
require 'less'

set :app_file, __FILE__
set :root, File.dirname(__FILE__)

get '/' do
  haml :main
end

post '/files' do
  unless params[:file]
    @error = "No file selected"
  else
    File.new params[:file][:filename], 'w+'
    "Uploaded #{params[:file][:filename]}"
  end
end

get '/send' do
  erb :main
end

get '/views/style.css' do
  content_type 'text/css', :charset => 'utf-8'
  less :style
end

helpers do
  def my_send filename
    "sending #{filename}"
  end
end

not_found do
  'Sorry mate!'
end
