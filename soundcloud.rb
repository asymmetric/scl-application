require 'rubygems'
require 'sinatra'
require 'haml'
require 'less'

set :app_file, __FILE__
set :root, Proc.new { File.dirname app_file }
set :filesdir, Proc.new { "#{root}/files" }

get '/' do
  haml :main
end

get '/files' do
  "You asked for all the files"
end

get '/files/:id' do
  "You asked for the file with id #{params[:id]}"
end

post '/files' do
  unless params[:file]
    @error = "No file selected"
  else
    #File.new params[:file][:filename], 'w+'
    "Uploaded #{params[:file][:filename]}"
    @s = ""
    params[:file].each { |x, y| @s += "key #{x}, value #{y.class} " }
    "params[:file] : #{@s}"
  end
end

get '/status' do
  "37%"
end

get '/views/:style' do
  content_type 'text/css', :charset => 'utf-8'
  less :style
end

not_found do
  'Sorry mate!'
end
