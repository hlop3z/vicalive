import jinja2
import pathlib
import shlex
import asyncio
import subprocess

from sanic import Sanic
from sanic import response
from sanic_compress import Compress
from sanic_cors import CORS

from vuefy import vue_components
from include import components

cmd = lambda cmd: subprocess.run(cmd, check=True, shell=True)

app = Sanic('frontend')
CORS(app, automatic_options=True, supports_credentials=True)
Compress(app)

ROOT_PATH = pathlib.Path(__file__).absolute().parent
APP_PATH = pathlib.Path(ROOT_PATH).parent

app.static('/static', f'{ APP_PATH }/build/static')

async def minify_and_beautify():
    FILE_JS_MIN = f"{ APP_PATH }/build/static/bundle.min.js"
    FILE_JS     = f"{ APP_PATH }/build/static/bundle.js"
    javascript = ""
    with open(f'{ ROOT_PATH }/run/lib.js', 'r') as file:
        javascript += file.read()
    with open(f'{ ROOT_PATH }/run/scripts.js', 'r') as file:
        javascript += file.read()
    with open(f'{ ROOT_PATH }/run/mixin.js', 'r') as file:
        javascript += file.read()
    with open(f'{ ROOT_PATH }/setup/global_mixin.js', 'r') as file:
        javascript += file.read()
    with open(f'{ ROOT_PATH }/setup/vue.js', 'r') as file:
        javascript += file.read()
    with open(FILE_JS_MIN, 'w') as file:
        file.write( javascript.strip() )
    cmd(f"""terser -b -- { shlex.quote( FILE_JS_MIN ) } > { shlex.quote( FILE_JS ) }""")
    #cmd(f"""mv { shlex.quote( FILE_JS ) } { shlex.quote( FILE_JS_MIN ) }""")
    cmd(f"""terser -c toplevel,sequences=false,drop_console=true --mangle -- { shlex.quote( FILE_JS ) } > { shlex.quote( FILE_JS_MIN ) }""")


@app.route('/')
@app.route('/<path:path>')
async def handle_template(request, path=''):
    vue = vue_components(ROOT_PATH, components)
    with open(f'{ ROOT_PATH }/run/mixin.js', 'w') as file:
        file.write( vue.mixin )
    with open(f'{ ROOT_PATH }/run/scripts.js', 'w') as file:
        file.write( vue.script )

    templateLoader = jinja2.FileSystemLoader(searchpath=f'{ ROOT_PATH }')
    templateEnv = jinja2.Environment(loader=templateLoader, trim_blocks=True,
                                     block_start_string='@@',
                                     block_end_string='@@',
                                     variable_start_string='@=',
                                     variable_end_string='=@'
                                    )
    TEMPLATE_FILE = "base.html"
    asyncio.sleep(1)
    template  = templateEnv.get_template(TEMPLATE_FILE)
    BASE_HTML = template.render()

    my_lib    = templateEnv.get_template('setup/include.js')
    LIB_HTML  = my_lib.render()
    with open(f'{ ROOT_PATH }/run/lib.js', 'w') as file:
        file.write( LIB_HTML )

    await minify_and_beautify()
    return response.html( BASE_HTML )

async def save_five_seconds():
    vue = vue_components(ROOT_PATH, components)
    FILE_JS_MIN = f"{ APP_PATH }/build/static/bundle.min.js"
    FILE_JS     = f"{ APP_PATH }/build/static/bundle.js"
    while True:
        await asyncio.sleep(5)
        await minify_and_beautify()


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8011, debug=True)
