import os
import asyncio
import sys
import subprocess
import signal
from collections import namedtuple

import pathlib
ROOT_PATH = pathlib.Path(__file__).absolute().parent.parent.parent

def kill(PID):
    try                      : os.kill(PID, signal.SIGTERM)
    except Exception as e    : pass
    finally:
        try                  : os.kill(PID, signal.SIGKILL)
        except Exception as e: pass

def isActive(PID):
    try           : os.kill(PID, 0)
    except OSError: return False
    else          : return True

class live:
    def __init__(self, log):
        self.log = f"{ ROOT_PATH }/logs/{ log }"
        self.pid = None

    async def run(self, code):
        outfile = open(f"{ self.log }", 'w')
        proc = await asyncio.create_subprocess_exec(
        sys.executable, '-c', code,
        stdout=outfile,
        stderr=outfile
        )
        self.pid = proc.pid
        return proc.pid

    async def cmd(self, cmd):
        outfile = open(f"{ self.log }", 'w')
        proc = await asyncio.create_subprocess_shell(
            cmd,
            stdout=outfile,
            stderr=outfile
        )
        self.pid = proc.pid
        return proc.pid

    def kill(self, pid=None):
        if pid: PID=pid
        else  : PID=self.pid
        kill(PID)

codex           = live('py_log_single_run.txt')
code_template   = live('py_log_from_server.txt')
code_bash       = live('sh_log.txt')

class Pylive:
    @staticmethod
    async def run(code)     : return await codex.run(code)

    @staticmethod
    async def cmd(code)     : return await code_bash.cmd(code)

    @staticmethod
    def isActive(pid)       : return isActive(pid)

    @staticmethod
    def kill(pid)           : kill(pid)

    @staticmethod
    async def server(code)  : return await code_template.run( code )

#Wrap
pylive = Pylive()

def get_os():
    this_os = sys.platform
    if   this_os == "darwin"            : return 'mac'
    elif this_os == "win32"             : return 'windows'
    elif this_os.startswith('linux')    : return 'linux'
