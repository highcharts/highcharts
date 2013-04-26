
Proxy class to the HighCharts.js graph engine using PhantomJS for headless JS

## Example

    PhantomJsGraph.options[:phantom_js_path] = '/usr/local/bin/phantomjs'
    PhantomJsGraph.options[:highcharts_convert_path] = '/home/app/install/highcharts-convert.js'
    PhantomJsGraph.options[:highcharts_theme_path] = '/home/app/install/highcharts-theme.js'
    json = '{"title":{"text":"Registrations"},"yAxis":{"title":{"text":"Visits"},"stackLabels":{"enabled":true}},"xAxis":{"labels":{"rotation":-45,"align":"right"},"categories":["2013-04-10","2013-04-11","2013-04-12","2013-04-13","2013-04-14","2013-04-15","2013-04-16","2013-04-17","2013-04-18","2013-04-19","2013-04-20","2013-04-21","2013-04-22","2013-04-23","2013-04-24","2013-04-25"]},"credits":{"enabled":false},"series":[{"name":"Registrations","data":[10,20,15,12,9,34,23,13,11,11,10,19,15,5,2,1]},{"name":"Cancelations","data":[1,0,2,0,0,3,0,0,1,1,1,0,4,0,1,0]}]}'

    image = nil
    PhantomJsGraph.create( {}, json ) do | p_js |
      image = p_js.image
    end
    # Do something with it
    image


## Rails Example

    class GraphController < ActionController::Base
      def graph
        PhantomJsGraph.options[:phantom_js_path] = '/usr/local/bin/phantomjs'
        PhantomJsGraph.options[:highcharts_convert_path] = '/home/app/install/highcharts-convert.js'
        PhantomJsGraph.options[:highcharts_theme_path] = '/home/app/install/highcharts-theme.js'
        PhantomJsGraph.options[:logger] = logger
        json = '{"title":{"text":"Registrations"},"yAxis":{"title":{"text":"Visits"},"stackLabels":{"enabled":true}},"xAxis":{"labels":{"rotation":-45,"align":"right"},"categories":["2013-04-10","2013-04-11","2013-04-12","2013-04-13","2013-04-14","2013-04-15","2013-04-16","2013-04-17","2013-04-18","2013-04-19","2013-04-20","2013-04-21","2013-04-22","2013-04-23","2013-04-24","2013-04-25"]},"credits":{"enabled":false},"series":[{"name":"Registrations","data":[10,20,15,12,9,34,23,13,11,11,10,19,15,5,2,1]},{"name":"Cancelations","data":[1,0,2,0,0,3,0,0,1,1,1,0,4,0,1,0]}]}'

        image = nil
        PhantomJsGraph.create( {}, json.to_json ) do | p_js |
          image = p_js.image
        end
        respond_to do | format |
          format.png { render text: image,
                status: 200, content_type: 'image/png' }
        end
      end
    end
