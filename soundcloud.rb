require 'rubygems'
require 'sinatra'
require 'haml'
require 'less'
require 'dm-core'
require 'dm-types'
require 'dm-migrations'
require 'json'

DataMapper::Logger.new($stdout, :debug)
DataMapper.setup(:default, 'sqlite::memory:')


class Upload
  include DataMapper::Resource

  property :sid,        String,   :key => true
  property :path,       FilePath, :required => true
  property :url,        URI,      :required => true
  property :error,      String
end

DataMapper.finalize
DataMapper.auto_migrate!

set :filesdir, Proc.new { "#{root}/files" }

get '/' do
  haml :main
end

get '/files/:sid' do
  file = Upload.get params[:sid]
  send_file file.path, :disposition => 'attachment'
end

get '/files' do
  "You asked for all the files"
end

get '/info/:sid' do
  content_type :json
  upload = Upload.get params[:sid]
  unless upload.nil?
    {
      :path => upload.path,
      :url => upload.url
    }.to_json
  else
    err = "Could not find upload with sid #{params[:sid]}"
    {
      :error => err
    }.to_json
  end
end

post '/files' do
  unless params[:file]
    @error = "No file selected"
  else
    sid = params[:sid]
    tmp = params[:file][:tempfile]
    filename = params[:file][:filename]
    path = "#{options.filesdir}/#{filename}"
    url = "files/#{sid}"

    upload = Upload.create(
      :sid  => sid,
      :path => path,
      :url  => url
    )
    File.open(path, 'w+') do |file|
      file << tmp.read
    end
    halt 200
  end
end

get '/views/:style' do
  content_type 'text/css', :charset => 'utf-8'
  less :style
end

not_found do
  'Sorry mate!'
end
