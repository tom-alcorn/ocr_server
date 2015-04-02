from fabric.api import *
from fabric.context_managers import cd


env.user = 'apprunner'
env.hosts = ['192.168.132.202']  # aka display-feeds
# env.key_filename = '~/.ssh/id_rsa.pub'
env.repository = 'tom-alcorn@github.com:tom-alcorn/ocr_server.git'
code_dir = '/home/apprunner/ocr/ocr_server'


def deploy():
    with settings(warn_only=True):
        if run("test -d %s" % code_dir).failed:
            run("git clone https://{repo} {dir}".format(repo=env.repository, dir=code_dir))
    with cd(code_dir):
        run("git pull")


def run_server():
    run("bash %s/start_server.sh" % code_dir)
    check_log()


def check_log():
    run("cat %s/start_server.log" % code_dir)


def test():
    with settings(warn_only=True):
        result = local(
            "python test_tasks.py -v && python test_users.py -v", capture=True
        )
    if result.failed and not confirm("Tests failed. Continue?"):
        abort("Aborted at user request.")
