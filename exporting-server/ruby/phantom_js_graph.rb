# Proxy class to the HighCharts.js graph engine using PhantomJS for headless JS
#
#
# - Example
#
#    PhantomJsGraph.options[:phantom_js_path] = '/usr/local/bin/phantomjs'
#    PhantomJsGraph.options[:highcharts_convert_path] = '/home/app/install/highcharts-convert.js'
#    PhantomJsGraph.options[:highcharts_theme_path] = '/home/app/install/highcharts-theme.js'
#    json = '{"title":{"text":"Registrations"},"yAxis":{"title":{"text":"Visits"},"stackLabels":{"enabled":true}},"xAxis":{"labels":{"rotation":-45,"align":"right"},"categories":["2013-04-10","2013-04-11","2013-04-12","2013-04-13","2013-04-14","2013-04-15","2013-04-16","2013-04-17","2013-04-18","2013-04-19","2013-04-20","2013-04-21","2013-04-22","2013-04-23","2013-04-24","2013-04-25"]},"credits":{"enabled":false},"series":[{"name":"Registrations","data":[10,20,15,12,9,34,23,13,11,11,10,19,15,5,2,1]},{"name":"Cancelations","data":[1,0,2,0,0,3,0,0,1,1,1,0,4,0,1,0]}]}'
#
#    image = nil
#    PhantomJsGraph.create( {}, json ) do | p_js |
#      image = p_js.image
#    end
#    # Do something with it
#    image
#
class PhantomJsGraph
  DEFAULT_OPTIONS = { logger: false, auto_process: true, phantom_js_path: nil, highcharts_convert_path: nil, highcharts_theme_path: nil }

  def initialize( opts, graph_json, callback_json = nil )
    @@options = self.options.merge( opts )
    @config_file = Tempfile.new( ['json', '.json'] )
    @callback_file = Tempfile.new( ['callback', '.json'] )
    @image_file = Tempfile.new( ['image', '.png'] )
    self.callback = callback_json
    self.json = graph_json
  end

  def self.options; @@options ||= DEFAULT_OPTIONS; @@options; end
  def options; PhantomJsGraph.options; end
  def log( msg ); options[:logger].debug( msg ) if options[:logger]; end

  def json=( json )
    @json = json
    @config_file.write( json )
    @config_file.flush
    process if self.options[:auto_process]
  end

  # Note unlike the phantomjs command line you do not need to wrap your code in
  # an anonymous function, that is already done for you here. Just make use of chart.
  def callback=( json )
    json = "function(chart) {\n#{json}\n}"
    @callback_file.write( json )
    @callback_file.flush
  end

  def image
    @image_file.read
  end

  def process
    log(to_s)
    log(`#{build_cmd}`)
  end

  # Nicely handles clean up of temp files.
  def self.create( *params, &block )
    p_graph = PhantomJsGraph.new( *params )
    if block_given?
      yield( p_graph )
    else
      raise 'Requires block'
    end
  end

  def to_s
    "<PhantomJsGraph path='#{options[:phantom_js_path]}' highcharts_convert_path='#{options[:highcharts_convert_path]}' config_temp='#{@config_file.path}' image_temp='#{@image_file.path}' phantom_js_command='#{build_cmd}'\njson: #{@json.inspect}\n>"
  end

private
  def build_cmd
    raise 'Requires Phantom JS path to be set' unless File.exists?( options[:phantom_js_path].to_s )
    raise 'Requires HighCharts Convert JS path to be set' unless File.exists?( options[:highcharts_convert_path].to_s )
    raise 'Requires config file' unless @config_file
    raise 'Requires out file' unless @image_file
    cmd = "#{options[:phantom_js_path]} #{options[:highcharts_convert_path]} -infile #{@config_file.path} -outfile #{@image_file.path} -scale 2.5 -width 300 -constr Chart"
    cmd += " -theme #{options[:highcharts_theme_path]}" if options[:highcharts_theme_path]
    cmd
  end
end
