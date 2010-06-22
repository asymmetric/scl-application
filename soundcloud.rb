require 'rubygems'
require 'sinatra'
require 'haml'
require 'less'
require 'digest/md5'


class Uploads < Hash

  def initialize
    @assoc = {}
  end

  def [] sid
    @assoc[sid]
  end

  def []= sid, tmpfile, size
    @assoc[sid] = { :file => tmpfile, :size => size }
  end

end


set :app_file, __FILE__
set :root, Proc.new { File.dirname app_file }
set :filesdir, Proc.new { "#{root}/files" }

before do
  @assoc_hash ||= Uploads.new
end

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
    tmp = params[:file][:tempfile]
    @sid = params[:sid]
    filename = params[:file][:filename]
    #set_assoc @sid, tmp, env['CONTENT_LENGTH']
    @assoc_hash[@sid] = tmp, env['CONTENT_LENGTH']
    #@@assoc[@sid] = { :file => tmp, :size => env['CONTENT_LENGTH'] }
    File.open("#{options.filesdir}/#{filename}", 'w+') do |file|
      file << tmp.read
    end
    #"assoc #{@@assoc.inspect}"
    halt 200
  end
end

get '/status/:sid' do
  #h = assoc params[:sid]
  unless @assoc_hash.nil?
    h = @assoc_hash[:sid]
    unless h.nil?
      percentage = (h[:file].size / h[:size].to_f) * 100
      "#{percentage}%"
    else
      "0%"
    end
  else
    "fuck you"
  end
end

get '/views/:style' do
  content_type 'text/css', :charset => 'utf-8'
  less :style
end

helpers do
  def sid
    Digest::MD5.hexdigest rand.to_s
  end

  def set_assoc sid, tmp, size
    @@assoc[sid] = { :file => tmp, :size => size }
  end

  def assoc sid
    @@assoc[sid]
  end
end

not_found do
  'Sorry mate!'
end
