from django.db import models

class Users (models.Model):
	userID = models.CharField(db_column='userID', primary_key=True, max_length=20)  # Field name made lowercase.
	userPW = models.CharField(db_column='userPW', max_length=20)  # Field name made lowercase.
	createDate = models.DateTimeField(db_column='createDate', blank=True, null=True)  # Field name made lowercase.
	# class Meta:
	# 	managed = True
	# 	db_table = 'userss'

# {
#     "userID": "test",
#     "userPW": "1234",
# 	"nickName":"asdf"
# }