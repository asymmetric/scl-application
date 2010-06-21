require 'rubygems'
require 'sinatra'
require 'haml'
require 'less'
require 'digest/md5'

set :app_file, __FILE__
set :root, File.dirname(__FILE__)
set :filesdir, "#{File.dirname(__FILE__)}/files"

get '/' do
  @sid = sid
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
    @tmp = params[:file][:tempfile]
    @sid = params[:sid]
    @filename = params[:file][:filename]
    File.open("#{options.filesdir}/#{@filename}", 'w+') do |file|
      file << @tmp.read
    end
    #"Uploaded #{params[:file][:filename]}"
    #"params: #{params.inspect}"
    "file size: #{env['CONTENT_LENGTH']}"
  end
end

get '/status/:sid' do
  "37%"
end

get '/views/:style' do
  content_type 'text/css', :charset => 'utf-8'
  less :style
end

helpers do
  def sid
    Digest::MD5.hexdigest rand.to_s
  end
end

not_found do
  'Sorry mate!'
end
