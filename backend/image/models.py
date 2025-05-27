from django.db import models
from django.contrib.auth.models import User

class Images(models.Model):
    imageID = models.AutoField(db_column='imageID', primary_key=True)  # Field name made lowercase.
    userID = models.ForeignKey(User, on_delete=models.CASCADE, db_column='userID')  # Field name made lowercase.
    title = models.CharField(max_length=20)
    createDate = models.DateTimeField(db_column='createDate', auto_now_add=True)
    viewCount = models.IntegerField(db_column='viewCount', default=0)
    imageURL = models.ImageField(db_column='imageURL', upload_to='images/')

    class Meta:
        managed = False
        db_table = 'images'


class Tags(models.Model):
    #pk = models.CompositePrimaryKey('imageID', 'tag')
    id = models.AutoField(db_column='id', primary_key=True)
    imageID = models.ForeignKey(Images, on_delete=models.CASCADE, db_column='imageID')  # Field name made lowercase.
    tag = models.CharField(max_length=10)

    class Meta:
        managed = False
        db_table = 'tags'
        unique_together = (('imageID', 'tag'),)


class Favoriteimages(models.Model):
    #pk = models.CompositePrimaryKey("userID", "imageID")
    id = models.AutoField(db_column='id', primary_key=True)
    userID = models.ForeignKey(User, on_delete=models.CASCADE, db_column='userID')  # Field name made lowercase.
    imageID = models.ForeignKey('Images', on_delete=models.CASCADE, db_column='imageID')  # Field name made lowercase.
    createDate = models.DateTimeField(db_column='createDate', auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'favoriteImages'
        unique_together = (('userID', 'imageID'),)


class Historys(models.Model):
    #pk = models.CompositePrimaryKey('userID', 'imageID')
    id = models.AutoField(db_column='id', primary_key=True)
    userID = models.ForeignKey(User, on_delete=models.CASCADE, db_column='userID')  # Field name made lowercase.
    imageID = models.ForeignKey('Images', on_delete=models.CASCADE, db_column='imageID')  # Field name made lowercase.
    watchDate = models.DateTimeField(db_column='watchDate', auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'historys'
        unique_together = (('userID', 'imageID'),)


class Modimages(models.Model):
    #pk = models.CompositePrimaryKey('imageID', 'title')
    imageID = models.ForeignKey(Images, on_delete=models.CASCADE, db_column='imageID')  # Field name made lowercase.
    imageURL = models.ImageField(db_column='imageURL', upload_to='images/')
    title = models.CharField(max_length=20)

    class Meta:
        managed = False
        db_table = 'modImages'
        unique_together = (('imageID', 'title'),)