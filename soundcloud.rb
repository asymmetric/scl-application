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
  property :path,       FilePath
end

DataMapper.finalize
DataMapper.auto_migrate!

set :filesdir, Proc.new { "#{root}/files" }

get '/' do
  haml :main
end

get '/files' do
  "You asked for all the files"
end

get '/files/:sid' do
  upload = Upload.get params[:sid]
  unless upload.nil?
    "#{upload.path}"
  else
    "Could not find upload with sid #{params[:sid]}"
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

    upload = Upload.create(
      :sid => sid,
      :path => path
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
