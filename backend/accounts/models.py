from django.db import models

class Users(models.Model):
	userID = models.CharField(db_column='userID', primary_key=True, max_length=20)  # Field name made lowercase.
	userPW = models.CharField(db_column='userPW', max_length=20)  # Field name made lowercase.
	createdate = models.DateTimeField(db_column='createDate', blank=True, null=True)  # Field name made lowercase.
	nickname = models.CharField(db_column='nickname', max_length=20)
	class Meta:
		managed = False
		db_table = 'users'
