from django.db import models
from django.contrib.auth.models import User

class Images(models.Model):
    imageid = models.AutoField(db_column='imageID', primary_key=True)  # Field name made lowercase.
    userid = models.ForeignKey(User, models.DO_NOTHING, db_column='userID')  # Field name made lowercase.
    title = models.CharField(max_length=20)
    createdate = models.DateTimeField(db_column='createDate', auto_now_add=True)
    viewcount = models.IntegerField(db_column='viewCount', default=0)
    imageurl = models.ImageField(upload_to='images/') #이렇게 수정해도 RDS <- URL / S3 <- .jpg 저장

    class Meta:
        managed = False
        db_table = 'images'

class Tags(models.Model):
    #pk = models.CompositePrimaryKey('imageID', 'tag')
    imageid = models.ForeignKey(Images, models.DO_NOTHING, db_column='imageID')  # Field name made lowercase.
    tag = models.CharField(max_length=10)

    class Meta:
        managed = False
        db_table = 'tags'
        unique_together = (('imageid', 'tag'),)


class Favoriteimages(models.Model):
    #pk = models.CompositePrimaryKey("userID", "imageID")
    userid = models.ForeignKey(User, models.DO_NOTHING, db_column='userID')  # Field name made lowercase.
    imageid = models.ForeignKey('Images', models.DO_NOTHING, db_column='imageID')  # Field name made lowercase.
    createdate = models.DateTimeField(db_column='createDate', auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'favoriteimages'
        unique_together = (('userid', 'imageid'),)


class Historys(models.Model):
    #pk = models.CompositePrimaryKey('userID', 'imageID')
    userid = models.ForeignKey(User, models.DO_NOTHING, db_column='userID')  # Field name made lowercase.
    imageid = models.ForeignKey('Images', models.DO_NOTHING, db_column='imageID')  # Field name made lowercase.
    watchdate = models.DateTimeField(db_column='createDate', auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'historys'
        unique_together = (('userid', 'imageid'),)


class Modimages(models.Model):
    #pk = models.CompositePrimaryKey('imageID', 'title')
    imageid = models.ForeignKey(Images, models.DO_NOTHING, db_column='imageID')  # Field name made lowercase.
    imageurl = models.ImageField(db_column='imageURL', upload_to='images/')
    title = models.CharField(max_length=20)

    class Meta:
        managed = False
        db_table = 'modimages'
        unique_together = (('imageid', 'title'),)