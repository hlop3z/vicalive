import cherrypy
import cherrypy_cors

class app(object):
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def index(self, **params):
        return {"message": "Hello World < CherryPY >!"}

    @cherrypy.expose
    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def json(self, **params):
        data = cherrypy.request.json
        return data

    @classmethod
    def run(cls, host='127.0.0.1', port=8080):
        cherrypy_cors.install()
        cherrypy.config.update({
            'server.socket_host': host,
            'server.socket_port': port,
        })
        config = {
            '/': {
                'cors.expose.on': True,
            },
        }
        cherrypy.quickstart(cls(), config=config)


app.run(host='0.0.0.0', port=8013)

"""
import requests
link = "http://127.0.0.1:8080"
res_get = requests.get( link )
res_post = requests.post(f'{ link }/json', json={'message': 'Hello From The Other Side!'})

print( res_get.json() )
print( res_post.json() )
"""
