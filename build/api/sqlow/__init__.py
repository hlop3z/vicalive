import sqlite3
import functools

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

class SqliteDB:
    def __init__(self, database):
        self.database = database
        self.conn = None


    def tx(self, func):
        @functools.wraps(func)
        def wrapper_decorator(*args, **kwargs):
            self.open()
            try:
                with self.conn as tx:
                    value = func(tx, *args, **kwargs)
                    return value
            except sqlite3.Error as e:
                print(e)
                return False
            finally:
                self.close()
        return wrapper_decorator


    def open(self):
        try:
            conn = sqlite3.connect( self.database )
            conn.row_factory = dict_factory
            self.conn = conn
        except sqlite3.Error as e:
            print("Error connecting to database!")


    def close(self):
        if self.conn:
            self.conn.close()



import dataclasses as dc
from typing import List, Dict, Any
from collections import namedtuple
import json


class BaseMetaData:
    def __init__(self, table, fields):
        self.table  = table
        self.fields = fields
        self.form   = { k : "" for k in self.fields }
        self.vals   = [ "?" for k in range(1, 1+len(self.fields)) ]

    def __str__(self) : return f"Model\t: {self.table}\nFields\t: {self.fields}\nForm\t: {self.form}\nVals\t: {self.vals}"
    def __repr__(self): return f"Model: {self.table}\nFields: {self.fields}\nForm: {self.form}\nVals: {self.vals}"


def js_dumps(v): return v if isinstance(v, int) else json.dumps(v)
def js_loads(v): return v if isinstance(v, int) else json.loads(v)


@dc.dataclass
class Model:
    ______db______ : Any

    def __post_init__(self):
        self.____db____ = SqliteDB( self.______db______ )


    @property
    def _meta(self):
        hidden_keys = ['____db____', '______db______']
        return BaseMetaData(
            table  = self.__class__.__name__.title(),
            fields = list(filter(lambda v: v not in hidden_keys, self.__annotations__.keys() ))
        )



    def ____create____(self, tx, id=None,**kwargs):
        form   = self._meta.form.copy()
        form.update( kwargs )
        query  = f'insert into { self._meta.table } values (?,{ ",".join( self._meta.vals ) });'
        inputs = [id] + [ js_dumps(form[k]) for k in self._meta.fields ]
        last_row_id = tx.execute(query, inputs)
        form.update({ "id": last_row_id })
        return form

    def ____update____(self, tx, **kwargs):
        form = kwargs.copy()
        del form['id']
        query  = f'update { self._meta.table } set { ",".join( [ f"{k}=?" for k in form.keys()] ) } where id=?;'
        inputs = [ js_dumps(form[k]) for k in form.keys() ] + [ int(kwargs['id']) ]
        return tx.execute(query, inputs)

    def ____delete____(self, tx, uid):
        query = f'delete from { self._meta.table } where id=?;'
        return tx.execute(query, [uid])

    def ____list_items____(self, tx):
        query = f'select * from { self._meta.table };'
        return tx.execute(query).fetchall()

    def ____get_item____(self, tx, uid):
        query = f'select * from { self._meta.table } where id=?;'
        return tx.execute(query, [uid]).fetchone()

    def ____create_table____(self, tx):
        query = f"create table { self._meta.table } (id INTEGER PRIMARY KEY AUTOINCREMENT, { ','.join(self._meta.fields) })"
        return tx.execute(query)

    def ____drop_table____(self, tx):
        query = f"drop table { self._meta.table };"
        return tx.execute(query)




    def create(self, id=None, **kwargs):
        status = self.____db____.tx( self.____create____ )(id, **kwargs)
        if status: return status
        return False


    def update(self, **kwargs):
        status = self.____db____.tx( self.____update____ )(**kwargs)
        if status: return True
        return False


    def delete(self, uid):
        status = self.____db____.tx( self.____delete____ )(uid)
        if status: return True
        return False


    def all(self):
        items = self.____db____.tx( self.____list_items____ )()
        RecordsAPI = namedtuple("Records", ['list', 'dict'])
        objs = {}
        arr = []
        if items:
            for d in items:
                data = { k : js_loads(v) for k,v in d.items() }
                objs[ d['id'] ] = data
                arr.append(data)
        if items: return RecordsAPI(arr, objs)
        return RecordsAPI(arr, objs)

    def get(self, uid):
        items = self.____db____.tx( self.____get_item____ )(uid)
        if items:
            objs = { k : js_loads(v) for k,v in items.items() }

            return objs
        return {}

    def reset_table(self):
        try:
            self.drop_table()
        except Exception as e:
            pass
        if self.create_table(): return True


    def create_table(self):
        status = False
        try:
            status = self.____db____.tx( self.____create_table____ )()
        except Exception as e:
            pass
        if status: return True
        return False


    def drop_table(self):
        status = False
        try:
            status = self.____db____.tx( self.____drop_table____ )()
        except Exception as e:
            pass
        if status: return True
        return False
