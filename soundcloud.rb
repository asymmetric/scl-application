require 'rubygems'
require 'sinatra'
require 'haml'
require 'less'
require 'digest/md5'


class Uploads

  @assoc ||= {}

  def self.all
    @assoc
  end

  def self.[] sid
    @assoc[sid]
  end

  def self.add sid, tmpfile, size
    @assoc[sid] = { :file => tmpfile, :size => size }
  end

end


set :app_file, __FILE__
set :root, Proc.new { File.dirname app_file }
set :filesdir, Proc.new { "#{root}/files" }
set :reload, false
#set :environment, :test

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
    Uploads.add @sid, tmp, env['CONTENT_LENGTH']
    File.open("#{options.filesdir}/#{filename}", 'w+') do |file|
      file << tmp.read
    end
    #"assoc #{@@assoc.inspect}"
    halt 200
  end
end

get '/status/:sid' do
  halt if Uploads.all.nil?
  h = Uploads[params[:sid]]
  unless h.nil?
    percentage = (h[:file].size / h[:size].to_f) * 100
    "#{percentage}%"
  else
    "0%"
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
end

not_found do
  'Sorry mate!'
end
