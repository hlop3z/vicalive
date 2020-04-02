from quart import Quart, websocket, request

app = Quart(__name__)

@app.route("/")
async def index():
    return {"Hello": "World!"}

@app.route('/json', methods=['POST'])
async def json():
    data =  await request.get_json()
    return data

"""
@app.route("/hello")
async def hello():
    return await render_template("index.html")
"""

app.run(host="127.0.0.1", port=6000)

"""
import requests
link = "http://127.0.0.1:5000"
res_get = requests.get( link )
res_post = requests.post(f'{ link }/json', json={'message': 'Hello From The Other Side!'})

print( res_get.json() )
print( res_post.json() )
"""
