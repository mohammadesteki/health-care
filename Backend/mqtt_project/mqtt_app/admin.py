from django.contrib import admin

from .models import Record
from .models import Fallen
# Register your models here.
admin.site.register(Record)
admin.site.register(Fallen)
