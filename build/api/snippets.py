from pathlib import Path
from . import sqlow

ROOT_PATH = Path(__file__).absolute().parent.parent

class Snippet( sqlow.Model ):
    lang    : None
    name    : None
    tags    : None
    info    : None
    notes   : None
    links   : None
    snippet : None

crud = lambda: Snippet(f'{ ROOT_PATH }/coderun/data/database.db')
#crud().create_table()
#crud().reset_table()

async def crud_snippet(action, json):
    if action == 'create':
        del json['id']
        data = crud().create( **json )
        data = crud().all()
        return ({ 'data': data.list })
    elif action == 'update':
        crud().update( **json )
        data = crud().get( int(json['id']) )
        return ({ 'data': data })
    elif action == 'delete':
        crud().delete( json['id'] )
        data = crud().all()
        return ({ 'data': data.list })
    elif action == 'get':
        data = crud().get( json['id'] )
        return ({'data': data})
    else:
        data = crud().all()
        if data: return ({ 'data': data.list })
