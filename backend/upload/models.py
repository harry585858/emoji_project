from django.db import models
from django.contrib.auth.models import User

class Images(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='images/')  # 업로드시 S3로 자동 업로드
    uploader = models.ForeignKey(User, on_delete=models.CASCADE)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    #tag,

    def __str__(self):
        return self.name
