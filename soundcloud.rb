require 'rubygems'
require 'sinatra'
require 'haml'
require 'less'
require 'digest/md5'
require 'dm-core'
require 'dm-types'
require 'dm-migrations'

DataMapper::Logger.new($stdout, :debug)
DataMapper.setup(:default, 'sqlite::memory:')


class Upload
  include DataMapper::Resource

  property :sid,        String, :key => true
  property :tmp,        FilePath
  property :totalsize,  Integer
end

DataMapper.finalize
DataMapper.auto_migrate!


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
    tmp = params[:file][:tempfile]
    @sid = sid
    filename = params[:file][:filename]
    length = env['CONTENT_LENGTH']
    upload = Upload.create(
      :sid => @sid,
      :tmp => tmp.path,
      :totalsize => length
    )
    File.open("#{options.filesdir}/#{filename}", 'w+') do |file|
      file << tmp.read
    end
    #"assoc #{@@assoc.inspect}"
    halt 200
    #"sid #{@sid}"
  end
end

get '/status/:sid' do
  h = Upload.get params[:sid]
  unless h.nil?
    #percentage = (h[:file].size / h[:size].to_f) * 100
    percentage = ( h.tmp.size / h.totalsize.to_f ) * 100
    "#{percentage}%"
  else
    "0%"
    #"psid #{params[:sid]}"
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
