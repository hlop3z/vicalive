import asyncio
import jinja2
from pathlib import Path

import socket
import fcntl
import struct
import psutil

def get_ip_address(ifname):
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        return socket.inet_ntoa(fcntl.ioctl(
            s.fileno(),
            0x8915,  # SIOCGIFADDR
            struct.pack('256s', ifname[:15].encode('utf-8'))
        )[20:24])
    except Exception as e:
        return False

def get_ips():
    addrs = psutil.net_if_addrs()
    result = map(lambda x: get_ip_address(x), addrs.keys())
    return filter(lambda x: x is not False, result)

ROOT_PATH = Path(__file__).absolute().parent
APP_PATH = Path(ROOT_PATH).parent
PID = None

import api

def set_os():
    if api.pyll.get_os() == 'linux':
        with open(f'{ ROOT_PATH }/static/settings.js', 'w+') as file:
            file.write( 'const isLinux = true;' )
    else:
        with open(f'{ ROOT_PATH }/static/settings.js', 'w+') as file:
            file.write( 'const isLinux = false;' )

PORT = 8012
ALLOW_ORIGIN = (
    [ f"http://{ ip }:{ PORT }" for ip in get_ips() ]
    +
    [ f"http://{ ip }:8011" for ip in get_ips() ]
    +
    [ f"http://0.0.0.0:8011", f"http://0.0.0.0:{ PORT }" ]
)

from quart import Quart, websocket, request, render_template, send_from_directory, send_file
from quart_cors import cors
from aiofile import AIOFile, LineReader

app = Quart('test_quart')
app = cors(
    app,
    #allow_origin=ALLOW_ORIGIN,
    #allow_credentials=True,
    allow_origin=['*'],
    allow_methods=["GET", "POST"],
)

PID  = None
SPID = None
BPID = None

@app.after_serving
async def close_all_subprocess():
    global PID
    global SPID
    global BPID
    api.pyll.pylive.kill( PID )
    api.pyll.pylive.kill( SPID )
    api.pyll.pylive.kill( BPID )


@app.route("/")
async def index():
    #SETUP
    set_os()
    return await render_template("index.html")

@app.route('/static/<path:path>')
async def send_js(path):
    return await send_from_directory('static', path)

@app.route('/api/<crud>/<action>', methods=['POST'])
async def crud_system(crud, action):
    json_in =  await request.get_json()
    data = json_in
    if crud == 'fullstack':
        return await api.fullstack(action, data)
    if crud == 'snippet':
        return await api.snippet(action, data)

@app.route('/database/export')
async def database_path_to_copy():
    db_path = f"{ ROOT_PATH.absolute() }/coderun/data"
    return db_path

@app.route('/database/database.db')
async def database_path():
    return await send_from_directory('coderun/data', 'database.db')

@app.route('/database/import', methods=['POST'])
async def upload_file():
    request_files = await request.files
    if 'file' in request_files:
        file = request_files['file']
        #file.filename
        data = file.read()
        with open(f"{ ROOT_PATH }/coderun/data/database.db", "wb") as f:
            f.write( data )
        return { "data" : True }
    else:
        return "No files"

@app.route('/html_live/view')
async def html_view():
    templateLoader = jinja2.FileSystemLoader(searchpath=f'{ROOT_PATH}/templates')
    templateEnv = jinja2.Environment(loader=templateLoader)
    TEMPLATE_FILE = "live_html/index.html"
    template = templateEnv.get_template(TEMPLATE_FILE)
    BASE_HTML = template.render()
    return BASE_HTML

@app.route('/html_live/run', methods=['POST'])
async def html_run():
    data =  await request.get_json()
    code = data['data']
    with open(f'{ ROOT_PATH }/templates/live_html/head.html', 'w+') as file:
        file.write( code['head'] )
    with open(f'{ ROOT_PATH }/templates/live_html/body.html', 'w+') as file:
        file.write( code['body'] )
    with open(f'{ ROOT_PATH }/templates/live_html/scripts.html', 'w+') as file:
        file.write( code['scripts'] )
    return {'data':True}

@app.route('/pylive/view')
async def pylive_view():
    log_path= f"{ ROOT_PATH }/logs/py_log_from_server.txt"
    payload = ""
    async with AIOFile(log_path, 'r') as asp:
        async for line in LineReader(asp): payload += line
    return payload

@app.route('/pylive/stop/<action>')
async def pylive_stop(action):
    global PID
    global SPID
    global BPID
    if   action == 'shell': api.pyll.pylive.kill( BPID )
    elif action == 'live' : api.pyll.pylive.kill( PID )
    else                  : api.pyll.pylive.kill( SPID )
    return {'data':True}

@app.route('/pylive/start/<action>', methods=['POST'])
async def pylive_run(action):
    global PID
    global SPID
    global BPID
    data =  await request.get_json()
    code = data['data']
    payload = ""
    if action in ['cherrypy', 'sanic', 'quart']:
        if SPID : api.pyll.pylive.kill( SPID )
        SPID = await api.pyll.pylive.server( code )
        return str(SPID)
    elif action == 'live':
        log_path = f"{ ROOT_PATH }/logs/py_log_single_run.txt"
        if PID: api.pyll.pylive.kill( PID )
        PID = await api.pyll.pylive.run( code )
        while api.pyll.pylive.isActive(PID):
            await asyncio.sleep(0.1)
        await asyncio.sleep(0.25)
        async with AIOFile(log_path, 'r') as asp:
            async for line in LineReader(asp): payload += line
        return payload
    elif action == 'shell':
        log_path = f"{ ROOT_PATH }/logs/sh_log.txt"
        if BPID: api.pyll.pylive.kill( BPID )
        BPID = await api.pyll.pylive.cmd( code )
        while api.pyll.pylive.isActive(BPID):
            await asyncio.sleep(0.1)
        await asyncio.sleep(0.25)
        async with AIOFile(log_path, 'r') as asp:
            async for line in LineReader(asp): payload += line
        return payload
    else:
        log_path = f"{ ROOT_PATH }/logs/sh_log.txt"
        cmd_path = f"{ ROOT_PATH }/coderun/run_shell.sh"
        if BPID: api.pyll.pylive.kill( BPID )
        with open(cmd_path, 'w+') as file:
            file.write( code )
        await asyncio.sleep(0.1)
        BPID = await api.pyll.pylive.cmd( f'sh { cmd_path }')
        while api.pyll.pylive.isActive(BPID):
            await asyncio.sleep(0.1)
        await asyncio.sleep(0.25)
        async with AIOFile(log_path, 'r') as asp:
            async for line in LineReader(asp): payload += line
        return payload
        return ''


@app.route('/json', methods=['POST'])
async def json():
    data =  await request.get_json()
    return data


app.run(host="0.0.0.0", port=PORT)
