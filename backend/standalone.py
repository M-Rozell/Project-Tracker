import pymysql
conn = pymysql.connect(
    host='127.0.0.1',
    user='root',
    password='20Grease23!@',
    database='project_tracker',
    port=3306
)
print("Connected!")